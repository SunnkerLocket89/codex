import os
import subprocess

# 1. Point this at the top-level folder that holds your PDFs/images/videos.
ROOT_DIR = r"/path/to/your/evidence_folder"  # <--- CHANGE THIS

# 2. Name of the CSV file with all metadata (open it in Excel).
OUTPUT_CSV = "metadata_master.csv"

# 3. File types you care about (add/remove as needed).
EXTENSIONS = [
    "pdf",
    "jpg",
    "jpeg",
    "png",
    "tif",
    "tiff",
    "heic",
    "mp4",
    "mov",
    "avi",
    "mkv",
]


def build_exiftool_command(root_dir: str, output_csv: str, exts):
    cmd = [
        "exiftool",
        "-api",
        "RequestAll=3",  # pull as much as possible
        "-api",
        "largefilesupport=1",  # safer with big video files
        "-G1",  # show tag groups (helps later)
        "-csv",  # Excel-friendly output
        "-r",  # recurse into subfolders
    ]

    # Add each extension as a filter
    for ext in exts:
        cmd.extend(["-ext", ext])

    # Folder to scan goes last
    cmd.append(root_dir)

    return cmd, output_csv


def run_exiftool_metadata_dump():
    cmd, out_csv = build_exiftool_command(ROOT_DIR, OUTPUT_CSV, EXTENSIONS)

    # Make sure we’re not appending to an old file by accident
    if os.path.exists(out_csv):
        os.remove(out_csv)

    print("Running ExifTool… this can take a while on large trees.")
    print("Command:", " ".join(cmd))

    # Run ExifTool and write CSV directly
    with open(out_csv, "w", encoding="utf-8", newline="") as f:
        subprocess.run(cmd, check=True, stdout=f)

    print(f"Done. Metadata written to: {os.path.abspath(out_csv)}")


if __name__ == "__main__":
    run_exiftool_metadata_dump()
