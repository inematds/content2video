#!/usr/bin/env bash
set -euo pipefail

project_dir="/home/nmaldaner/projetos/content2video/videos/zuckerberg-anti-dolly-parton"
role_file="$project_dir/.hyperframes/frame-packets/_role.md"
log_dir="$project_dir/.hyperframes/worker-logs"
mkdir -p "$log_dir" "$project_dir/compositions/frames"

run_worker() {
  local frame_id="$1"
  local packet_file="$project_dir/.hyperframes/frame-packets/$frame_id.md"
  {
    sed -n '1,$p' "$role_file"
    printf '\n## Dispatch context\n\n'
    printf -- '- PROJECT_DIR: %s\n' "$project_dir"
    printf -- '- frame_id: %s\n' "$frame_id"
    printf -- '- Packet: %s (read this first, in full)\n' "$packet_file"
    printf -- '- Confirmed sketch exists: no\n'
    printf -- '- Canvas: 1080x1920\n'
    printf -- '- Captions: enabled; keep all important content above y=1600px\n'
    printf -- '- Write only compositions/frames/%s.html and stop after the self-check.\n' "$frame_id"
  } | codex exec --ephemeral --sandbox danger-full-access --skip-git-repo-check -C "$project_dir" - \
      >"$log_dir/$frame_id.log" 2>&1
}

frames=(
  01-dois-consensos
  02-a-regua
  03-dolly-no-alto
  04-zuckerberg-no-piso
  05-a-distancia-total
  06-a-leitura-da-manchete
  07-o-que-o-dado-nao-diz
  08-leia-a-convergencia
)

for wave_start in 0 4; do
  pids=()
  for offset in 0 1 2 3; do
    index=$((wave_start + offset))
    run_worker "${frames[$index]}" &
    pids+=("$!")
  done
  for pid in "${pids[@]}"; do
    wait "$pid"
  done
done

printf 'workers complete\n'
