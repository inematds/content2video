#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { mkdir, rename, unlink } from "node:fs/promises";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
loadEnv(path.join(ROOT, ".env"));

const settings = {
  provider: process.env.AI_PROVIDER || "codex",
  language: process.env.OUTPUT_LANGUAGE || "pt-BR",
  voiceProvider: process.env.VOICE_PROVIDER || "edge-tts",
  voiceId: process.env.VOICE_ID || "pt-BR-FranciscaNeural",
  targetDuration: numberSetting("TARGET_DURATION_SECONDS", 60),
  minimumDuration: numberSetting("MINIMUM_DURATION_SECONDS", 42),
  maximumDuration: numberSetting("MAXIMUM_DURATION_SECONDS", 78),
  minimumQuality: numberSetting("MINIMUM_QUALITY_SCORE", 8),
  aspectRatio: process.env.VIDEO_ASPECT_RATIO || "9:16",
  width: numberSetting("VIDEO_WIDTH", 1080),
  height: numberSetting("VIDEO_HEIGHT", 1920),
  fps: numberSetting("VIDEO_FPS", 30),
  renderQuality: process.env.RENDER_QUALITY || "high",
  previewPort: numberSetting("PREVIEW_PORT", 3022),
  videosDir: path.resolve(ROOT, process.env.VIDEOS_DIRECTORY || "./videos"),
  rendersDirName: process.env.RENDERS_DIRECTORY_NAME || "renders"
};

const [command = "help", value, optionalSlug] = process.argv.slice(2);

try {
  if (command === "create") await createVideo(value, optionalSlug);
  else if (command === "list") listVideos();
  else if (command === "check") await runHyperFrames("check", value);
  else if (command === "preview") await runHyperFrames("preview", value);
  else if (command === "render") await runHyperFrames("render", value);
  else if (command === "help" || command === "--help" || command === "-h") showHelp();
  else fail(`Comando desconhecido: ${command}`);
} catch (error) {
  fail(error.message || String(error));
}

async function createVideo(sourceUrl, requestedSlug) {
  if (!sourceUrl) fail("Informe uma URL. Exemplo: npm run video:create -- https://exemplo.com/artigo");
  let parsed;
  try {
    parsed = new URL(sourceUrl);
  } catch {
    fail("A origem precisa ser uma URL completa iniciada por http:// ou https://.");
  }
  if (!/^https?:$/.test(parsed.protocol)) fail("Somente URLs http:// e https:// são aceitas.");

  const slug = requestedSlug || slugFromUrl(parsed);
  if (!safeSlug(slug)) fail("O slug deve usar apenas letras minúsculas, números e hífens, com até 80 caracteres.");
  const projectDir = path.join(settings.videosDir, slug);
  if (existsSync(projectDir)) fail(`O projeto videos/${slug} já existe. Escolha outro slug.`);

  if (settings.provider === "openai" && !process.env.OPENAI_API_KEY) {
    fail("AI_PROVIDER=openai exige OPENAI_API_KEY no .env.");
  }

  const prompt = `Crie um vídeo HyperFrames completo a partir desta URL: ${parsed.href}\n\n` +
    `Trabalhe dentro de ${projectDir}. Siga integralmente o AGENTS.md e os defaults do projeto. ` +
    `Use saída ${settings.language}, voz ${settings.voiceProvider}/${settings.voiceId} em todas as cenas, ` +
    `duração alvo ${settings.targetDuration}s entre ${settings.minimumDuration}s e ${settings.maximumDuration}s, ` +
    `formato ${settings.aspectRatio} ${settings.width}x${settings.height} ${settings.fps}fps e qualidade mínima ${settings.minimumQuality}. ` +
    `Pesquise e leia a URL, crie BRIEF.md, roteiro, mídia local, narração, composição e snapshots. ` +
    `Registre include_cta: true no meta.json. Garanta que todas as manchetes caibam na área segura. Rode hyperframes check ao final. ` +
    `Não renderize o MP4 ainda. Não faça perguntas; os defaults já foram aprovados.`;

  const childEnv = { ...process.env };
  if (settings.provider === "openai") childEnv.CODEX_API_KEY = process.env.OPENAI_API_KEY;
  else {
    delete childEnv.CODEX_API_KEY;
    delete childEnv.OPENAI_API_KEY;
  }

  console.log(`Criando videos/${slug} com ${settings.provider === "codex" ? "OAuth Codex" : "OpenAI API"}...`);
  await run("codex", [
    "exec", "--ephemeral", "--approve-for-me",
    "--skip-git-repo-check", "-C", ROOT, prompt
  ], ROOT, childEnv);

  if (!existsSync(path.join(projectDir, "index.html"))) {
    fail("O Codex terminou, mas a composição index.html não foi criada.");
  }
  console.log(`\nProjeto pronto para revisão: videos/${slug}`);
  console.log(`Abra o editor: npm run video:preview -- ${slug}`);
}

function listVideos() {
  if (!existsSync(settings.videosDir)) return console.log("Nenhum vídeo criado.");
  const projects = readdirSync(settings.videosDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(path.join(settings.videosDir, entry.name, "index.html")))
    .map((entry) => entry.name)
    .sort();
  if (!projects.length) return console.log("Nenhum vídeo criado.");
  for (const project of projects) {
    const output = path.join(settings.videosDir, project, settings.rendersDirName, `${project}.mp4`);
    console.log(`${existsSync(output) ? "✓" : "·"} ${project}${existsSync(output) ? `  ${path.relative(ROOT, output)}` : ""}`);
  }
}

async function runHyperFrames(action, slug) {
  if (!safeSlug(slug)) fail(`Informe um projeto válido. Exemplo: npm run video:${action} -- meu-video`);
  const projectDir = path.join(settings.videosDir, slug);
  if (!existsSync(path.join(projectDir, "index.html"))) fail(`Não encontrei videos/${slug}/index.html.`);

  if (action === "check") {
    await run("npx", ["--yes", "hyperframes@0.8.20", "check"], projectDir);
    return;
  }
  if (action === "preview") {
    await run("npx", ["--yes", "hyperframes@0.8.20", "preview", "--foreground", "--port", String(settings.previewPort)], projectDir);
    return;
  }
  const output = path.join(settings.rendersDirName, `${slug}.mp4`);
  const metadata = readMetadata(projectDir);
  const includeCta = metadata.include_cta !== false;
  const finalPath = path.join(projectDir, output);
  const sourcePath = includeCta
    ? path.join(ROOT, ".runtime", "render-staging", `${slug}-${Date.now()}-sem-cta.mp4`)
    : finalPath;
  if (includeCta) await mkdir(path.dirname(sourcePath), { recursive: true });
  try {
    await run("npx", ["--yes", "hyperframes@0.8.20", "check"], projectDir);
    await run("npx", ["--yes", "hyperframes@0.8.20", "render", "--quality", settings.renderQuality, "--output", sourcePath], projectDir);
    if (includeCta) {
      console.log("\nAdicionando CTA INEMA.CLUB...");
      await appendCta(sourcePath, finalPath, metadata.aspect_ratio || settings.aspectRatio);
    }
  } finally {
    if (includeCta) await unlink(sourcePath).catch(() => {});
  }
  console.log(`\nMP4 pronto: ${path.relative(ROOT, finalPath)}`);
}

function readMetadata(projectDir) {
  const filename = path.join(projectDir, "meta.json");
  if (!existsSync(filename)) return {};
  try { return JSON.parse(readFileSync(filename, "utf8")); } catch { return {}; }
}

function probeMedia(filename) {
  const result = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=codec_type", "-of", "json", filename], { encoding: "utf8", timeout: 15000 });
  if (result.status !== 0) throw new Error(`Não foi possível inspecionar ${path.basename(filename)}.`);
  const payload = JSON.parse(result.stdout || "{}");
  return {
    duration: Number(payload.format?.duration || 0),
    hasAudio: payload.streams?.some((stream) => stream.codec_type === "audio") || false
  };
}

async function appendCta(sourcePath, finalPath, aspectRatio) {
  const horizontal = aspectRatio === "16:9";
  const width = horizontal ? 1920 : 1080;
  const height = horizontal ? 1080 : 1920;
  const ctaName = horizontal ? "inema-club-cta-16x9.mp4" : "inema-club-cta.mp4";
  const ctaPath = path.join(settings.videosDir, "inema-club-cta", "renders", ctaName);
  if (!existsSync(ctaPath)) throw new Error(`O CTA ${aspectRatio} ainda não está preparado.`);
  const source = probeMedia(sourcePath);
  const cta = probeMedia(ctaPath);
  const normalize = `fps=${settings.fps},scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1,setpts=PTS-STARTPTS`;
  const filters = [`[0:v:0]${normalize}[mainv]`, `[1:v:0]${normalize}[ctav]`, "[mainv][ctav]concat=n=2:v=1:a=0[outv]"];
  const maps = ["-map", "[outv]"];
  if (source.hasAudio) {
    filters.push(
      `[0:a:0]aformat=sample_rates=48000:channel_layouts=stereo,apad,atrim=duration=${source.duration.toFixed(3)},asetpts=PTS-STARTPTS[maina]`,
      `anullsrc=r=48000:cl=stereo:d=${cta.duration.toFixed(3)}[ctaa]`,
      "[maina][ctaa]concat=n=2:v=0:a=1[outa]"
    );
    maps.push("-map", "[outa]", "-c:a", "aac", "-b:a", "192k");
  }
  const temporary = path.join(path.dirname(sourcePath), `${path.basename(finalPath)}-${Date.now()}-com-cta.mp4`);
  try {
    await run("ffmpeg", [
      "-y", "-i", sourcePath, "-i", ctaPath, "-filter_complex", filters.join(";"), ...maps,
      "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", temporary
    ], path.dirname(sourcePath));
    await rename(temporary, finalPath);
  } finally {
    await unlink(temporary).catch(() => {});
  }
}

function run(commandName, args, cwd, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(commandName, args, { cwd, env, stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`${commandName} terminou com código ${code}.`)));
  });
}

function loadEnv(filename) {
  if (!existsSync(filename)) return;
  for (const rawLine of readFileSync(filename, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let envValue = line.slice(separator + 1).trim();
    if ((envValue.startsWith('"') && envValue.endsWith('"')) || (envValue.startsWith("'") && envValue.endsWith("'"))) {
      envValue = envValue.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = envValue;
  }
}

function slugFromUrl(parsed) {
  const host = parsed.hostname.replace(/^www\./, "").split(".")[0];
  const lastPath = parsed.pathname.split("/").filter(Boolean).at(-1) || "video";
  return `${host}-${lastPath}`
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || `video-${Date.now()}`;
}

function safeSlug(slug) {
  return typeof slug === "string" && /^[a-z0-9][a-z0-9-]{0,79}$/.test(slug);
}

function numberSetting(name, fallback) {
  const number = Number(process.env[name]);
  return Number.isFinite(number) ? number : fallback;
}

function showHelp() {
  console.log(`Content2Video INEMA\n\n` +
    `  npm run video:create -- <url> [slug]  cria o projeto sem renderizar\n` +
    `  npm run video:list                     lista os projetos e MP4s\n` +
    `  npm run video:check -- <slug>           valida a composição\n` +
    `  npm run video:preview -- <slug>         abre o editor HyperFrames\n` +
    `  npm run video:render -- <slug>          valida, gera o MP4 e adiciona o CTA salvo no projeto\n`);
}

function fail(message) {
  console.error(`Erro: ${message}`);
  process.exit(1);
}
