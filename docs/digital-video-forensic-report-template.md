# Digital Video Forensic Report Template

Use this template to document technical analysis of a digital video file. Replace bracketed placeholders (e.g., `[CASE_ID]`) with case-specific details and remove any sections that do not apply.

---

## Case Information

- **Case ID:** [CASE_ID]
- **Agency / Organization:** [AGENCY]
- **Examiner:** [EXAMINER_NAME]
- **Date of Report:** [REPORT_DATE]

## Subject Information

**Subject File (Primary Evidence)**

- **File Name:** 1112-King-Road-Surveillance-330-AM-430-AM.mov
- **Evidence ID:** [SUBJECT_EVIDENCE_ID]
- **Source (how obtained):** [SUBJECT_SOURCE_DESCRIPTION]
- **Date/Time Acquired:** [SUBJECT_ACQUISITION_DATETIME]
- **Storage Location / Path:** [SUBJECT_STORAGE_PATH]

**Comparison File (If Applicable)**

- **File Name:** [COMPARISON_FILE_NAME]
- **Evidence ID:** [COMPARISON_EVIDENCE_ID]
- **Source (how obtained):** [COMPARISON_SOURCE_DESCRIPTION]
- **Date/Time Acquired:** [COMPARISON_ACQUISITION_DATETIME]
- **Storage Location / Path:** [COMPARISON_STORAGE_PATH]

## Purpose of Examination

Describe the goals for the examination, including (as applicable):

- Technical file properties (container, codecs, structure).
- Metadata indicating provenance, processing history, and timestamps.
- Similarities and differences between file versions (if more than one).
- Potential indicators of re-encoding, transcoding, or content alteration.

## Tools and Methods

List tools and commands used (with versions), for example:

- ExifTool (version [EXIFTOOL_VERSION]) for metadata extraction.
- FFmpeg / ffprobe (version [FFMPEG_VERSION]) for container/stream analysis.
- Cryptographic hashing tools (e.g., `sha256sum`) for file integrity verification.
- Additional tools: [OTHER_TOOLS].

Describe your procedure, including steps such as:

1. Verify file integrity using cryptographic hashes.
2. Extract and preserve full metadata from each file.
3. Examine container and codec characteristics.
4. Examine time-related metadata fields.
5. Review provenance indicators (encoder, vendor, software tags).
6. Compare metadata and stream structure between file versions (if applicable).
7. Document any anomalies, inconsistencies, or potential red flags.
8. Record limitations and interpretative boundaries of the analysis.

## Section 1: File Identification and Chain of Custody

**Subject File**

- **File Name:** 1112-King-Road-Surveillance-330-AM-430-AM.mov
- **Evidence ID:** [SUBJECT_EVIDENCE_ID]
- **Original Source (system/device/person):** [SUBJECT_ORIGINAL_SOURCE]
- **Acquisition Method (e.g., direct DVR export, cloud download):** [SUBJECT_ACQUISITION_METHOD]
- **Date/Time of Acquisition:** [SUBJECT_ACQUISITION_DATETIME]
- **Hash Algorithm(s) Used:** [HASH_ALGORITHMS_USED]
- **SHA-256:** [SUBJECT_SHA256]
- **MD5 (if used):** [SUBJECT_MD5]
- **Storage Media / Location:** [SUBJECT_STORAGE_DETAILS]

**Comparison File (if any)**

- **File Name:** [COMPARISON_FILE_NAME]
- **Evidence ID:** [COMPARISON_EVIDENCE_ID]
- **Original Source (system/device/person):** [COMPARISON_ORIGINAL_SOURCE]
- **Acquisition Method:** [COMPARISON_ACQUISITION_METHOD]
- **Date/Time of Acquisition:** [COMPARISON_ACQUISITION_DATETIME]
- **SHA-256:** [COMPARISON_SHA256]
- **MD5 (if used):** [COMPARISON_MD5]
- **Storage Media / Location:** [COMPARISON_STORAGE_DETAILS]

**Notes on Chain of Custody**

- [CHAIN_OF_CUSTODY_NOTES]

## Section 2: Container and Codec Characteristics

Provide details for the subject file and highlight comparison notes if applicable.

**Subject File**

- **Container Format:** QuickTime / MOV (`format_name`: `mov,mp4,m4a,3gp,3g2,mj2`), file type MOV, MIME type `video/quicktime`.
- **Major/Compatible Brands:** Major brand Apple QuickTime (`qt  `); compatible brands `qt  `.
- **Video Codec:** MPEG-4 Part 2 (`mpeg4`), Simple Profile, Compressor ID `mp4v`, compressor name `Lavc58.123.100 mpeg4`.
- **Audio Codec:** AAC (LC profile), `AudioFormat`: `mp4a`.
- **Resolution and Pixel Format:** 1920×1080, pixel aspect ratio 1:1, ~16:9 display aspect ratio, pixel format `yuv420p`, reported bit depth 24.
- **Frame Rate and Duration:** 30 fps (r_frame_rate/avg_frame_rate: `30/1`); duration ~59:47 (3587.203991 seconds).
- **Bitrates:** Overall ~6.91 Mbps; container `bit_rate`: 6,912,928 bps; video stream `bit_rate`: 6,793,818 bps; audio stream `bit_rate`: 112,393 bps.

**Comparison File Summary (if analyzed)**

- **Container Format:** [COMPARISON_CONTAINER_FORMAT]
- **Codecs:** [COMPARISON_CODECS]
- **Resolution / Frame Rate:** [COMPARISON_RES_FR]
- **Duration:** [COMPARISON_DURATION]

**Observations**

- The subject file is a 1920×1080, 30 fps MOV using MPEG-4 Part 2 video and AAC audio at ~6.9 Mbps, consistent with a transcoded or export-quality surveillance clip rather than a low-bitrate DVR-native stream.
- The container/codec combination is plausible but may differ from typical DVR-native formats (often H.264/H.265).

## Section 3: Temporal Metadata (Dates and Times)

List extracted timestamp fields and analysis.

**Extracted Values**

- `CreateDate`: 0000:00:00 00:00:00
- `ModifyDate`: 0000:00:00 00:00:00
- `TrackCreateDate`: 0000:00:00 00:00:00
- `TrackModifyDate`: 0000:00:00 00:00:00
- `MediaCreateDate`: 0000:00:00 00:00:00
- `MediaModifyDate`: 0000:00:00 00:00:00

**Analysis of Temporal Metadata**

- All primary date/time fields contain zeroed placeholders, rather than real-world timestamps.
- The consistent use of `0000:00:00 00:00:00` suggests timestamps were not preserved or were reset during conversion/export.
- No reliable embedded timestamps are available to confirm the alleged recording interval.
- Comparison with on-screen/burned-in timestamps (if applicable): [ONSCREEN_TIME_COMPARISON].

**Conclusions for Temporal Metadata**

- Embedded timestamps cannot be relied upon to establish the actual recording date/time. Zeroed values indicate processing or re-export that did not preserve original metadata.

## Section 4: Provenance Indicators (Software, Vendor, Handlers)

Summarize provenance-related metadata.

**Subject File**

- **VendorID (ExifTool):** FFmpeg
- **Container encoder:** `Lavf58.67.100`
- **Video stream tags:** `handler_name` "ISO Media file produced by Google Inc.", `vendor_id` "FFMP", `encoder` "Lavc58.123.100 mpeg4"
- **Audio stream tags:** `handler_name` "ISO Media file produced by Google Inc.", `vendor_id` "[0][0][0][0]"

**Interpretation**

- FFmpeg-related VendorID/encoder strings indicate the file was processed or transcoded using FFmpeg-based software.
- Google-related handler names suggest production or repackaging by Google-associated services (e.g., Google Photos/Drive).
- The combined indicators point to a derived/transcoded copy rather than a direct, unmodified camera-original export.

**Comparison Notes (if applicable)**

- [PROVENANCE_COMPARISON_NOTES]

## Section 5: Encoding Parameters and Structural Characteristics

Detail encoding parameters and any anomalies.

**Subject File**

- **Total Duration:** ~0:59:47 (3587.2 seconds).
- **Video Frame Rate:** 30 fps.
- **Image Size:** 1920 × 1080.
- **Total Video Frame Count:** `nb_frames` ≈ 107,614 (consistent with 30 fps).
- **GOP Structure / B-frames:** `has_b_frames`: 0 (IP-only structure).
- **Bitrate Characteristics:** Overall ~6.9 Mbps; video ~6.79 Mbps; audio ~112 kbps.
- **Encoding Anomalies:** No abrupt changes in resolution/bitrate evident in metadata; use of MPEG-4 Part 2 with FFmpeg encoders is more typical of a transcoded or converted file than many DVR-native formats.

**Comparison File Notes (if applicable)**

- [COMPARISON_ENCODING_NOTES]

**Interpretation**

- Duration, frame count, and frame rate are internally consistent. The codec/encoder choices align with a re-encoded or converted file rather than a native DVR export.

## Section 6: Audio Characteristics

**Subject File**

- **Codec:** AAC (LC profile), `AudioFormat`: `mp4a`.
- **Sample Rate:** 44,100 Hz.
- **Channel Layout:** 2-channel stereo; `channel_layout`: `stereo`.
- **Audio Duration:** ~0:59:47 (aligned with video duration, allowing for minor encoding differences).

**Observed Audio Anomalies (if any)**

- [AUDIO_ANOMALIES]

**Relationship to Video (sync, continuity, etc.)**

- [AUDIO_VIDEO_SYNC_OBSERVATIONS]

## Section 7: Direct Comparison Between File Versions

Use this section when a comparison file exists.

- **Hash Comparison:** Subject SHA-256 [SUBJECT_SHA256]; Comparison SHA-256 [COMPARISON_SHA256]; Hash Match? [YES/NO].
- **Metadata Comparison (ExifTool):** [EXIF_METADATA_DIFF_SUMMARY]
- **Container/Stream Comparison (ffprobe):** [FFPROBE_DIFF_SUMMARY]
- **Frame-Level Comparison (framemd5):** [FRAME_LEVEL_DIFF_SUMMARY]

**Interpretation of Differences**

- [FILE_VERSION_COMPARISON_CONCLUSIONS]

## Section 8: Identified Red Flags and Anomalies

Document potential red flags.

1. All primary date/time metadata fields are zeroed (0000:00:00 00:00:00), preventing reliable use of embedded timestamps.
2. FFmpeg-related VendorID/encoder values (e.g., `FFmpeg`, `Lavf58.67.100`, `Lavc58.123.100 mpeg4`) show the file was processed/transcoded and is not camera-original.
3. Stream handler names ("ISO Media file produced by Google Inc.") indicate production or repackaging in a Google-related media pipeline, raising chain-of-custody considerations.
4. [ADDITIONAL_RED_FLAGS]

For each red flag, explain significance relative to chain of custody and expected behavior of the recording system.

## Section 9: Limitations of the Analysis

Clarify constraints affecting interpretation, such as:

- Lack of direct access to the original recording device or DVR system.
- Absence of camera-original files for comparison.
- Inability of metadata alone to conclusively prove or disprove frame-level tampering.
- Environmental or procedural constraints during acquisition or analysis.
- [OTHER_LIMITATIONS]

## Section 10: Conclusions

Summarize findings in neutral language, for example:

- What the technical evidence supports (e.g., that the file is a transcoded derivative produced by specific software).
- What the technical evidence contradicts (if anything).
- What remains uncertain or indeterminate.
- Recommendations for further examination (e.g., acquisition of device-original files, DVR system inspection, additional image/video forensics).

## Examiner Signature

- **Name:** [EXAMINER_NAME]
- **Title/Role:** [EXAMINER_TITLE]
- **Date:** [REPORT_DATE]
- **Signature (if printed):** `______________________________`
