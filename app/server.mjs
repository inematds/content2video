import http from "node:http";
import net from "node:net";
import { createReadStream, existsSync, mkdirSync, readFileSync } from "node:fs";
import { cp, mkdir, readdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const APP_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(APP_DIR);
const PUBLIC_DIR = path.join(APP_DIR, "public");
const PACKAGE = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
const BUILTIN_PRESETS_FILE = path.join(ROOT, "config", "visual-presets.json");
const RUNTIME_PRESETS_FILE = path.join(ROOT, ".runtime", "visual-presets.json");

loadEnv(path.join(ROOT, ".env"));

const CONVERSATION_STYLES = {
  preserve: {
    label: "Manter estilo atual",
    description: "Preserva o jeito de falar de um projeto anterior.",
    prompt: "Preserve o jeito de falar que o projeto já usa. Não simplifique nem torne o texto mais técnico sem uma instrução explícita do usuário.",
    selectable: false
  },
  popular: {
    label: "Popular e simples",
    description: "Frases curtas, palavras comuns e toda ideia difícil explicada com exemplo.",
    prompt: "Fale para o público em geral com frases curtas, palavras comuns e uma ideia por vez. Explique todo termo técnico na primeira vez que aparecer e use exemplos concretos do cotidiano. Evite linguagem acadêmica, rebuscada, abstrata ou excessivamente formal."
  },
  natural: {
    label: "Conversa natural",
    description: "Tom próximo e acessível, com detalhes na medida certa.",
    prompt: "Use um tom próximo e conversado, acessível para quem não é especialista. Pode usar termos técnicos apenas quando ajudarem, sempre com uma explicação curta. Mantenha ritmo natural e detalhes na medida certa."
  },
  technical: {
    label: "Técnico e detalhado",
    description: "Mais precisão, conceitos e vocabulário para quem já conhece o assunto.",
    prompt: "Use linguagem técnica, precisa e detalhada para um público que já conhece o assunto. Preserve conceitos, ressalvas e vocabulário especializado, sem rebuscamento desnecessário."
  }
};

const SPEECH_PACES = {
  preserve: {
    label: "Manter ritmo atual",
    description: "Preserva a velocidade de um projeto anterior.",
    voiceRate: "inalterada",
    prompt: "Preserve exatamente a velocidade e as pausas da narração existente.",
    selectable: false
  },
  calm: {
    label: "Calma",
    description: "Mais pausas e tempo para assimilar.",
    voiceRate: "-10%",
    prompt: "Use uma narração calma e pausada, com respiros claros entre ideias e velocidade de voz em -10%."
  },
  natural: {
    label: "Natural",
    description: "Cadência equilibrada para a maioria dos vídeos.",
    voiceRate: "+0%",
    prompt: "Use uma cadência natural e equilibrada, com velocidade de voz em +0% e pausas apenas onde ajudarem a compreensão."
  },
  fast: {
    label: "Rápida",
    description: "Mais energia e informação por minuto.",
    voiceRate: "+12%",
    prompt: "Use uma narração rápida e dinâmica, mas ainda claramente compreensível, com velocidade de voz em +12% e pausas curtas."
  }
};

const config = {
  provider: process.env.AI_PROVIDER || "codex",
  language: process.env.OUTPUT_LANGUAGE || "pt-BR",
  voiceProvider: process.env.VOICE_PROVIDER || "edge-tts",
  voiceId: process.env.VOICE_ID || "pt-BR-FranciscaNeural",
  conversationStyle: selectableConversationStyle(process.env.CONVERSATION_STYLE) ? process.env.CONVERSATION_STYLE : "popular",
  speechPace: selectableSpeechPace(process.env.SPEECH_PACE) ? process.env.SPEECH_PACE : "natural",
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
  videosDir: path.join(ROOT, "output", "content2video"),
  rendersDirName: process.env.RENDERS_DIRECTORY_NAME || "renders"
};

mkdirSync(config.videosDir, { recursive: true });

const jobs = new Map();
const previews = new Map();
let nextPreviewPort = config.previewPort;

const JOB_PHASES = {
  generation: ["Preparando", "Criando direção visual", "Aguardando aprovação visual", "Produzindo mídia e voz", "Validando composição", "Pronto para revisar"],
  duplicate: ["Copiando o projeto", "Aplicando as instruções", "Atualizando mídia e voz", "Validando a nova versão", "Cópia pronta"],
  edit: ["Preparando a edição", "Aplicando as instruções", "Atualizando mídia e voz", "Validando as mudanças", "Edição pronta"],
  render: ["Preparando", "Validando composição", "Renderizando vídeo", "Adicionando CTA", "MP4 pronto"]
};

const PRESET_FIELDS = ["name", "description", "palette", "typography", "composition", "motion", "imagery", "avoid", "instructions"];

function readPresetDocument(filename, fallback = { presets: [] }) {
  if (!existsSync(filename)) return fallback;
  try { return JSON.parse(readFileSync(filename, "utf8")); } catch { return fallback; }
}

function visualPresets() {
  const builtin = readPresetDocument(BUILTIN_PRESETS_FILE);
  const runtime = readPresetDocument(RUNTIME_PRESETS_FILE);
  const overrides = new Map((runtime.presets || []).map((preset) => [preset.id, preset]));
  return {
    version: builtin.version || 1,
    defaultPresetId: builtin.defaultPresetId,
    presets: (builtin.presets || []).map((preset) => ({ ...preset, ...(overrides.get(preset.id) || {}) }))
  };
}

function visualPreset(id) {
  const document = visualPresets();
  return document.presets.find((preset) => preset.id === id) || null;
}

function validatePreset(body, id) {
  if (!safeSlug(id)) throw new Error("Identificador de preset inválido.");
  const preset = { id };
  for (const field of PRESET_FIELDS) {
    const value = String(body[field] || "").trim();
    if (!value) throw new Error(`Preencha o campo ${field}.`);
    if (value.length > (field === "instructions" ? 4000 : 1200)) throw new Error(`O campo ${field} está muito longo.`);
    preset[field] = value;
  }
  return preset;
}

async function savePreset(preset) {
  const runtime = readPresetDocument(RUNTIME_PRESETS_FILE, { version: 1, presets: [] });
  const presets = (runtime.presets || []).filter((item) => item.id !== preset.id);
  presets.push(preset);
  await mkdir(path.dirname(RUNTIME_PRESETS_FILE), { recursive: true });
  await writeFile(RUNTIME_PRESETS_FILE, `${JSON.stringify({ version: 1, presets }, null, 2)}\n`);
}

function visualPresetPrompt(preset) {
  return `Preset visual obrigatório: "${preset.name}" (${preset.id}).\n` +
    `Descrição: ${preset.description}\nPaleta: ${preset.palette}\nTipografia: ${preset.typography}\n` +
    `Composição: ${preset.composition}\nMovimento: ${preset.motion}\nImagens: ${preset.imagery}\n` +
    `Evite: ${preset.avoid}\nInstruções adicionais: ${preset.instructions}\n` +
    `Aplique este contrato em todos os arquivos visuais e registre visual_preset_id e visual_preset_name no BRIEF.md e no meta.json.`;
}

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
  const presets = visualPresets();
  return {
    version: formatDisplayVersion(PACKAGE.version),
    provider: config.provider,
    authLabel: config.provider === "codex" ? "OAuth Codex" : "OpenAI API",
    authReady: auth.ready,
    authMessage: auth.message,
    apiConfigured: Boolean(process.env.OPENAI_API_KEY),
    language: config.language,
    voiceProvider: config.voiceProvider,
    voiceId: config.voiceId,
    conversationStyle: config.conversationStyle,
    conversationStyles: Object.entries(CONVERSATION_STYLES).filter(([, style]) => style.selectable !== false).map(([value, style]) => ({ value, label: style.label, description: style.description })),
    speechPace: config.speechPace,
    speechPaces: Object.entries(SPEECH_PACES).filter(([, pace]) => pace.selectable !== false).map(([value, pace]) => ({ value, label: pace.label, description: pace.description, voiceRate: pace.voiceRate })),
    targetDuration: config.targetDuration,
    tolerance: config.tolerance,
    durationRange: [config.minimumDuration, config.maximumDuration],
    minimumQuality: config.minimumQuality,
    aspectRatio: config.aspectRatio,
    resolution: `${config.width}×${config.height}`,
    fps: config.fps,
    renderQuality: config.renderQuality,
    defaultVisualPresetId: presets.defaultPresetId,
    visualPresets: presets.presets.map(({ id, name, description }) => ({ id, name, description }))
  };
}

function formatDisplayVersion(version) {
  const [major = "1", feature = "0", bugfix = "0"] = String(version).split(".");
  return `v${major}.${feature.padStart(2, "0")}.${bugfix.padStart(2, "0")}`;
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
        if (!file.isFile() || file.name.startsWith(".") || !file.name.endsWith(".mp4")) continue;
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
    const metadata = readProjectMetadata(projectDir);
    const conversationStyle = validConversationStyle(metadata.conversation_style) ? metadata.conversation_style : "preserve";
    const speechPace = validSpeechPace(metadata.speech_pace) ? metadata.speech_pace : "preserve";
    projects.push({
      slug: entry.name,
      name: humanize(entry.name),
      modifiedAt: info.mtime.toISOString(),
      aspectRatio: metadata.aspect_ratio || metadata.aspectRatio || config.aspectRatio,
      includeCta: metadata.include_cta !== false,
      conversationStyle,
      conversationStyleLabel: CONVERSATION_STYLES[conversationStyle].label,
      speechPace,
      speechPaceLabel: SPEECH_PACES[speechPace].label,
      visualPresetId: metadata.visual_preset_id || visualPresets().defaultPresetId,
      visualPresetName: metadata.visual_preset_name || visualPreset(metadata.visual_preset_id || visualPresets().defaultPresetId)?.name || "Preset visual",
      thumbnail,
      renders,
      preview: previews.get(entry.name)?.url || null
    });
  }
  return projects.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
}

function readProjectMetadata(projectDir) {
  const filename = path.join(projectDir, "meta.json");
  if (!existsSync(filename)) return {};
  try {
    return JSON.parse(readFileSync(filename, "utf8"));
  } catch {
    return {};
  }
}

async function updateProjectMetadata(projectDir, patch) {
  const metadata = readProjectMetadata(projectDir);
  await writeFile(path.join(projectDir, "meta.json"), `${JSON.stringify({ ...metadata, ...patch }, null, 2)}\n`);
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

function hasAssembledComposition(projectDir) {
  const filename = path.join(projectDir, "index.html");
  if (!existsSync(filename)) return false;
  const html = readFileSync(filename, "utf8").replace(/<!--[\s\S]*?-->/g, "");
  return /data-composition-src\s*=|class=["'][^"']*\bclip\b[^"']*["']/i.test(html);
}

function visualGatePreview(projectDir, slug) {
  for (const relative of ["snapshots/visual-gate.png", "snapshots/visual-gate.jpg", "snapshots/visual-gate.jpeg"]) {
    if (existsSync(path.join(projectDir, relative))) {
      return `/project-media/${encodeURIComponent(slug)}/${relative.split("/").map(encodeURIComponent).join("/")}`;
    }
  }
  return null;
}

function hasVisualGate(projectDir) {
  return existsSync(path.join(projectDir, "BRIEF.md")) &&
    existsSync(path.join(projectDir, "frame.md")) &&
    existsSync(path.join(projectDir, "STORYBOARD.md")) &&
    Boolean(visualGatePreview(projectDir, path.basename(projectDir)));
}

function humanize(slug) {
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function serializeJob(job) {
  const now = Date.now();
  const terminal = ["completed", "failed", "cancelled"].includes(job.status);
  const retryable = job.type === "render" && ["failed", "cancelled"].includes(job.status);
  const jobEnd = terminal ? new Date(job.finishedAt || job.updatedAt).getTime() : now;
  return {
    id: job.id,
    type: job.type,
    project: job.project,
    sourceUrl: job.sourceUrl,
    sourceProject: job.sourceProject || null,
    instructions: job.instructions || null,
    aspectRatio: job.aspectRatio,
    includeCta: job.includeCta,
    conversationStyle: job.conversationStyle,
    conversationStyleLabel: CONVERSATION_STYLES[job.conversationStyle]?.label || CONVERSATION_STYLES[config.conversationStyle].label,
    speechPace: job.speechPace,
    speechPaceLabel: SPEECH_PACES[job.speechPace]?.label || SPEECH_PACES[config.speechPace].label,
    visualPresetId: job.visualPresetId || null,
    visualPresetName: job.visualPreset?.name || null,
    visualGate: job.type === "generation" ? { previewUrl: visualGatePreview(path.join(config.videosDir, job.project), job.project) } : null,
    checkpointId: job.checkpointId || null,
    retryable,
    resumeAvailable: retryable && renderCheckpointAvailable(job),
    skippedPhases: job.skippedPhases || [],
    status: job.status,
    stage: job.stage,
    phaseIndex: job.phaseIndex,
    phases: job.phases,
    cancelable: ["queued", "running", "cancelling", "awaiting_approval"].includes(job.status),
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    error: job.error || null,
    totalDurationMs: Math.max(0, jobEnd - new Date(job.createdAt).getTime()),
    phaseTimings: job.phases.map((phase, phaseIndex) => {
      const timing = job.phaseHistory.find((item) => item.phaseIndex === phaseIndex);
      if (!timing) return { phase, phaseIndex, startedAt: null, endedAt: null, durationMs: null };
      const end = timing.endedAt ? new Date(timing.endedAt).getTime() : now;
      return {
        phase,
        phaseIndex,
        startedAt: timing.startedAt,
        endedAt: timing.endedAt,
        durationMs: Math.max(0, end - new Date(timing.startedAt).getTime())
      };
    }),
    logs: job.logs.slice(-24)
  };
}

function makeJob(type, project, options = {}) {
  const phases = type === "render" && options.includeCta === false
    ? ["Preparando", "Validando composição", "Renderizando vídeo", "MP4 pronto"]
    : JOB_PHASES[type] || ["Preparando", "Concluído"];
  const createdAt = new Date().toISOString();
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const job = {
    id,
    type,
    project,
    sourceUrl: options.sourceUrl || null,
    sourceProject: options.sourceProject || null,
    instructions: options.instructions || null,
    aspectRatio: options.aspectRatio || config.aspectRatio,
    includeCta: options.includeCta !== false,
    conversationStyle: validConversationStyle(options.conversationStyle) ? options.conversationStyle : config.conversationStyle,
    speechPace: validSpeechPace(options.speechPace) ? options.speechPace : config.speechPace,
    visualPresetId: options.visualPresetId || visualPresets().defaultPresetId,
    visualPreset: options.visualPreset || visualPreset(options.visualPresetId || visualPresets().defaultPresetId),
    gateStep: options.gateStep || (type === "generation" ? "direction" : null),
    checkpointId: options.checkpointId || id,
    retryMode: options.retryMode || "restart",
    skippedPhases: [],
    status: "queued",
    stage: phases[0],
    phaseIndex: 0,
    phases,
    createdAt,
    updatedAt: createdAt,
    finishedAt: null,
    phaseHistory: [{ phaseIndex: 0, stage: phases[0], startedAt: createdAt, endedAt: null }],
    logs: [],
    children: new Set()
  };
  jobs.set(job.id, job);
  return job;
}

function setPhase(job, phaseIndex, stage = null) {
  const nextPhase = Math.max(job.phaseIndex, Math.min(phaseIndex, job.phases.length - 1));
  const nextStage = stage || job.phases[nextPhase];
  if (nextPhase > job.phaseIndex) {
    const changedAt = new Date().toISOString();
    const current = job.phaseHistory.find((item) => item.phaseIndex === job.phaseIndex && !item.endedAt);
    if (current) current.endedAt = changedAt;
    job.phaseIndex = nextPhase;
    job.phaseHistory.push({ phaseIndex: nextPhase, stage: nextStage, startedAt: changedAt, endedAt: null });
  }
  updateJob(job, { stage: nextStage });
}

function dimensionsFor(aspectRatio) {
  return aspectRatio === "16:9"
    ? { width: 1920, height: 1080 }
    : { width: 1080, height: 1920 };
}

function validAspectRatio(value) {
  return value === "9:16" || value === "16:9";
}

function validConversationStyle(value) {
  return typeof value === "string" && Object.hasOwn(CONVERSATION_STYLES, value);
}

function selectableConversationStyle(value) {
  return validConversationStyle(value) && CONVERSATION_STYLES[value].selectable !== false;
}

function validSpeechPace(value) {
  return typeof value === "string" && Object.hasOwn(SPEECH_PACES, value);
}

function selectableSpeechPace(value) {
  return validSpeechPace(value) && SPEECH_PACES[value].selectable !== false;
}

function activeJobForProject(project) {
  return [...jobs.values()].find((job) => job.project === project && ["queued", "running", "cancelling", "awaiting_approval"].includes(job.status));
}

function uniqueProjectSlug(base) {
  let slug = base.slice(0, 72).replace(/-+$/g, "");
  let suffix = 2;
  while (existsSync(path.join(config.videosDir, slug))) {
    const tag = `-${suffix++}`;
    slug = `${base.slice(0, 80 - tag.length).replace(/-+$/g, "")}${tag}`;
  }
  return slug;
}

function updateJob(job, patch) {
  const updatedAt = new Date().toISOString();
  if (["completed", "failed", "cancelled"].includes(patch.status) && !job.finishedAt) {
    job.finishedAt = updatedAt;
    const current = job.phaseHistory.find((item) => item.phaseIndex === job.phaseIndex && !item.endedAt);
    if (current) current.endedAt = updatedAt;
  }
  Object.assign(job, patch, { updatedAt });
}

function appendLog(job, line) {
  const clean = String(line).replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "").trim();
  if (!clean) return;
  job.logs.push(clean.slice(0, 800));
  if (job.logs.length > 100) job.logs.splice(0, job.logs.length - 100);
  job.updatedAt = new Date().toISOString();
}

function generationContext(job) {
  const projectDir = path.join(config.videosDir, job.project);
  const dimensions = dimensionsFor(job.aspectRatio);
  const conversation = CONVERSATION_STYLES[job.conversationStyle];
  const pace = SPEECH_PACES[job.speechPace];
  const objective = job.instructions
    ? `Objetivo específico informado pelo usuário: ${job.instructions}\nTrate esse objetivo como a direção editorial principal, sem inventar fatos além da fonte. `
    : "O usuário não informou um objetivo adicional; identifique o recorte mais útil e fiel à fonte. ";
  return { projectDir, dimensions, conversation, pace, objective };
}

function startGeneration(job) {
  const { projectDir, dimensions, conversation, pace, objective } = generationContext(job);
  job.gateStep = "direction";
  const prompt = `Crie somente a direção visual e uma cena-piloto para um futuro vídeo HyperFrames a partir desta URL: ${job.sourceUrl}\n\n` +
    `Trabalhe dentro de ${projectDir}. Siga integralmente o AGENTS.md e os defaults do projeto. ` +
    objective +
    `${visualPresetPrompt(job.visualPreset)}\n` +
    `Use saída ${config.language}, voz ${config.voiceProvider}/${config.voiceId} em todas as cenas, ` +
    `estilo de conversa "${conversation.label}" e ritmo de fala "${pace.label}". ${conversation.prompt} ${pace.prompt} ` +
    `duração alvo ${config.targetDuration}s entre ${config.minimumDuration}s e ${config.maximumDuration}s, ` +
    `formato ${job.aspectRatio} ${dimensions.width}x${dimensions.height} ${config.fps}fps e qualidade mínima ${config.minimumQuality}. ` +
    `Pesquise e leia a URL. Crie BRIEF.md, frame.md, STORYBOARD.md, meta.json e um visual-gate.html autocontido que represente a cena mais importante. ` +
    `Antes de gerar o áudio, registre o objetivo editorial, language, voice_provider, voice_id, conversation_style: ${job.conversationStyle}, speech_pace: ${job.speechPace}, voice_rate: ${pace.voiceRate}, aspect_ratio, width, height e include_cta: ${job.includeCta} no BRIEF.md e no meta.json. ` +
    `Capture exatamente snapshots/visual-gate.png em ${dimensions.width}x${dimensions.height}. Garanta que a manchete caiba na área segura no início, pico e fim da animação. ` +
    `Este é um gate: NÃO gere áudio, vídeo, MP4, index.html final nem outras cenas. Não faça perguntas; a aprovação ocorrerá na interface.`;

  runCodexJob(job, prompt, projectDir);
}

function continueGeneration(job) {
  const { projectDir, dimensions, conversation, pace, objective } = generationContext(job);
  job.gateStep = "production";
  setPhase(job, 3, "Produzindo mídia e voz");
  const prompt = `A direção visual e a cena-piloto deste vídeo foram aprovadas. Agora produza o vídeo HyperFrames completo a partir de ${job.sourceUrl}.\n\n` +
    `Projeto: ${projectDir}. ${objective}${visualPresetPrompt(job.visualPreset)}\n` +
    `Trate BRIEF.md, frame.md, STORYBOARD.md e visual-gate.html como direção aprovada. Preserve a ideia central da cena-piloto e aplique o preset atual a todas as cenas. ` +
    `Use ${config.language}, ${config.voiceProvider}/${config.voiceId}, conversa "${conversation.label}" e fala "${pace.label}" (${pace.voiceRate}). ${conversation.prompt} ${pace.prompt} ` +
    `Produza roteiro, mídia local, narração, legendas e index.html em ${job.aspectRatio}, ${dimensions.width}x${dimensions.height}, ${config.fps}fps, duração entre ${config.minimumDuration}s e ${config.maximumDuration}s. ` +
    `Atualize BRIEF.md e meta.json antes do áudio com language, voice_provider, voice_id, conversation_style, speech_pace, voice_rate, aspect_ratio, width, height, include_cta, visual_preset_id e visual_preset_name. ` +
    `Valide todas as manchetes na área segura no início, pico e fim; gere snapshots e rode hyperframes check até passar. Não renderize MP4 e não faça perguntas.`;
  runCodexJob(job, prompt, projectDir);
}

async function startProjectTransformation(job, duplicate) {
  const sourceDir = path.join(config.videosDir, job.sourceProject || job.project);
  const projectDir = path.join(config.videosDir, job.project);
  const dimensions = dimensionsFor(job.aspectRatio);
  const conversation = CONVERSATION_STYLES[job.conversationStyle];
  const pace = SPEECH_PACES[job.speechPace];
  try {
    updateJob(job, { status: "running" });
    if (duplicate) {
      setPhase(job, 0);
      await cp(sourceDir, projectDir, {
        recursive: true,
        filter: (source) => !source.includes(`${path.sep}${config.rendersDirName}${path.sep}`) && !source.endsWith(`${path.sep}${config.rendersDirName}`)
      });
      const previous = readProjectMetadata(projectDir);
      await writeFile(path.join(projectDir, "meta.json"), `${JSON.stringify({
        ...previous,
        id: job.project,
        name: job.project,
        copied_from: job.sourceProject,
        createdAt: new Date().toISOString(),
        aspect_ratio: job.aspectRatio,
        include_cta: job.includeCta,
        conversation_style: job.conversationStyle,
        speech_pace: job.speechPace,
        voice_rate: pace.voiceRate,
        width: dimensions.width,
        height: dimensions.height
      }, null, 2)}\n`);
    }

    if (job.status === "cancelled" || job.status === "cancelling") return;
    const verb = duplicate ? "Esta é uma cópia; preserve o projeto original sem qualquer alteração." : "Edite o projeto existente no próprio diretório.";
    const prompt = `${verb}\n\nProjeto: ${projectDir}\nInstrução do usuário: ${job.instructions}\n\n` +
      `Siga integralmente o AGENTS.md deste repositório. Mantenha tudo que a instrução não pedir para alterar. ` +
      `O resultado deve usar formato ${job.aspectRatio} em ${dimensions.width}x${dimensions.height}, ${config.fps}fps. ` +
      `Para narração em português brasileiro, mantenha ${config.voiceProvider}/${config.voiceId} em todas as cenas e regenerações. ` +
      `Mantenha o estilo de conversa "${conversation.label}" e o ritmo de fala "${pace.label}". ${conversation.prompt} ${pace.prompt} ` +
      `Atualize BRIEF.md e meta.json com language, voice_provider, voice_id, conversation_style: ${job.conversationStyle}, speech_pace: ${job.speechPace}, voice_rate: ${pace.voiceRate}, aspect_ratio, width, height e include_cta: ${job.includeCta} antes de regenerar áudio. ` +
      `Ajuste composição, roteiro, mídia, voz e legendas somente quando necessário para cumprir a instrução. ` +
      `Valide títulos na área segura, rode hyperframes check e gere snapshots ao final. Não renderize o MP4 e não faça perguntas.`;
    runCodexJob(job, prompt, projectDir);
  } catch (error) {
    if (job.status !== "cancelled") updateJob(job, { status: "failed", stage: "Falha ao preparar o projeto", error: error.message });
  }
}

function codexEnvironment(job) {
  const childEnv = { ...process.env };
  if (config.provider === "openai") {
    if (!process.env.OPENAI_API_KEY) {
      updateJob(job, { status: "failed", stage: "Configuração incompleta", error: "OPENAI_API_KEY não foi configurada no .env." });
      return null;
    }
    childEnv.CODEX_API_KEY = process.env.OPENAI_API_KEY;
  } else {
    delete childEnv.CODEX_API_KEY;
    delete childEnv.OPENAI_API_KEY;
  }
  return childEnv;
}

function runCodexJob(job, prompt, projectDir) {
  const childEnv = codexEnvironment(job);
  if (!childEnv || job.status === "cancelled" || job.status === "cancelling") return;

  const args = [
    "exec", "--json", "--ephemeral", "--dangerously-bypass-approvals-and-sandbox",
    "--skip-git-repo-check", "-C", ROOT, prompt
  ];
  updateJob(job, { status: "running" });
  if (job.type === "generation" && job.gateStep === "direction" && job.phaseIndex >= 2) setPhase(job, 2, "Atualizando direção visual");
  else setPhase(job, 1);
  const child = spawn("codex", args, { cwd: ROOT, env: childEnv, detached: true, stdio: ["ignore", "pipe", "pipe"] });
  trackChild(job, child);

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
  child.on("error", (error) => {
    if (job.status !== "cancelled") updateJob(job, { status: "failed", stage: "Falha ao iniciar", error: error.message });
  });
  child.on("close", async (code) => {
    job.children.delete(child);
    if (stdoutBuffer) consumeCodexEvent(job, stdoutBuffer);
    if (job.status === "cancelled" || job.status === "cancelling") {
      updateJob(job, { status: "cancelled", stage: "Cancelado pelo usuário" });
      return;
    }
    if (code === 0 && job.type === "generation" && job.gateStep === "direction" && hasVisualGate(projectDir)) {
      setPhase(job, 2, "Direção visual pronta para aprovação");
      updateJob(job, { status: "awaiting_approval", stage: "Direção visual pronta para aprovação" });
      return;
    }
    if (code === 0 && hasAssembledComposition(projectDir)) {
      try {
        const dimensions = dimensionsFor(job.aspectRatio);
        const metadataPatch = {
          language: config.language,
          voice_provider: config.voiceProvider,
          voice_id: config.voiceId,
          conversation_style: job.conversationStyle,
          speech_pace: job.speechPace,
          voice_rate: SPEECH_PACES[job.speechPace].voiceRate,
          aspect_ratio: job.aspectRatio,
          width: dimensions.width,
          height: dimensions.height,
          include_cta: job.includeCta
        };
        if (job.type === "generation") {
          metadataPatch.source_objective = job.instructions || null;
          metadataPatch.visual_preset_id = job.visualPresetId;
          metadataPatch.visual_preset_name = job.visualPreset?.name || null;
        }
        await updateProjectMetadata(projectDir, metadataPatch);
      } catch (error) {
        updateJob(job, { status: "failed", stage: "Falha ao salvar preferências", error: error.message });
        return;
      }
      setPhase(job, job.phases.length - 1);
      updateJob(job, { status: "completed" });
    } else if (code === 0) {
      updateJob(job, {
        status: "failed",
        stage: job.gateStep === "direction" ? "Cena-piloto incompleta" : "Composição incompleta",
        error: job.gateStep === "direction"
          ? "O processo terminou sem criar todos os arquivos do gate visual e sua imagem de revisão."
          : "O processo terminou sem montar as cenas no editor. Use Continuar de onde parou para concluir."
      });
    } else if (job.status !== "failed") {
      updateJob(job, { status: "failed", stage: "Processo interrompido", error: `O Codex terminou com código ${code}.` });
    }
  });
}

function consumeCodexEvent(job, line) {
  try {
    const event = JSON.parse(line);
    if (event.type === "turn.started") setPhase(job, job.type === "generation" && job.gateStep === "direction" ? 1 : Math.min(2, job.phases.length - 2));
    if (event.type === "item.started" && event.item?.type === "command_execution") {
      const command = event.item.command || "Executando etapa";
      if (job.type === "generation" && job.gateStep === "direction") setPhase(job, 1, /snapshot|screenshot|visual-gate/i.test(command) ? "Capturando cena-piloto" : "Criando direção visual");
      else if (/\bhyperframes(?:@\S+)?\s+(?:check|snapshot)\b/i.test(command)) setPhase(job, job.phases.length - 2);
      else if (/edge-tts|ffmpeg|audio|voice|caption|asset/i.test(command)) setPhase(job, Math.min(3, job.phases.length - 2));
      else setPhase(job, Math.min(2, job.phases.length - 2));
      appendLog(job, command);
    }
    if (event.type === "item.completed" && event.item?.type === "agent_message") appendLog(job, event.item.text || "Etapa concluída");
    if (event.type === "turn.failed" || event.type === "error") appendLog(job, event.error?.message || event.message || "Erro na geração");
  } catch {
    appendLog(job, line);
  }
}

function createRenderJob(project, options = {}) {
  const metadata = readProjectMetadata(path.join(config.videosDir, project));
  return makeJob("render", project, {
    aspectRatio: options.aspectRatio || metadata.aspect_ratio || metadata.aspectRatio || config.aspectRatio,
    includeCta: typeof options.includeCta === "boolean" ? options.includeCta : metadata.include_cta !== false,
    conversationStyle: validConversationStyle(metadata.conversation_style) ? metadata.conversation_style : "preserve",
    speechPace: validSpeechPace(metadata.speech_pace) ? metadata.speech_pace : "preserve",
    checkpointId: options.checkpointId,
    retryMode: options.retryMode || "restart"
  });
}

function startRender(project, options = {}) {
  const job = createRenderJob(project, options);
  runRender(job, project);
  return job;
}

function renderCheckpointPaths(job) {
  const directory = path.join(ROOT, ".runtime", "render-staging", job.checkpointId || job.id);
  return {
    directory,
    source: path.join(directory, "source.mp4"),
    assembled: path.join(directory, "with-cta.mp4")
  };
}

function validMediaFile(filename) {
  if (!existsSync(filename)) return false;
  try {
    const media = probeMedia(filename);
    return media.duration > 0;
  } catch {
    return false;
  }
}

function renderCheckpointAvailable(job) {
  if (!job?.checkpointId) return false;
  const checkpoint = renderCheckpointPaths(job);
  return validMediaFile(checkpoint.assembled) || validMediaFile(checkpoint.source);
}

async function clearRenderCheckpoint(job) {
  const checkpoint = renderCheckpointPaths(job);
  await Promise.all([
    unlink(checkpoint.source).catch(() => {}),
    unlink(checkpoint.assembled).catch(() => {})
  ]);
}

async function runRender(job, project) {
  const projectDir = path.join(config.videosDir, project);
  const output = path.join(config.rendersDirName, `${project}.mp4`);
  const finalPath = path.join(projectDir, output);
  const pendingPath = `${finalPath}.pending-${job.id}`;
  const backupPath = `${finalPath}.backup-${job.id}`;
  const checkpoint = renderCheckpointPaths(job);
  updateJob(job, { status: "running" });
  setPhase(job, 1);
  try {
    await mkdir(checkpoint.directory, { recursive: true });
    if (job.retryMode === "restart") await clearRenderCheckpoint(job);

    if (job.includeCta && validMediaFile(checkpoint.assembled)) {
      job.skippedPhases = [1, 2, 3];
      setPhase(job, job.phases.length - 1, "Salvando MP4 já concluído");
    } else if (validMediaFile(checkpoint.source)) {
      job.skippedPhases = [1, 2];
      setPhase(job, job.includeCta ? 3 : job.phases.length - 1, job.includeCta ? "Continuando: adicionando CTA" : "Salvando render concluído");
    } else {
      await runProcess(job, "npx", ["--yes", "hyperframes@0.8.20", "check"], projectDir);
      if (job.status === "cancelled" || job.status === "cancelling") return;
      setPhase(job, 2);
      await runProcess(job, "npx", ["--yes", "hyperframes@0.8.20", "render", "--quality", config.renderQuality, "--output", checkpoint.source], projectDir);
    }
    if (job.status === "cancelled" || job.status === "cancelling") return;
    if (!validMediaFile(checkpoint.source) && !validMediaFile(checkpoint.assembled)) throw new Error("O render terminou sem criar um MP4 válido.");
    if (job.includeCta) {
      if (!validMediaFile(checkpoint.assembled)) {
        setPhase(job, 3);
        await appendCta(job, checkpoint.source, checkpoint.assembled);
      }
      if (!validMediaFile(checkpoint.assembled)) throw new Error("O CTA terminou sem criar um MP4 válido.");
    }
    await mkdir(path.dirname(finalPath), { recursive: true });
    if (job.status === "cancelled" || job.status === "cancelling") return;
    const deliverable = job.includeCta ? checkpoint.assembled : checkpoint.source;
    await unlink(pendingPath).catch(() => {});
    await unlink(backupPath).catch(() => {});
    await rename(deliverable, pendingPath);
    if (job.status === "cancelled" || job.status === "cancelling") {
      await rename(pendingPath, deliverable).catch(() => {});
      return;
    }
    if (!existsSync(pendingPath) || (await stat(pendingPath)).size === 0) throw new Error("O render terminou sem criar um MP4 válido.");
    if (job.status === "cancelled" || job.status === "cancelling") {
      await rename(pendingPath, deliverable).catch(() => {});
      return;
    }
    if (existsSync(finalPath)) await rename(finalPath, backupPath);
    if (job.status === "cancelled" || job.status === "cancelling") {
      await rename(pendingPath, deliverable).catch(() => {});
      if (existsSync(backupPath)) await rename(backupPath, finalPath).catch(() => {});
      return;
    }
    await rename(pendingPath, finalPath);
    if (job.status === "cancelled" || job.status === "cancelling") {
      await rename(finalPath, deliverable).catch(() => {});
      if (existsSync(backupPath)) await rename(backupPath, finalPath).catch(() => {});
      return;
    }
    setPhase(job, job.phases.length - 1);
    updateJob(job, { status: "completed" });
    await unlink(backupPath).catch(() => {});
    await clearRenderCheckpoint(job);
  } catch (error) {
    if (existsSync(pendingPath)) {
      const deliverable = job.includeCta ? checkpoint.assembled : checkpoint.source;
      await rename(pendingPath, deliverable).catch(() => {});
    }
    if (existsSync(backupPath)) await rename(backupPath, finalPath).catch(() => {});
    if (job.status === "cancelled" || job.status === "cancelling") updateJob(job, { status: "cancelled", stage: "Cancelado pelo usuário" });
    else updateJob(job, { status: "failed", stage: "Falha no render", error: error.message });
  }
}

function probeMedia(filename) {
  const result = spawnSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration:stream=codec_type", "-of", "json", filename
  ], { encoding: "utf8", timeout: 15000 });
  if (result.status !== 0) throw new Error(`Não foi possível inspecionar o vídeo: ${path.basename(filename)}.`);
  const payload = JSON.parse(result.stdout || "{}");
  return {
    duration: Number(payload.format?.duration || 0),
    hasAudio: payload.streams?.some((stream) => stream.codec_type === "audio") || false
  };
}

async function appendCta(job, sourcePath, assembledPath) {
  const dimensions = dimensionsFor(job.aspectRatio);
  const ctaName = job.aspectRatio === "16:9" ? "inema-club-cta-16x9.mp4" : "inema-club-cta.mp4";
  const ctaPath = path.join(config.videosDir, "inema-club-cta", "renders", ctaName);
  if (!existsSync(ctaPath)) throw new Error(`O CTA ${job.aspectRatio} ainda não está preparado. Renderize o CTA INEMA.CLUB antes de tentar novamente.`);

  const source = probeMedia(sourcePath);
  const cta = probeMedia(ctaPath);
  const normalize = `fps=${config.fps},scale=${dimensions.width}:${dimensions.height}:force_original_aspect_ratio=decrease,pad=${dimensions.width}:${dimensions.height}:(ow-iw)/2:(oh-ih)/2,setsar=1,setpts=PTS-STARTPTS`;
  const filters = [`[0:v:0]${normalize}[mainv]`, `[1:v:0]${normalize}[ctav]`, "[mainv][ctav]concat=n=2:v=1:a=0[outv]"];
  const args = ["-y", "-i", sourcePath, "-i", ctaPath];
  const maps = ["-map", "[outv]"];
  if (source.hasAudio) {
    filters.push(
      `[0:a:0]aformat=sample_rates=48000:channel_layouts=stereo,apad,atrim=duration=${source.duration.toFixed(3)},asetpts=PTS-STARTPTS[maina]`,
      `anullsrc=r=48000:cl=stereo:d=${cta.duration.toFixed(3)}[ctaa]`,
      "[maina][ctaa]concat=n=2:v=0:a=1[outa]"
    );
    maps.push("-map", "[outa]", "-c:a", "aac", "-b:a", "192k");
  }
  const temporary = `${assembledPath}.partial.mp4`;
  args.push(
    "-filter_complex", filters.join(";"), ...maps,
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    temporary
  );
  try {
    await runProcess(job, "ffmpeg", args, path.dirname(sourcePath));
    await rename(temporary, assembledPath);
  } finally {
    await unlink(temporary).catch(() => {});
  }
}

function runProcess(job, command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: process.env, detached: true, stdio: ["ignore", "pipe", "pipe"] });
    trackChild(job, child);
    child.stdout.on("data", (chunk) => chunk.toString().split("\n").forEach((line) => appendLog(job, line)));
    child.stderr.on("data", (chunk) => chunk.toString().split("\n").forEach((line) => appendLog(job, line)));
    child.on("error", reject);
    child.on("close", (code) => {
      job.children.delete(child);
      if (job.status === "cancelled" || job.status === "cancelling") reject(new Error("Cancelado pelo usuário."));
      else if (code === 0) resolve();
      else reject(new Error(`${command} terminou com código ${code}.`));
    });
  });
}

function trackChild(job, child) {
  job.children.add(child);
  job.pid = child.pid;
}

function signalChild(child, signal) {
  if (!child.pid || child.exitCode !== null) return;
  try {
    process.kill(-child.pid, signal);
  } catch {
    try { child.kill(signal); } catch { /* processo já encerrado */ }
  }
}

function cancelJob(job) {
  if (!["queued", "running", "cancelling", "awaiting_approval"].includes(job.status)) return false;
  updateJob(job, { status: "cancelling", stage: "Cancelando…" });
  for (const child of job.children) signalChild(child, "SIGTERM");
  if (job.children.size === 0) updateJob(job, { status: "cancelled", stage: "Cancelado pelo usuário" });
  else setTimeout(() => {
    if (job.status !== "cancelling") return;
    for (const child of job.children) signalChild(child, "SIGKILL");
    updateJob(job, { status: "cancelled", stage: "Cancelado pelo usuário" });
  }, 5000).unref();
  return true;
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
    const probeHost = config.previewHost === "0.0.0.0" ? "127.0.0.1" : config.previewHost;
    const probe = () => {
      if (child.exitCode !== null) return reject(new Error("O editor não conseguiu iniciar."));
      const request = http.get({ hostname: probeHost, port, path: "/", timeout: 800 }, (response) => {
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
    if (req.method === "GET" && pathname === "/api/visual-presets") return json(res, 200, visualPresets());
    const presetMatch = pathname.match(/^\/api\/visual-presets\/([a-z0-9-]+)$/);
    if (req.method === "GET" && presetMatch) {
      const preset = visualPreset(presetMatch[1]);
      return preset ? json(res, 200, { preset }) : json(res, 404, { error: "Preset visual não encontrado." });
    }
    if (req.method === "PUT" && presetMatch) {
      if (!visualPreset(presetMatch[1])) return json(res, 404, { error: "Preset visual não encontrado." });
      try {
        const preset = validatePreset(await readJson(req), presetMatch[1]);
        await savePreset(preset);
        return json(res, 200, { preset });
      } catch (error) {
        return json(res, 400, { error: error.message });
      }
    }
    if (req.method === "GET" && pathname === "/api/jobs") {
      return json(res, 200, { jobs: [...jobs.values()].map(serializeJob).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
    }

    if (req.method === "POST" && pathname === "/api/jobs") {
      const body = await readJson(req);
      let parsed;
      try { parsed = new URL(body.url); } catch { return json(res, 400, { error: "Informe uma URL válida." }); }
      if (!["http:", "https:"].includes(parsed.protocol)) return json(res, 400, { error: "A URL precisa começar com http:// ou https://." });
      const aspectRatio = body.aspectRatio || config.aspectRatio;
      if (!validAspectRatio(aspectRatio)) return json(res, 400, { error: "Escolha o formato 9:16 ou 16:9." });
      const conversationStyle = body.conversationStyle || config.conversationStyle;
      if (!selectableConversationStyle(conversationStyle)) return json(res, 400, { error: "Escolha um jeito de falar disponível." });
      const speechPace = body.speechPace || config.speechPace;
      if (!selectableSpeechPace(speechPace)) return json(res, 400, { error: "Escolha um ritmo de fala disponível." });
      const visualPresetId = body.visualPresetId || visualPresets().defaultPresetId;
      const selectedPreset = visualPreset(visualPresetId);
      if (!selectedPreset) return json(res, 400, { error: "Escolha um preset visual disponível." });
      const objective = String(body.objective || "").trim();
      if (objective.length > 4000) return json(res, 400, { error: "O objetivo deve ter no máximo 4.000 caracteres." });
      let slug = slugFromUrl(body.url);
      if (existsSync(path.join(config.videosDir, slug))) slug = `${slug}-${Date.now().toString(36).slice(-5)}`;
      const includeCta = body.includeCta !== false;
      const job = makeJob("generation", slug, { sourceUrl: body.url, instructions: objective, aspectRatio, includeCta, conversationStyle, speechPace, visualPresetId, visualPreset: selectedPreset });
      startGeneration(job);
      return json(res, 202, { job: serializeJob(job) });
    }

    const approveVisualMatch = pathname.match(/^\/api\/jobs\/([a-z0-9-]+)\/approve-visual$/);
    if (req.method === "POST" && approveVisualMatch) {
      const job = jobs.get(approveVisualMatch[1]);
      if (!job) return json(res, 404, { error: "Trabalho não encontrado nesta sessão." });
      if (job.type !== "generation" || job.status !== "awaiting_approval") return json(res, 409, { error: "Este trabalho não está aguardando aprovação visual." });
      if (!hasVisualGate(path.join(config.videosDir, job.project))) return json(res, 409, { error: "A cena-piloto não está completa." });
      continueGeneration(job);
      return json(res, 202, { job: serializeJob(job) });
    }

    const regenerateVisualMatch = pathname.match(/^\/api\/jobs\/([a-z0-9-]+)\/regenerate-visual$/);
    if (req.method === "POST" && regenerateVisualMatch) {
      const job = jobs.get(regenerateVisualMatch[1]);
      if (!job) return json(res, 404, { error: "Trabalho não encontrado nesta sessão." });
      if (job.type !== "generation" || job.status !== "awaiting_approval") return json(res, 409, { error: "A direção visual só pode ser atualizada durante o gate." });
      job.visualPreset = visualPreset(job.visualPresetId) || job.visualPreset;
      await unlink(path.join(config.videosDir, job.project, "snapshots", "visual-gate.png")).catch(() => {});
      updateJob(job, { status: "queued", stage: "Atualizando direção visual", error: null });
      startGeneration(job);
      return json(res, 202, { job: serializeJob(job) });
    }

    const cancelMatch = pathname.match(/^\/api\/jobs\/([a-z0-9-]+)\/cancel$/);
    if (req.method === "POST" && cancelMatch) {
      const job = jobs.get(cancelMatch[1]);
      if (!job) return json(res, 404, { error: "Trabalho não encontrado nesta sessão." });
      if (!cancelJob(job)) return json(res, 409, { error: "Este trabalho já terminou e não pode mais ser cancelado." });
      return json(res, 200, { job: serializeJob(job) });
    }

    const retryMatch = pathname.match(/^\/api\/jobs\/([a-z0-9-]+)\/retry$/);
    if (req.method === "POST" && retryMatch) {
      const body = await readJson(req);
      const previous = jobs.get(retryMatch[1]);
      if (!previous) return json(res, 404, { error: "Trabalho não encontrado nesta sessão." });
      if (previous.type !== "render" || !["failed", "cancelled"].includes(previous.status)) {
        return json(res, 409, { error: "Somente renders com falha ou cancelados podem ser retomados." });
      }
      if (activeJobForProject(previous.project)) {
        return json(res, 409, { error: "Este projeto já possui um trabalho em andamento." });
      }
      const retryMode = body.mode === "restart" ? "restart" : "resume";
      const job = createRenderJob(previous.project, {
        aspectRatio: previous.aspectRatio,
        includeCta: previous.includeCta,
        checkpointId: retryMode === "resume" ? previous.checkpointId : undefined,
        retryMode
      });
      if (retryMode === "restart") await clearRenderCheckpoint(previous);
      runRender(job, previous.project);
      return json(res, 202, { job: serializeJob(job) });
    }

    const transformMatch = pathname.match(/^\/api\/projects\/([a-z0-9-]+)\/(duplicate|edit)$/);
    if (req.method === "POST" && transformMatch) {
      const sourceProject = transformMatch[1];
      const operation = transformMatch[2];
      const sourceDir = path.join(config.videosDir, sourceProject);
      if (!existsSync(path.join(sourceDir, "index.html"))) return json(res, 404, { error: "Projeto não encontrado." });
      const body = await readJson(req);
      const instructions = String(body.instructions || "").trim();
      if (instructions.length < 3) return json(res, 400, { error: "Descreva o que deseja manter, retirar ou alterar." });
      if (instructions.length > 6000) return json(res, 400, { error: "A instrução deve ter no máximo 6.000 caracteres." });
      const sourceMetadata = readProjectMetadata(sourceDir);
      const aspectRatio = body.aspectRatio || sourceMetadata.aspect_ratio || sourceMetadata.aspectRatio || config.aspectRatio;
      if (!validAspectRatio(aspectRatio)) return json(res, 400, { error: "Escolha o formato 9:16 ou 16:9." });
      const includeCta = typeof body.includeCta === "boolean" ? body.includeCta : sourceMetadata.include_cta !== false;
      const conversationStyle = validConversationStyle(sourceMetadata.conversation_style) ? sourceMetadata.conversation_style : "preserve";
      const speechPace = validSpeechPace(sourceMetadata.speech_pace) ? sourceMetadata.speech_pace : "preserve";

      if (activeJobForProject(sourceProject)) {
        return json(res, 409, { error: "Este projeto já possui um trabalho em andamento. Cancele ou aguarde antes de continuar." });
      }

      const project = operation === "duplicate" ? uniqueProjectSlug(`${sourceProject}-copia`) : sourceProject;
      const job = makeJob(operation, project, { sourceProject, instructions, aspectRatio, includeCta, conversationStyle, speechPace });
      startProjectTransformation(job, operation === "duplicate");
      return json(res, 202, { job: serializeJob(job) });
    }

    const previewMatch = pathname.match(/^\/api\/projects\/([a-z0-9-]+)\/preview$/);
    if (req.method === "POST" && previewMatch) {
      const project = previewMatch[1];
      if (!existsSync(path.join(config.videosDir, project, "index.html"))) return json(res, 404, { error: "Projeto não encontrado." });
      const preview = await startPreview(project);
      const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const publicHost = requestUrl.hostname || "localhost";
      return json(res, 200, { url: `http://${publicHost}:${preview.port}/#project/${encodeURIComponent(project)}` });
    }

    const renderMatch = pathname.match(/^\/api\/projects\/([a-z0-9-]+)\/render$/);
    if (req.method === "POST" && renderMatch) {
      const project = renderMatch[1];
      if (!existsSync(path.join(config.videosDir, project, "index.html"))) return json(res, 404, { error: "Projeto não encontrado." });
      if (activeJobForProject(project)) return json(res, 409, { error: "Este projeto já possui um trabalho em andamento." });
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
  for (const job of jobs.values()) {
    for (const child of job.children) signalChild(child, "SIGTERM");
  }
  for (const preview of previews.values()) preview.child.kill("SIGTERM");
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
