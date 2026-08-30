import { readFileSync, writeFileSync } from "node:fs";

const neutral = JSON.parse(readFileSync("audio_engine_meta.json", "utf8"));
const script = readFileSync("SCRIPT.md", "utf8");
const lineText = new Map();
let activeFrame = null;
for (const line of script.split(/\r?\n/)) {
  const heading = line.match(/^#{2,3}\s+.*?\(Frame\s+(\d+)\)/i);
  if (heading) {
    activeFrame = String(Number(heading[1])).padStart(2, "0");
    continue;
  }
  const spoken = line.match(/^(?: {4,}|\t)(.+)$/);
  if (activeFrame && spoken) {
    const previous = lineText.get(activeFrame) ?? "";
    lineText.set(activeFrame, `${previous}${previous ? " " : ""}${spoken[1].trim()}`);
  }
}

function estimatedWords(id, duration) {
  const tokens = (lineText.get(String(id)) ?? "").match(/[\p{L}\p{N}%]+(?:[-’'][\p{L}\p{N}%]+)*[.,;:!?]?/gu) ?? [];
  if (!tokens.length) return [];
  const weights = tokens.map((token) => 1 + (/[.,;:!?]$/.test(token) ? 0.55 : 0));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = 0;
  return tokens.map((token, index) => {
    const start = cursor;
    cursor += duration * (weights[index] / total);
    return {
      id: `w${index}`,
      text: token.replace(/[.,;:!?]$/, ""),
      start: Number(start.toFixed(3)),
      end: Number(cursor.toFixed(3))
    };
  });
}

const voices = (neutral.voices ?? []).map((voice) => ({
  frame: Number(voice.id),
  path: voice.path,
  duration_s: voice.duration_s,
  words: ((voice.words?.length ? voice.words : estimatedWords(voice.id, voice.duration_s)) ?? []).map((word) => ({
    id: word.id,
    text: word.text,
    start: word.start,
    end: word.end
  }))
}));

const meta = {
  bgm: null,
  bgm_pending: false,
  voices,
  sfx: []
};

writeFileSync("audio_meta.json", `${JSON.stringify(meta, null, 2)}\n`);
console.log(`converted ${voices.length} voice lines → audio_meta.json`);
