#!/usr/bin/env bash
set -u

project_dir="$(pwd)"
role_file="$project_dir/.hyperframes/frame-packets/_role.md"
logs_dir="$project_dir/.hyperframes/worker-logs"
mkdir -p "$logs_dir" "$project_dir/compositions/frames"

build_frame() {
  frame_id="$1"
  packet_file="$project_dir/.hyperframes/frame-packets/$frame_id.md"
  output_file="$project_dir/compositions/frames/$frame_id.html"
  log_file="$logs_dir/$frame_id.log"

  prompt="Read these two files completely before acting: $role_file and $packet_file.

## Dispatch context
PROJECT_DIR: $project_dir
frame_id: $frame_id
confirmed sketch: no
canvas: 1080x1920
Captions: enabled; keep-out begins at y=1594px.

Follow the role and packet exactly. Write only $output_file. Do not edit STORYBOARD.md or any sibling file."

  codex exec \
    --ephemeral \
    --sandbox danger-full-access \
    --skip-git-repo-check \
    "$prompt" >"$log_file" 2>&1
}

export -f build_frame
export project_dir role_file logs_dir

printf '%s\n' \
  01-direcao 02-jornada 03-trilha 04-foco \
  05-projetos 06-perfis 07-comunidade 08-cta \
  | xargs -n 1 -P 4 bash -c 'build_frame "$1"' _

missing=0
for frame_id in 01-direcao 02-jornada 03-trilha 04-foco 05-projetos 06-perfis 07-comunidade 08-cta; do
  output_file="$project_dir/compositions/frames/$frame_id.html"
  if [[ ! -s "$output_file" ]]; then
    echo "missing: $frame_id"
    missing=1
  else
    echo "built: $frame_id"
  fi
done

exit "$missing"
