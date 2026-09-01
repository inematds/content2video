#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$ROOT_DIR/.runtime/content2video.pid"

if [[ ! -f "$PID_FILE" ]]; then
  echo "Content2Video não está em execução."
  exit 0
fi

pid="$(<"$PID_FILE")"
if [[ ! "$pid" =~ ^[0-9]+$ ]] || ! kill -0 "$pid" 2>/dev/null; then
  rm -f -- "$PID_FILE"
  echo "PID antigo removido; não havia processo em execução."
  exit 0
fi

process_cwd="$(readlink -f "/proc/$pid/cwd" 2>/dev/null || true)"
process_cmd="$(tr '\0' ' ' <"/proc/$pid/cmdline" 2>/dev/null || true)"
if [[ "$process_cwd" != "$ROOT_DIR" || "$process_cmd" != *"app/server.mjs"* ]]; then
  echo "O PID $pid não pertence ao Content2Video deste diretório; nada foi encerrado." >&2
  exit 1
fi

kill -TERM "$pid"
for _ in {1..50}; do
  if ! kill -0 "$pid" 2>/dev/null; then
    rm -f -- "$PID_FILE"
    echo "Content2Video encerrado."
    exit 0
  fi
  sleep 0.2
done

echo "O processo não encerrou em 10 segundos; enviando SIGKILL." >&2
kill -KILL "$pid"
rm -f -- "$PID_FILE"
echo "Content2Video encerrado à força."
