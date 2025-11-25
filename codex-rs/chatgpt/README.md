# ChatGPT

This crate pertains to first party ChatGPT APIs and products such as Codex agent.

## Features

- **Task Retrieval**: Fetch Codex agent task data from the ChatGPT backend API
- **Diff Application**: Apply diffs from ChatGPT tasks to local git repositories
- **Authentication**: Seamless integration with ChatGPT authentication tokens

## Usage

This crate is integrated into the Codex CLI through the `codex apply` command:

```bash
codex apply <task_id>
```

See the [apply command documentation](../../docs/apply.md) for more details.

## Architecture

- `chatgpt_client.rs`: HTTP client for ChatGPT backend API requests
- `chatgpt_token.rs`: Token management and authentication
- `get_task.rs`: Task retrieval and parsing
- `apply_command.rs`: CLI command implementation for applying diffs

## Configuration

The ChatGPT integration respects the following configuration options:

- `chatgpt_base_url`: Base URL for the ChatGPT backend API (default: `https://chatgpt.com/backend-api/`)
- `forced_login_method`: Can be set to `"chatgpt"` to require ChatGPT login
- `forced_chatgpt_workspace_id`: Optionally restrict to a specific workspace

See [Configuration docs](../../docs/config.md) for full details.

---

This crate should be primarily built and maintained by OpenAI employees. Please reach out to a maintainer before making an external contribution.
