import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const scriptPath = join(projectRoot, "SCRIPT.md");
const outPath = join(projectRoot, "audio_meta.json");
const voice = process.env.C2V_VOICE ?? "pt-BR-FranciscaNeural";

function fail(message) {
  console.error(`audio: ${message}`);
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    fail(`${command} falhou (${result.status}): ${(result.stderr || result.stdout).trim()}`);
  }
  return result.stdout;
}

function parseScript(markdown) {
  const lines = markdown.split(/\r?\n/);
  const items = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^##\s+Line\s+\d+.*?\(Frame\s+(\d+)\)/i);
    if (heading) {
      if (current?.text) items.push(current);
      current = { frame: Number(heading[1]), text: "" };
      continue;
    }
    if (current) {
      const spoken = line.match(/^(?: {4}|\t)(.+)$/);
      if (spoken) current.text += `${current.text ? " " : ""}${spoken[1].trim()}`;
    }
  }
  if (current?.text) items.push(current);
  return items;
}

function vttTime(value) {
  const match = value.match(/(?:(\d+):)?(\d+):(\d+)[.,](\d+)/);
  if (!match) return 0;
  return Number(match[1] ?? 0) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(`0.${match[4]}`);
}

function parseVtt(vtt, duration) {
  const cues = [];
  const lines = vtt.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const timing = lines[index].match(/(\d{2}:\d{2}:\d{2}[.,]\d+)\s+-->\s+(\d{2}:\d{2}:\d{2}[.,]\d+)/);
    if (!timing) continue;
    const text = (lines[index + 1] ?? "").replace(/<[^>]+>/g, "").trim();
    if (text) cues.push({ start: vttTime(timing[1]), end: vttTime(timing[2]), text });
  }

  const words = [];
  for (const cue of cues) {
    const tokens = cue.text.split(/\s+/).filter(Boolean);
    const slice = Math.max(0.04, (cue.end - cue.start) / Math.max(1, tokens.length));
    tokens.forEach((text, offset) => {
      words.push({
        id: `w${words.length}`,
        text,
        start: Number((cue.start + slice * offset).toFixed(3)),
        end: Number(Math.min(cue.end, cue.start + slice * (offset + 1)).toFixed(3)),
      });
    });
  }

  if (words.length) return words;
  return [{ id: "w0", text: "", start: 0, end: duration }];
}

const items = parseScript(readFileSync(scriptPath, "utf8"));
if (!items.length) fail("nenhuma linha de narração encontrada em SCRIPT.md");

const voices = [];
for (const item of items) {
  const id = String(item.frame).padStart(2, "0");
  const mediaDir = join(projectRoot, "assets", "voice");
  mkdirSync(mediaDir, { recursive: true });
  const mp3Path = join(mediaDir, `${id}.mp3`);
  const wavPath = join(mediaDir, `${id}.wav`);
  const vttPath = join(mediaDir, `${id}.vtt`);

  run("edge-tts", ["--voice", voice, "--text", item.text, "--write-media", mp3Path, "--write-subtitles", vttPath]);
  run("ffmpeg", ["-y", "-loglevel", "error", "-i", mp3Path, "-ar", "44100", "-ac", "1", wavPath]);
  const duration = Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", wavPath]).trim());
  const words = parseVtt(readFileSync(vttPath, "utf8"), duration);

  voices.push({
    frame: item.frame,
    path: `assets/voice/${id}.wav`,
    duration_s: Number(duration.toFixed(3)),
    words,
  });
  rmSync(mp3Path, { force: true });
}

const totalDuration = voices.reduce((sum, item) => sum + item.duration_s, 0);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify({
  provider: "edge-tts",
  voice,
  voices,
  bgm: null,
  sfx: [],
  total_duration_s: Number(totalDuration.toFixed(3)),
}, null, 2)}\n`);

console.log(`audio: ${voices.length} cenas, ${totalDuration.toFixed(2)}s de fala, voz ${voice}`);
