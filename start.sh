#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME_DIR="$ROOT_DIR/.runtime"
PID_FILE="$RUNTIME_DIR/content2video.pid"
LOG_FILE="$RUNTIME_DIR/content2video.log"

read_env_value() {
  local name="$1"
  local file="$ROOT_DIR/.env"
  [[ -f "$file" ]] || return 0
  sed -nE "s/^[[:space:]]*${name}[[:space:]]*=[[:space:]]*['\"]?([^'\"#[:space:]]+).*/\1/p" "$file" | tail -n 1
}

APP_PORT="${APP_PORT:-$(read_env_value APP_PORT)}"
APP_PORT="${APP_PORT:-3000}"
APP_HOST="${APP_HOST:-0.0.0.0}"
PREVIEW_HOST="${PREVIEW_HOST:-0.0.0.0}"

if [[ ! "$APP_PORT" =~ ^[0-9]+$ ]] || (( APP_PORT < 1 || APP_PORT > 65535 )); then
  echo "APP_PORT inválida: $APP_PORT" >&2
  exit 1
fi

mkdir -p "$RUNTIME_DIR"

if [[ -f "$PID_FILE" ]]; then
  pid="$(<"$PID_FILE")"
  if [[ "$pid" =~ ^[0-9]+$ ]] && kill -0 "$pid" 2>/dev/null; then
    echo "Content2Video já está em execução (PID $pid)."
    exit 0
  fi
  rm -f -- "$PID_FILE"
fi

cd "$ROOT_DIR"
nohup setsid env APP_HOST="$APP_HOST" APP_PORT="$APP_PORT" PREVIEW_HOST="$PREVIEW_HOST" \
  node app/server.mjs >>"$LOG_FILE" 2>&1 &
pid=$!
printf '%s\n' "$pid" >"$PID_FILE"

for _ in {1..50}; do
  if ! kill -0 "$pid" 2>/dev/null; then
    rm -f -- "$PID_FILE"
    echo "Falha ao iniciar o Content2Video. Consulte $LOG_FILE" >&2
    tail -n 20 "$LOG_FILE" >&2 || true
    exit 1
  fi
  if curl --noproxy '*' --silent --fail --max-time 1 "http://127.0.0.1:$APP_PORT/api/config" >/dev/null; then
    echo "Content2Video iniciado (PID $pid)."
    echo "Local: http://127.0.0.1:$APP_PORT"
    echo "Rede: use http://IP-DESTA-MAQUINA:$APP_PORT"
    echo "Log: $LOG_FILE"
    exit 0
  fi
  sleep 0.2
done

echo "O processo iniciou, mas não respondeu a tempo. Consulte $LOG_FILE" >&2
exit 1
