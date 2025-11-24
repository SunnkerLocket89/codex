import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ORIGINATOR_ENV = "CODEX_INTERNAL_ORIGINATOR_OVERRIDE";
const DEFAULT_ORIGINATOR = "codex_sdk_ts";

function parseArgs(argv) {
  const options = {
    model: null,
    sandbox: null,
    workingDirectory: null,
    skipGitRepoCheck: false,
    outputSchemaFile: null,
    images: [],
  };

  let resumeThreadId = null;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "exec":
      case "--experimental-json":
        break;
      case "--model":
        options.model = argv[++i] ?? null;
        break;
      case "--sandbox":
        options.sandbox = argv[++i] ?? null;
        break;
      case "--cd":
        options.workingDirectory = argv[++i] ?? null;
        break;
      case "--skip-git-repo-check":
        options.skipGitRepoCheck = true;
        break;
      case "--output-schema":
        options.outputSchemaFile = argv[++i] ?? null;
        break;
      case "--image":
        options.images.push(argv[++i] ?? "");
        break;
      case "resume":
        resumeThreadId = argv[++i] ?? null;
        break;
      default:
        break;
    }
  }

  return { options, resumeThreadId };
}

function isInsideGitRepo(directory) {
  const result = spawnSync("git", ["-C", directory, "rev-parse", "--is-inside-work-tree"], {
    stdio: "ignore",
  });
  return result.status === 0;
}

function statePath(threadId) {
  return path.join(os.tmpdir(), `codex-mock-${threadId}.json`);
}

function loadState(threadId) {
  try {
    const content = fs.readFileSync(statePath(threadId), "utf8");
    return JSON.parse(content);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function saveState(threadId, assistantText) {
  const data = { assistantText };
  fs.writeFileSync(statePath(threadId), JSON.stringify(data));
}

function readPromptFromStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    process.stdin.on("error", reject);
  });
}

function buildPayload(prompt, options, resumeThreadId) {
  const input = [];
  if (resumeThreadId) {
    const state = loadState(resumeThreadId);
    if (state?.assistantText) {
      input.push({
        role: "assistant",
        content: [
          {
            type: "output_text",
            text: state.assistantText,
          },
        ],
      });
    }
  }

  input.push({
    role: "user",
    content: [
      {
        type: "input_text",
        text: prompt,
      },
    ],
  });

  const payload = { input };
  if (options.model) {
    payload.model = options.model;
  }

  if (options.outputSchemaFile) {
    try {
      const schemaContent = fs.readFileSync(options.outputSchemaFile, "utf8");
      const schema = JSON.parse(schemaContent);
      payload.text = {
        format: {
          name: "codex_output_schema",
          type: "json_schema",
          strict: true,
          schema,
        },
      };
    } catch {
      // ignore schema read errors
    }
  }

  return payload;
}

function mapUsage(usage) {
  if (!usage) {
    return { cached_input_tokens: 0, input_tokens: 0, output_tokens: 0 };
  }
  const cached = usage.input_tokens_details?.cached_tokens ?? 0;
  return {
    cached_input_tokens: cached,
    input_tokens: usage.input_tokens ?? 0,
    output_tokens: usage.output_tokens ?? 0,
  };
}

async function streamResponses(url, payload, resumeThreadId) {
  const originator = process.env[ORIGINATOR_ENV] ?? DEFAULT_ORIGINATOR;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      originator: originator,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Failed to contact responses API: ${response.status}`);
  }

  const reader = response.body.getReader();
  let buffer = "";
  let assistantText = null;
  let threadId = resumeThreadId ?? null;
  let itemIndex = 0;
  let completed = false;

  function emit(event) {
    process.stdout.write(`${JSON.stringify(event)}\n`);
  }

  const processEvent = (event) => {
    switch (event.type) {
      case "response.created": {
        if (!threadId) {
          threadId = event.response?.id ?? `thread_${Date.now()}`;
        }
        emit({ type: "thread.started", thread_id: threadId });
        emit({ type: "turn.started" });
        break;
      }
      case "response.output_item.done": {
        const content = event.item?.content;
        const text = Array.isArray(content)
          ? content.find((entry) => entry?.type === "output_text")?.text ?? ""
          : "";
        assistantText = text;
        emit({
          type: "item.completed",
          item: {
            id: `item_${itemIndex}`,
            type: "agent_message",
            text,
          },
        });
        itemIndex += 1;
        break;
      }
      case "response.completed": {
        emit({ type: "turn.completed", usage: mapUsage(event.response?.usage) });
        completed = true;
        break;
      }
      case "error": {
        const message = event.error?.message ?? "unknown error";
        throw new Error(`stream disconnected before completion: ${message}`);
      }
      default:
        break;
    }
  };

  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += Buffer.from(value).toString("utf8");
      let separatorIndex = buffer.indexOf("\n\n");
      while (separatorIndex !== -1) {
        const rawEvent = buffer.slice(0, separatorIndex);
        buffer = buffer.slice(separatorIndex + 2);
        separatorIndex = buffer.indexOf("\n\n");

        const lines = rawEvent.split("\n");
        const dataLine = lines.find((line) => line.startsWith("data:"));
        if (!dataLine) continue;
        const payloadText = dataLine.slice("data:".length).trim();
        if (!payloadText) continue;
        try {
          const parsed = JSON.parse(payloadText);
          processEvent(parsed);
        } catch (error) {
          process.stderr.write(`Failed to parse event: ${error}\n`);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (!completed) {
    throw new Error("stream disconnected before completion: stream ended unexpectedly");
  }

  return { threadId, assistantText };
}

async function main() {
  try {
    const { options, resumeThreadId } = parseArgs(process.argv.slice(2));
    const prompt = await readPromptFromStdin();
    const baseUrl = process.env.OPENAI_BASE_URL;

    if (!options.skipGitRepoCheck && options.workingDirectory) {
      if (!isInsideGitRepo(options.workingDirectory)) {
        process.stderr.write("Not inside a trusted directory\n");
        process.exit(1);
        return;
      }
    }

    if (!baseUrl) {
      process.stderr.write("OPENAI_BASE_URL is required\n");
      process.exit(1);
    }

    const payload = buildPayload(prompt, options, resumeThreadId);
    const requestUrl = new URL("/responses", baseUrl).toString();
    const { threadId, assistantText } = await streamResponses(requestUrl, payload, resumeThreadId);

    if (threadId && assistantText) {
      saveState(threadId, assistantText);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
}

await main();
