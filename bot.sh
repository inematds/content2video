#!/usr/bin/env bash
# bot.sh — a porta do inemaccbot para o content2video.
#
#   bot.sh <url> [horizontal: sim|não]
#
# Faz o que a interface faz em dois cliques: `create` (o Codex lê a URL e monta
# o projeto HyperFrames) e depois `render` (MP4 + CTA INEMA.CLUB). Todo o
# progresso vai para o STDERR; a ÚLTIMA linha do STDOUT é só o caminho absoluto
# do MP4 — é o contrato da skill `kind: function` do bot.
#
# O slug ganha data e hora porque `create` recusa pasta que já existe: a mesma
# URL pedida duas vezes tem que gerar dois vídeos, não um erro.
#
# PATH: o serviço do bot roda sob systemd com PATH mínimo. `npx` e `codex`
# moram em ~/.npm-global/bin (instalação npm do usuário), que entra aqui.
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")"
for d in "$HOME/.npm-global/bin" "$HOME/.local/bin"; do
  case ":$PATH:" in *":$d:"*) ;; *) PATH="$d:$PATH" ;; esac
done
export PATH
# O HyperFrames precisa de um Chromium. O bot publica HYPERFRAMES_BROWSER_PATH;
# fora dele, o snap desta máquina serve de fallback.
if [ -z "${HYPERFRAMES_BROWSER_PATH:-}" ] && [ -x /snap/chromium/current/usr/lib/chromium-browser/chrome ]; then
  export HYPERFRAMES_BROWSER_PATH=/snap/chromium/current/usr/lib/chromium-browser/chrome
fi

URL="${1:-}"; HORIZONTAL="${2:-não}"
[ -n "$URL" ] || { echo "uso: bot.sh <url> [sim|não  (16:9 em vez de 9:16)]" >&2; exit 2; }
case "$URL" in http://*|https://*) ;; *) echo "a origem precisa ser uma URL http(s): $URL" >&2; exit 2 ;; esac

case "$(echo "$HORIZONTAL" | tr '[:upper:]' '[:lower:]')" in
  sim|s|yes|true|1) export VIDEO_ASPECT_RATIO=16:9 VIDEO_WIDTH=1920 VIDEO_HEIGHT=1080 ;;
esac

# Slug no formato que o video.mjs aceita: [a-z0-9][a-z0-9-]{0,79}
SEM_ESQUEMA="$(echo "$URL" | sed -E 's#^https?://##; s#[?\#].*##; s#/+$##')"
HOST="$(echo "$SEM_ESQUEMA" | sed -E 's#/.*##; s#^www\.##; s#\..*##')"
CAMINHO="$(echo "$SEM_ESQUEMA" | sed -E 's#^[^/]*##; s#.*/##')"
# `iconv` tira acentos; sem ele (ou se falhar), o sed abaixo ainda produz um
# slug válido — por isso o fallback: com `set -e` + pipefail, um iconv ausente
# derrubaria o script numa atribuição.
BASE="$( { echo "${HOST}${CAMINHO:+-$CAMINHO}" | iconv -f utf-8 -t ascii//TRANSLIT 2>/dev/null || echo "${HOST}${CAMINHO:+-$CAMINHO}"; } | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//' | cut -c1-58 || true)"
[ -n "$BASE" ] || BASE="video"
SLUG="${BASE}-$(date +%Y%m%d-%H%M%S)"

node scripts/video.mjs create "$URL" "$SLUG" >&2
node scripts/video.mjs render "$SLUG" >&2

SAIDA="$PWD/output/content2video/$SLUG/renders/$SLUG.mp4"
[ -s "$SAIDA" ] || { echo "render terminou mas o MP4 não está em $SAIDA" >&2; exit 1; }
echo "$SAIDA"
