import http from "node:http";
import net from "node:net";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const APP_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(APP_DIR);
const PUBLIC_DIR = path.join(APP_DIR, "public");

loadEnv(path.join(ROOT, ".env"));

const config = {
  provider: process.env.AI_PROVIDER || "codex",
  language: process.env.OUTPUT_LANGUAGE || "pt-BR",
  voiceProvider: process.env.VOICE_PROVIDER || "edge-tts",
  voiceId: process.env.VOICE_ID || "pt-BR-FranciscaNeural",
  targetDuration: numberFromEnv("TARGET_DURATION_SECONDS", 60),
  tolerance: numberFromEnv("DURATION_TOLERANCE_PERCENT", 30),
  minimumDuration: numberFromEnv("MINIMUM_DURATION_SECONDS", 42),
  maximumDuration: numberFromEnv("MAXIMUM_DURATION_SECONDS", 78),
  minimumQuality: numberFromEnv("MINIMUM_QUALITY_SCORE", 8),
  aspectRatio: process.env.VIDEO_ASPECT_RATIO || "9:16",
  width: numberFromEnv("VIDEO_WIDTH", 1080),
  height: numberFromEnv("VIDEO_HEIGHT", 1920),
  fps: numberFromEnv("VIDEO_FPS", 30),
  format: process.env.VIDEO_FORMAT || "mp4",
  renderQuality: process.env.RENDER_QUALITY || "high",
  appHost: process.env.APP_HOST || "127.0.0.1",
  appPort: numberFromEnv("APP_PORT", 3000),
  previewHost: process.env.PREVIEW_HOST || process.env.APP_HOST || "127.0.0.1",
  previewPort: numberFromEnv("PREVIEW_PORT", 3022),
  videosDir: path.resolve(ROOT, process.env.VIDEOS_DIRECTORY || "./videos"),
  rendersDirName: process.env.RENDERS_DIRECTORY_NAME || "renders"
};

const jobs = new Map();
const previews = new Map();
let nextPreviewPort = config.previewPort;

function loadEnv(filename) {
  if (!existsSync(filename)) return;
  const content = readFileSync(filename, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function numberFromEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function text(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": contentType, "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 1_000_000) throw new Error("Corpo da requisição muito grande.");
  }
  return body ? JSON.parse(body) : {};
}

function safeSlug(value) {
  return typeof value === "string" && /^[a-z0-9][a-z0-9-]{0,79}$/.test(value);
}

function slugFromUrl(value) {
  const parsed = new URL(value);
  const host = parsed.hostname.replace(/^www\./, "").split(".")[0];
  const lastPath = parsed.pathname.split("/").filter(Boolean).at(-1) || "video";
  return `${host}-${lastPath}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || `video-${Date.now()}`;
}

function publicConfig() {
  const auth = authenticationStatus();
  return {
    provider: config.provider,
    authLabel: config.provider === "codex" ? "OAuth Codex" : "OpenAI API",
    authReady: auth.ready,
    authMessage: auth.message,
    apiConfigured: Boolean(process.env.OPENAI_API_KEY),
    language: config.language,
    voiceProvider: config.voiceProvider,
    voiceId: config.voiceId,
    targetDuration: config.targetDuration,
    tolerance: config.tolerance,
    durationRange: [config.minimumDuration, config.maximumDuration],
    minimumQuality: config.minimumQuality,
    aspectRatio: config.aspectRatio,
    resolution: `${config.width}×${config.height}`,
    fps: config.fps,
    renderQuality: config.renderQuality
  };
}

function authenticationStatus() {
  if (config.provider === "openai") {
    return process.env.OPENAI_API_KEY
      ? { ready: true, message: "OpenAI API configurada" }
      : { ready: false, message: "Configure OPENAI_API_KEY no .env" };
  }
  const result = spawnSync("codex", ["login", "status"], { cwd: ROOT, encoding: "utf8", timeout: 5000 });
  const output = `${result.stdout || ""}\n${result.stderr || ""}`;
  return result.status === 0 && /logged in/i.test(output)
    ? { ready: true, message: "OAuth Codex conectado" }
    : { ready: false, message: "Execute codex login neste computador" };
}

async function listProjects() {
  await mkdir(config.videosDir, { recursive: true });
  const entries = await readdir(config.videosDir, { withFileTypes: true });
  const projects = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || !safeSlug(entry.name)) continue;
    const projectDir = path.join(config.videosDir, entry.name);
    if (!existsSync(path.join(projectDir, "index.html"))) continue;
    const renderDir = path.join(projectDir, config.rendersDirName);
    let renders = [];
    if (existsSync(renderDir)) {
      const files = await readdir(renderDir, { withFileTypes: true });
      for (const file of files) {
        if (!file.isFile() || !file.name.endsWith(".mp4")) continue;
        const info = await stat(path.join(renderDir, file.name));
        renders.push({
          name: file.name,
          size: info.size,
          modifiedAt: info.mtime.toISOString(),
          url: `/project-media/${encodeURIComponent(entry.name)}/${encodeURIComponent(config.rendersDirName)}/${encodeURIComponent(file.name)}`
        });
      }
      renders.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
    }
    const thumbnail = findThumbnail(projectDir, entry.name);
    const info = await stat(projectDir);
    projects.push({
      slug: entry.name,
      name: humanize(entry.name),
      modifiedAt: info.mtime.toISOString(),
      thumbnail,
      renders,
      preview: previews.get(entry.name)?.url || null
    });
  }
  return projects.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
}

function findThumbnail(projectDir, slug) {
  const candidates = [
    "snapshots/contact-sheet.jpg",
    "snapshots/contact-sheet-1.jpg",
    "snapshots/frame-00-at-3.852s.png"
  ];
  for (const relative of candidates) {
    if (existsSync(path.join(projectDir, relative))) {
      return `/project-media/${encodeURIComponent(slug)}/${relative.split("/").map(encodeURIComponent).join("/")}`;
    }
  }
  return null;
}

function humanize(slug) {
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function serializeJob(job) {
  return {
    id: job.id,
    type: job.type,
    project: job.project,
    sourceUrl: job.sourceUrl,
    status: job.status,
    stage: job.stage,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    error: job.error || null,
    logs: job.logs.slice(-24)
  };
}

function makeJob(type, project, sourceUrl = null) {
  const job = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    project,
    sourceUrl,
    status: "queued",
    stage: "Na fila",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    logs: []
  };
  jobs.set(job.id, job);
  return job;
}

function updateJob(job, patch) {
  Object.assign(job, patch, { updatedAt: new Date().toISOString() });
}

function appendLog(job, line) {
  const clean = String(line).replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "").trim();
  if (!clean) return;
  job.logs.push(clean.slice(0, 800));
  if (job.logs.length > 100) job.logs.splice(0, job.logs.length - 100);
  job.updatedAt = new Date().toISOString();
}

function startGeneration(job) {
  const projectDir = path.join(config.videosDir, job.project);
  const prompt = `Crie um vídeo HyperFrames completo a partir desta URL: ${job.sourceUrl}\n\n` +
    `Trabalhe dentro de ${projectDir}. Siga integralmente o AGENTS.md e os defaults do projeto. ` +
    `Use saída ${config.language}, voz ${config.voiceProvider}/${config.voiceId} em todas as cenas, ` +
    `duração alvo ${config.targetDuration}s entre ${config.minimumDuration}s e ${config.maximumDuration}s, ` +
    `formato ${config.aspectRatio} ${config.width}x${config.height} ${config.fps}fps e qualidade mínima ${config.minimumQuality}. ` +
    `Pesquise e leia a URL, crie BRIEF.md, roteiro, mídia local, narração, composição e snapshots. ` +
    `Garanta que todas as manchetes caibam na área segura. Rode hyperframes check ao final. ` +
    `Não renderize o MP4 ainda: a aprovação ocorrerá na interface. Não faça perguntas; os defaults já foram aprovados.`;

  const args = [
    "exec", "--json", "--ephemeral", "--approve-for-me",
    "--skip-git-repo-check", "-C", ROOT, prompt
  ];
  const childEnv = { ...process.env };
  if (config.provider === "openai") {
    if (!process.env.OPENAI_API_KEY) {
      updateJob(job, { status: "failed", stage: "Configuração incompleta", error: "OPENAI_API_KEY não foi configurada no .env." });
      return;
    }
    childEnv.CODEX_API_KEY = process.env.OPENAI_API_KEY;
  } else {
    delete childEnv.CODEX_API_KEY;
    delete childEnv.OPENAI_API_KEY;
  }

  updateJob(job, { status: "running", stage: "Analisando a URL" });
  const child = spawn("codex", args, { cwd: ROOT, env: childEnv, stdio: ["ignore", "pipe", "pipe"] });
  job.pid = child.pid;

  let stdoutBuffer = "";
  child.stdout.on("data", (chunk) => {
    stdoutBuffer += chunk.toString();
    const lines = stdoutBuffer.split("\n");
    stdoutBuffer = lines.pop() || "";
    for (const line of lines) consumeCodexEvent(job, line);
  });
  child.stderr.on("data", (chunk) => {
    for (const line of chunk.toString().split("\n")) appendLog(job, line);
  });
  child.on("error", (error) => updateJob(job, { status: "failed", stage: "Falha ao iniciar", error: error.message }));
  child.on("close", (code) => {
    if (stdoutBuffer) consumeCodexEvent(job, stdoutBuffer);
    if (code === 0 && existsSync(path.join(projectDir, "index.html"))) {
      updateJob(job, { status: "completed", stage: "Pronto para revisar" });
    } else if (job.status !== "failed") {
      updateJob(job, { status: "failed", stage: "Geração interrompida", error: `O Codex terminou com código ${code}.` });
    }
  });
}

function consumeCodexEvent(job, line) {
  try {
    const event = JSON.parse(line);
    if (event.type === "turn.started") updateJob(job, { stage: "Criando roteiro e cenas" });
    if (event.type === "item.started" && event.item?.type === "command_execution") {
      updateJob(job, { stage: "Produzindo o vídeo" });
      appendLog(job, event.item.command || "Executando etapa");
    }
    if (event.type === "item.completed" && event.item?.type === "agent_message") appendLog(job, event.item.text || "Etapa concluída");
    if (event.type === "turn.failed" || event.type === "error") appendLog(job, event.error?.message || event.message || "Erro na geração");
  } catch {
    appendLog(job, line);
  }
}

function startRender(project) {
  const job = makeJob("render", project);
  runRender(job, project);
  return job;
}

async function runRender(job, project) {
  const projectDir = path.join(config.videosDir, project);
  const output = path.join(config.rendersDirName, `${project}.mp4`);
  updateJob(job, { status: "running", stage: "Validando composição" });
  try {
    await runProcess(job, "npx", ["--yes", "hyperframes@0.8.19", "check"], projectDir);
    updateJob(job, { stage: "Renderizando MP4" });
    await runProcess(job, "npx", ["--yes", "hyperframes@0.8.19", "render", "--quality", config.renderQuality, "--output", output], projectDir);
    const finalPath = path.join(projectDir, output);
    if (!existsSync(finalPath) || (await stat(finalPath)).size === 0) throw new Error("O render terminou sem criar um MP4 válido.");
    updateJob(job, { status: "completed", stage: "MP4 pronto" });
  } catch (error) {
    updateJob(job, { status: "failed", stage: "Falha no render", error: error.message });
  }
}

function runProcess(job, command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    job.pid = child.pid;
    child.stdout.on("data", (chunk) => chunk.toString().split("\n").forEach((line) => appendLog(job, line)));
    child.stderr.on("data", (chunk) => chunk.toString().split("\n").forEach((line) => appendLog(job, line)));
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`${command} terminou com código ${code}.`)));
  });
}

async function startPreview(project) {
  const existing = previews.get(project);
  if (existing && !existing.child.killed) return existing;
  const projectDir = path.join(config.videosDir, project);
  const port = await reservePort();
  const child = spawn(
    "npx",
    ["--yes", "hyperframes@0.8.19", "preview", "--foreground", "--port", String(port), "--no-open"],
    { cwd: projectDir, env: { ...process.env, HYPERFRAMES_PREVIEW_HOST: config.previewHost }, stdio: ["ignore", "pipe", "pipe"] }
  );
  const preview = {
    child,
    port,
    url: `http://${config.previewHost}:${port}/#project/${encodeURIComponent(project)}`
  };
  previews.set(project, preview);
  child.on("close", () => previews.delete(project));
  await waitForPreview(port, child);
  return preview;
}

function waitForPreview(port, child) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const probe = () => {
      if (child.exitCode !== null) return reject(new Error("O editor não conseguiu iniciar."));
      const request = http.get({ hostname: config.previewHost, port, path: "/", timeout: 800 }, (response) => {
        response.resume();
        resolve();
      });
      request.on("timeout", () => request.destroy());
      request.on("error", () => {
        if (Date.now() - startedAt > 30_000) return reject(new Error("O editor demorou demais para iniciar."));
        setTimeout(probe, 400);
      });
    };
    probe();
  });
}

async function reservePort() {
  for (let attempts = 0; attempts < 40; attempts += 1) {
    const port = nextPreviewPort++;
    if (await portAvailable(port, config.previewHost)) return port;
  }
  throw new Error("Não encontrei uma porta livre para o editor.");
}

function portAvailable(port, host) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => server.close(() => resolve(true)));
    server.listen(port, host);
  });
}

function safeProjectPath(slug, relativeParts) {
  if (!safeSlug(slug)) return null;
  const root = path.join(config.videosDir, slug);
  const target = path.resolve(root, ...relativeParts);
  return target.startsWith(`${root}${path.sep}`) ? target : null;
}

function serveFile(res, filename) {
  if (!existsSync(filename)) return json(res, 404, { error: "Arquivo não encontrado." });
  const extension = path.extname(filename).toLowerCase();
  const mime = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".svg": "image/svg+xml"
  }[extension] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": mime, "Cache-Control": extension === ".mp4" ? "private, max-age=3600" : "no-cache" });
  createReadStream(filename).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = decodeURIComponent(url.pathname);

    if (req.method === "GET" && pathname === "/api/config") return json(res, 200, publicConfig());
    if (req.method === "GET" && pathname === "/api/projects") return json(res, 200, { projects: await listProjects() });
    if (req.method === "GET" && pathname === "/api/jobs") {
      return json(res, 200, { jobs: [...jobs.values()].map(serializeJob).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
    }

    if (req.method === "POST" && pathname === "/api/jobs") {
      const body = await readJson(req);
      let parsed;
      try { parsed = new URL(body.url); } catch { return json(res, 400, { error: "Informe uma URL válida." }); }
      if (!["http:", "https:"].includes(parsed.protocol)) return json(res, 400, { error: "A URL precisa começar com http:// ou https://." });
      let slug = slugFromUrl(body.url);
      if (existsSync(path.join(config.videosDir, slug))) slug = `${slug}-${Date.now().toString(36).slice(-5)}`;
      const job = makeJob("generation", slug, body.url);
      startGeneration(job);
      return json(res, 202, { job: serializeJob(job) });
    }

    const previewMatch = pathname.match(/^\/api\/projects\/([a-z0-9-]+)\/preview$/);
    if (req.method === "POST" && previewMatch) {
      const project = previewMatch[1];
      if (!existsSync(path.join(config.videosDir, project, "index.html"))) return json(res, 404, { error: "Projeto não encontrado." });
      const preview = await startPreview(project);
      return json(res, 200, { url: preview.url });
    }

    const renderMatch = pathname.match(/^\/api\/projects\/([a-z0-9-]+)\/render$/);
    if (req.method === "POST" && renderMatch) {
      const project = renderMatch[1];
      if (!existsSync(path.join(config.videosDir, project, "index.html"))) return json(res, 404, { error: "Projeto não encontrado." });
      const job = startRender(project);
      return json(res, 202, { job: serializeJob(job) });
    }

    const mediaMatch = pathname.match(/^\/project-media\/([a-z0-9-]+)\/(.+)$/);
    if (req.method === "GET" && mediaMatch) {
      const filename = safeProjectPath(mediaMatch[1], mediaMatch[2].split("/").filter(Boolean));
      return filename ? serveFile(res, filename) : json(res, 400, { error: "Caminho inválido." });
    }

    if (req.method === "GET") {
      const requested = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
      const filename = path.resolve(PUBLIC_DIR, requested);
      if (filename.startsWith(`${PUBLIC_DIR}${path.sep}`) || filename === path.join(PUBLIC_DIR, "index.html")) return serveFile(res, filename);
    }
    return json(res, 404, { error: "Rota não encontrada." });
  } catch (error) {
    return json(res, 500, { error: error.message || "Erro interno." });
  }
});

server.listen(config.appPort, config.appHost, () => {
  console.log(`Content2Video INEMA disponível em http://${config.appHost}:${config.appPort}`);
});

function shutdown() {
  for (const preview of previews.values()) preview.child.kill("SIGTERM");
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
