const state = {
  config: null,
  projects: [],
  jobs: [],
  loading: false,
  command: null
};

const elements = {
  form: document.querySelector("#create-form"),
  input: document.querySelector("#source-url"),
  objective: document.querySelector("#video-objective"),
  aspectInputs: [...document.querySelectorAll('input[name="aspectRatio"]')],
  conversationSelect: document.querySelector("#conversation-style"),
  speechPaceSelect: document.querySelector("#speech-pace"),
  visualPresetSelect: document.querySelector("#visual-preset"),
  presetEditLink: document.querySelector("#preset-edit-link"),
  createCta: document.querySelector("#create-cta"),
  createButton: document.querySelector("#create-button"),
  formMessage: document.querySelector("#form-message"),
  defaults: document.querySelector("#defaults"),
  appVersion: document.querySelector("#app-version"),
  authLabel: document.querySelector("#auth-label"),
  authShort: document.querySelector("#auth-short"),
  systemState: document.querySelector("#system-state"),
  jobs: document.querySelector("#jobs"),
  projects: document.querySelector("#projects"),
  projectCount: document.querySelector("#project-count"),
  refreshButton: document.querySelector("#refresh-button"),
  toastRegion: document.querySelector("#toast-region")
};

const icons = {
  edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.3-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"/><path d="m14 7 3 3"/></svg>',
  prompt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4m0 10v4M3 12h4m10 0h4M6.4 6.4l2.1 2.1m7 7 2.1 2.1m0-11.2-2.1 2.1m-7 7-2.1 2.1"/><circle cx="12" cy="12" r="3"/></svg>',
  duplicate: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
  project: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8M8 13h5"/></svg>',
  render: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/></svg>',
  cancel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  retry: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></svg>'
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Erro HTTP ${response.status}`);
  return payload;
}

async function initialize() {
  try {
    state.config = await api("/api/config");
    renderConfig();
    await refresh();
    openRequestedProjectEdit();
    setInterval(refresh, 3500);
  } catch (error) {
    toast(error.message, true);
    elements.authLabel.textContent = "Sistema indisponível";
    elements.systemState.classList.remove("is-checking", "is-ready");
    elements.systemState.classList.add("is-error");
  }
}

function openRequestedProjectEdit() {
  const slug = new URLSearchParams(location.search).get("edit");
  const project = state.projects.find((item) => item.slug === slug);
  if (!project) return;
  state.command = { project: slug, mode: "edit", instructions: "", aspectRatio: project.aspectRatio || "9:16", includeCta: project.includeCta !== false };
  renderProjects();
  document.querySelector(`[data-project="${CSS.escape(slug)}"] textarea`)?.focus();
  history.replaceState(null, "", `${location.pathname}#library-title`);
}

function renderConfig() {
  const config = state.config;
  const conversation = config.conversationStyles?.find((item) => item.value === config.conversationStyle);
  const pace = config.speechPaces?.find((item) => item.value === config.speechPace);
  if (config.conversationStyles?.some((item) => item.value === config.conversationStyle)) elements.conversationSelect.value = config.conversationStyle;
  if (config.speechPaces?.some((item) => item.value === config.speechPace)) elements.speechPaceSelect.value = config.speechPace;
  elements.visualPresetSelect.innerHTML = (config.visualPresets || []).map((preset) => `<option value="${escapeHtml(preset.id)}">${escapeHtml(preset.name)} — ${escapeHtml(preset.description)}</option>`).join("");
  elements.visualPresetSelect.value = config.defaultVisualPresetId;
  updatePresetEditLink();
  elements.appVersion.textContent = config.version;
  elements.authLabel.textContent = config.authReady
    ? `${config.authMessage} · ${config.voiceId}`
    : config.authMessage;
  elements.authShort.textContent = config.authReady ? "Pronto" : "Atenção";
  elements.systemState.classList.remove("is-checking", "is-ready", "is-error");
  elements.systemState.classList.add(config.authReady ? "is-ready" : "is-error");
  const facts = [
    `${config.targetDuration}s ±${config.tolerance}%`,
    `${config.aspectRatio} · ${config.resolution}`,
    `${config.language} · ${config.voiceId}`,
    `${conversation?.label || config.conversationStyle} · fala ${pace?.label?.toLowerCase() || config.speechPace}`,
    `qualidade ≥ ${config.minimumQuality}`,
    "gate visual antes da produção"
  ];
  elements.defaults.innerHTML = facts.map((fact) => `<span>${escapeHtml(fact)}</span>`).join("");
}

async function refresh() {
  if (state.loading) return;
  state.loading = true;
  try {
    const [projectsPayload, jobsPayload] = await Promise.all([api("/api/projects"), api("/api/jobs")]);
    state.projects = projectsPayload.projects;
    state.jobs = jobsPayload.jobs;
    renderJobs();
    if (!state.command) renderProjects();
  } catch (error) {
    toast(error.message, true);
  } finally {
    state.loading = false;
  }
}

function renderJobs() {
  if (!state.jobs.length) {
    elements.jobs.replaceChildren(document.querySelector("#empty-jobs-template").content.cloneNode(true));
    return;
  }
  elements.jobs.innerHTML = state.jobs.map((job) => {
    const presentation = jobPresentation(job);
    const statusLabel = { queued: "Na fila", running: "Em andamento", awaiting_approval: "Sua aprovação", cancelling: "Cancelando", cancelled: "Cancelado", completed: "Concluído", failed: "Falhou" }[job.status] || job.status;
    const typeLabel = { generation: "Novo vídeo", duplicate: "Cópia", edit: "Edição por prompt", render: "Render" }[job.type] || job.type;
    const message = job.retryable
      ? job.resumeAvailable
        ? "Há etapas concluídas salvas. Continue do checkpoint ou escolha refazer todo o render."
        : "Não há um checkpoint reutilizável desta tentativa. Uma nova tentativa começará do início."
      : job.error || presentation.stage;
    const phases = job.phases.map((phase, index) => {
      const timing = job.phaseTimings?.find((item) => item.phaseIndex === index);
      const reused = job.skippedPhases?.includes(index);
      const phaseClass = reused ? "reused" : index === presentation.phaseIndex ? "current" : timing?.startedAt || index < presentation.phaseIndex ? "done" : "";
      const phaseMeta = reused
        ? "<em>reutilizada</em>"
        : timing?.durationMs == null ? "" : `<time datetime="PT${Math.max(0, Math.floor(timing.durationMs / 1000))}S">${formatDuration(timing.durationMs)}</time>`;
      return `<li class="${phaseClass}"><span>${escapeHtml(phase)}</span>${phaseMeta}</li>`;
    }).join("");
    const cancel = job.cancelable
      ? `<button class="cancel-action" type="button" data-job-action="cancel" data-job="${escapeHtml(job.id)}" ${job.status === "cancelling" ? "disabled" : ""}>${icons.cancel}<span>${job.status === "cancelling" ? "Cancelando" : "Cancelar"}</span></button>`
      : "";
    const projectBusy = state.jobs.some((candidate) => candidate.id !== job.id && candidate.project === job.project && ["queued", "running", "cancelling", "awaiting_approval"].includes(candidate.status));
    const recovery = job.retryable && !projectBusy
      ? job.resumeAvailable
        ? `<div class="job-recovery" aria-label="Opções para tentar novamente">
            <button class="retry-action is-primary" type="button" data-job-action="resume" data-job="${escapeHtml(job.id)}">${icons.render}<span>Continuar de onde parou</span></button>
            <button class="retry-action" type="button" data-job-action="restart" data-job="${escapeHtml(job.id)}">${icons.retry}<span>Refazer render completo</span></button>
          </div>`
        : `<div class="job-recovery"><button class="retry-action is-primary" type="button" data-job-action="restart" data-job="${escapeHtml(job.id)}">${icons.retry}<span>Tentar novamente</span></button></div>`
      : "";
    const visualGate = job.status === "awaiting_approval" && job.visualGate?.previewUrl
      ? `<section class="visual-gate${job.aspectRatio === "16:9" ? " is-horizontal" : ""}" aria-label="Aprovação da direção visual">
          <a class="visual-gate-preview" href="${escapeHtml(job.visualGate.previewUrl)}" target="_blank" rel="noopener" aria-label="Abrir cena-piloto em tamanho completo"><img src="${escapeHtml(job.visualGate.previewUrl)}" alt="Cena-piloto de ${escapeHtml(humanize(job.project))}"></a>
          <div class="visual-gate-copy">
            <span>Preset em uso</span>
            <strong>${escapeHtml(job.visualPresetName || "Preset visual")}</strong>
            <p>Confira composição, tipografia, cores e tratamento das imagens. A produção completa só começa após sua aprovação.</p>
            <div class="visual-gate-actions">
              <button class="retry-action is-primary" type="button" data-job-action="approve-visual" data-job="${escapeHtml(job.id)}">${icons.render}<span>Aprovar visual e produzir</span></button>
              <a class="retry-action" href="/presets.html?preset=${encodeURIComponent(job.visualPresetId || "")}" target="_blank" rel="noopener">${icons.edit}<span>Editar preset</span></a>
              <button class="retry-action" type="button" data-job-action="regenerate-visual" data-job="${escapeHtml(job.id)}">${icons.retry}<span>Atualizar cena-piloto</span></button>
            </div>
          </div>
        </section>`
      : "";
    return `<article class="job ${escapeHtml(job.status)}">
      <div class="job-top">
        <strong title="${escapeHtml(job.project)}">${escapeHtml(humanize(job.project))}</strong>
        <span class="job-state ${escapeHtml(job.status)}">${statusLabel}</span>
      </div>
      <p>${escapeHtml(message)}</p>
      ${job.retryable && job.error ? `<p class="job-error-detail">Detalhe: ${escapeHtml(job.error)}</p>` : ""}
      <ol class="job-phases" aria-label="Fases de ${escapeHtml(typeLabel)}">${phases}</ol>
      <div class="job-progress" aria-label="${escapeHtml(statusLabel)}"><i></i></div>
      <div class="job-actions"><span class="job-format">${escapeHtml(typeLabel)} · ${escapeHtml(job.aspectRatio)} · ${escapeHtml(job.conversationStyleLabel)} · fala ${escapeHtml(job.speechPaceLabel?.toLowerCase())} · ${formatDuration(job.totalDurationMs ?? elapsedDuration(job))} no total</span>${cancel}</div>
      ${visualGate}
      ${recovery}
    </article>`;
  }).join("");
}

function renderProjects() {
  elements.projectCount.textContent = `${state.projects.length} ${state.projects.length === 1 ? "projeto disponível" : "projetos disponíveis"}`;
  if (!state.projects.length) {
    elements.projects.replaceChildren(document.querySelector("#empty-projects-template").content.cloneNode(true));
    return;
  }
  elements.projects.innerHTML = state.projects.map((project) => {
    const latest = project.renders[0];
    const posterMedia = project.thumbnail
      ? `<img src="${project.thumbnail}" alt="Prévia de ${escapeHtml(project.name)}" loading="lazy">`
      : `<div class="poster-placeholder" aria-hidden="true">${icons.project}</div>`;
    const activeJob = state.jobs.find((job) => job.project === project.slug && ["queued", "running", "cancelling", "awaiting_approval"].includes(job.status));
    const activePresentation = activeJob ? jobPresentation(activeJob) : null;
    const effectiveCta = activeJob ? activeJob.includeCta ?? project.includeCta : project.includeCta;
    const projectStatus = activeJob ? `${activePresentation.stage} · editor após concluir` : latest ? "Pronto para assistir" : "Aguardando revisão";
    const statusClass = activeJob ? "is-active" : latest ? "is-ready" : "is-pending";
    const renderMeta = latest ? formatBytes(latest.size) : "Ainda sem MP4";
    const download = latest ? `<a class="download-action" href="${latest.url}" download>${icons.download}<span>Baixar</span></a>` : "";
    const poster = latest
      ? `<a class="project-poster" href="${latest.url}" target="_blank" rel="noopener noreferrer" aria-label="Assistir ao vídeo pronto ${escapeHtml(project.name)}">${posterMedia}<span class="poster-play" aria-hidden="true">${icons.render}</span></a>`
      : `<div class="project-poster" role="img" aria-label="${escapeHtml(project.name)} — aguardando revisão">${posterMedia}</div>`;
    const commandOpen = !activeJob && state.command?.project === project.slug;
    const commandMode = commandOpen ? state.command.mode : "edit";
    const isDuplicate = commandMode === "duplicate";
    const commandTitle = isDuplicate ? "Criar uma cópia com instruções" : "Editar este projeto com uma instrução";
    const commandDescription = isDuplicate
      ? "O original fica intacto. A nova versão recebe somente as mudanças que você descrever."
      : "A alteração acontece neste projeto. Diga também o que deve permanecer como está.";
    const commandPanel = `<form class="project-command" data-command-form data-project="${escapeHtml(project.slug)}" data-mode="${escapeHtml(commandMode)}" ${commandOpen ? "" : "hidden"}>
      <div class="project-command-copy"><h4>${commandTitle}</h4><p>${commandDescription}</p></div>
      ${isDuplicate ? "" : `<div class="prompt-presets" aria-label="Instruções rápidas"><span>Atalhos</span><button type="button" data-prompt-preset="continue">Continuar de onde parou</button><button type="button" data-prompt-preset="validate">Corrigir e validar</button></div>`}
      <textarea name="instructions" maxlength="6000" required placeholder="Ex.: retire a cena sobre preços, mantenha a voz e deixe o ritmo mais direto.">${commandOpen ? escapeHtml(state.command.instructions) : ""}</textarea>
      ${formatPicker(project.slug, commandOpen ? state.command.aspectRatio : project.aspectRatio)}
      ${ctaPicker(commandOpen ? state.command.includeCta : project.includeCta)}
      <div class="command-actions">
        <button class="command-close" type="button" data-command-close>Fechar</button>
        <button class="command-submit" type="submit">${isDuplicate ? "Criar cópia" : "Aplicar edição"}</button>
      </div>
    </form>`;
    const unavailable = activeJob
      ? `disabled aria-disabled="true" title="Disponível quando a produção terminar"`
      : "";
    const editorLabel = activeJob ? "Editor após concluir" : "Abrir editor";
    return `<article class="project${project.aspectRatio === "16:9" ? " is-horizontal" : ""}" data-project="${escapeHtml(project.slug)}">
      ${poster}
      <div class="project-body">
        <h3>${escapeHtml(project.name)}</h3>
        <div class="project-meta">
          <span class="project-status ${statusClass}">${escapeHtml(projectStatus)}</span>
          <span>${escapeHtml(renderMeta)}</span>
          <span>${escapeHtml(project.aspectRatio)}</span>
          <span>${escapeHtml(project.conversationStyleLabel)}</span>
          <span>${escapeHtml(project.visualPresetName)}</span>
          <span>Fala ${escapeHtml(project.speechPaceLabel.toLowerCase())}</span>
          <span>${effectiveCta ? "CTA no final" : "Sem CTA"}</span>
          <span>Atualizado ${formatDate(project.modifiedAt)}</span>
        </div>
      </div>
      <div class="project-actions">
        <button class="secondary-action" type="button" data-action="edit-visual" data-project="${escapeHtml(project.slug)}" ${unavailable}>${icons.edit}<span class="action-label">${editorLabel}</span></button>
        <button class="secondary-action is-accent" type="button" data-action="edit-prompt" data-project="${escapeHtml(project.slug)}" ${unavailable}>${icons.prompt}<span class="action-label">Editar com prompt</span></button>
        <button class="secondary-action" type="button" data-action="duplicate" data-project="${escapeHtml(project.slug)}" ${unavailable}>${icons.duplicate}<span class="action-label">Criar cópia</span></button>
        <button class="secondary-action" type="button" data-action="render" data-project="${escapeHtml(project.slug)}" ${unavailable}>${icons.render}<span class="action-label">Aprovar e renderizar</span></button>
        ${download}
      </div>
      ${commandPanel}
    </article>`;
  }).join("");
}

function jobPresentation(job) {
  const presentation = { stage: job.stage, phaseIndex: job.phaseIndex };
  if (job.status !== "running" || job.type !== "generation") return presentation;
  if (Array.isArray(job.phaseTimings)) return presentation;

  const activities = [...(job.logs || [])]
    .reverse()
    .filter((line) => line && !/\bERROR\b|verification failed|operation not permitted/i.test(line));

  for (const activity of activities) {
    if (/\bhyperframes(?:@\S+)?\s+check\b|validando|valida[cç][aã]o|inspe[cç][aã]o|auditoria|margem|passe final/i.test(activity)) {
      return { stage: "Validando composição", phaseIndex: 4 };
    }
    if (/\bhyperframes(?:@\S+)?\s+snapshot\b|snapshots?|imagens? de revis[aã]o/i.test(activity)) {
      return { stage: "Gerando imagens de revisão", phaseIndex: 4 };
    }
    if (/edge-tts|ffmpeg|\b[aá]udio\b|\bvoz\b|narra[cç][aã]o/i.test(activity)) {
      return { stage: "Produzindo mídia e voz", phaseIndex: 3 };
    }
    if (/storyboard|roteiro|frames?|cenas?|composi[cç][aã]o|timelines?|primeira metade|segunda onda|constru[cç][aã]o/i.test(activity)) {
      return { stage: "Criando cenas", phaseIndex: 2 };
    }
  }
  if (job.phaseIndex >= 4) return { stage: "Produção em andamento", phaseIndex: 2 };
  return presentation;
}

function formatPicker(project, selected) {
  const name = `command-aspect-${project}`;
  return `<fieldset class="format-picker" aria-label="Formato desta versão">
    <legend>Formato</legend>
    <label><input type="radio" name="${escapeHtml(name)}" value="9:16" ${selected === "9:16" ? "checked" : ""}><span><i class="format-icon vertical" aria-hidden="true"></i>9:16 <small>Vertical</small></span></label>
    <label><input type="radio" name="${escapeHtml(name)}" value="16:9" ${selected === "16:9" ? "checked" : ""}><span><i class="format-icon horizontal" aria-hidden="true"></i>16:9 <small>Horizontal</small></span></label>
  </fieldset>`;
}

function ctaPicker(checked) {
  return `<label class="cta-choice compact">
    <input type="checkbox" name="includeCta" ${checked ? "checked" : ""}>
    <span class="cta-check" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="m3.5 8.2 2.8 2.8 6.2-6.2"/></svg></span>
    <span><strong>Adicionar CTA INEMA.CLUB ao final</strong><small>Ative para incluir o encerramento; desative para renderizar sem ele.</small></span>
  </label>`;
}

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  elements.formMessage.textContent = "";
  elements.createButton.disabled = true;
  elements.form.classList.add("is-working");
  try {
    const url = elements.input.value.trim();
    const objective = elements.objective.value.trim();
    const aspectRatio = elements.aspectInputs.find((input) => input.checked)?.value || "9:16";
    const conversationStyle = elements.conversationSelect.value || "popular";
    const speechPace = elements.speechPaceSelect.value || "natural";
    const visualPresetId = elements.visualPresetSelect.value;
    const includeCta = elements.createCta.checked;
    await api("/api/jobs", { method: "POST", body: JSON.stringify({ url, objective, aspectRatio, conversationStyle, speechPace, visualPresetId, includeCta }) });
    elements.input.value = "";
    elements.objective.value = "";
    toast("Direção visual iniciada. A produção completa aguardará sua aprovação.");
    await refresh();
  } catch (error) {
    elements.formMessage.textContent = error.message;
  } finally {
    elements.createButton.disabled = false;
    elements.form.classList.remove("is-working");
  }
});

function updatePresetEditLink() {
  elements.presetEditLink.href = `/presets.html?preset=${encodeURIComponent(elements.visualPresetSelect.value || "")}`;
}

elements.visualPresetSelect.addEventListener("change", updatePresetEditLink);

elements.projects.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const project = button.dataset.project;
  if (button.dataset.action === "edit-prompt" || button.dataset.action === "duplicate") {
    const projectData = state.projects.find((item) => item.slug === project);
    state.command = {
      project,
      mode: button.dataset.action === "duplicate" ? "duplicate" : "edit",
      instructions: "",
      aspectRatio: projectData?.aspectRatio || "9:16",
      includeCta: projectData?.includeCta !== false
    };
    renderProjects();
    elements.projects.querySelector(`[data-project="${project}"] textarea`)?.focus();
    return;
  }

  const opensPreview = button.dataset.action === "edit-visual";
  const editorWindow = opensPreview ? window.open("about:blank", "_blank") : null;
  const actionLabel = button.querySelector(".action-label");
  button.disabled = true;
  try {
    if (opensPreview) {
      if (!editorWindow) throw new Error("O navegador bloqueou a nova aba. Permita pop-ups para abrir o editor.");
      editorWindow.document.title = "Abrindo editor…";
      editorWindow.document.body.textContent = "Preparando o HyperFrames Studio…";
      if (actionLabel) actionLabel.textContent = "Abrindo…";
      const result = await api(`/api/projects/${project}/preview`, { method: "POST", body: "{}" });
      editorWindow.opener = null;
      editorWindow.location.href = result.url;
      toast("Prévia aberta. Use o play do editor para assistir e revisar.");
    } else {
      button.querySelector("span").textContent = "Renderizando…";
      toast("Validação e renderização iniciadas. Isso pode levar alguns minutos.");
      await api(`/api/projects/${project}/render`, { method: "POST", body: "{}" });
      toast("Render adicionado à produção. O MP4 aparecerá quando estiver pronto.");
      await refresh();
    }
  } catch (error) {
    if (editorWindow && !editorWindow.closed) editorWindow.close();
    toast(error.message, true);
  } finally {
    button.disabled = false;
    if (actionLabel) actionLabel.textContent = opensPreview ? "Abrir editor" : "Aprovar e renderizar";
  }
});

elements.projects.addEventListener("input", (event) => {
  if (!state.command) return;
  const form = event.target.closest("[data-command-form]");
  if (!form) return;
  if (event.target.name === "instructions") state.command.instructions = event.target.value;
  if (event.target.type === "radio" && event.target.checked) state.command.aspectRatio = event.target.value;
  if (event.target.name === "includeCta") state.command.includeCta = event.target.checked;
});

elements.projects.addEventListener("click", (event) => {
  const preset = event.target.closest("[data-prompt-preset]");
  if (preset && state.command) {
    const instructions = preset.dataset.promptPreset === "continue"
      ? "Continue a produção exatamente de onde parou. Preserve tudo que já está correto, conclua o que estiver incompleto, corrija os erros de validação, gere snapshots para revisão e rode hyperframes check até passar. Não renderize ainda."
      : "Corrija todos os erros e avisos relevantes do hyperframes check. Preserve o roteiro, a voz e a identidade visual. Gere snapshots para revisão e rode o check novamente até passar. Não renderize ainda.";
    state.command.instructions = instructions;
    const textarea = preset.closest("[data-command-form]")?.elements.instructions;
    if (textarea) {
      textarea.value = instructions;
      textarea.focus();
    }
    return;
  }
  if (!event.target.closest("[data-command-close]")) return;
  state.command = null;
  renderProjects();
});

elements.projects.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-command-form]");
  if (!form) return;
  event.preventDefault();
  const submit = form.querySelector(".command-submit");
  const instructions = form.elements.instructions.value.trim();
  const aspectRatio = form.querySelector('input[type="radio"]:checked')?.value || "9:16";
  const includeCta = form.elements.includeCta.checked;
  submit.disabled = true;
  submit.textContent = form.dataset.mode === "duplicate" ? "Criando…" : "Aplicando…";
  try {
    await api(`/api/projects/${form.dataset.project}/${form.dataset.mode}`, {
      method: "POST",
      body: JSON.stringify({ instructions, aspectRatio, includeCta })
    });
    const duplicated = form.dataset.mode === "duplicate";
    state.command = null;
    renderProjects();
    toast(duplicated ? "Cópia iniciada. O projeto original não será alterado." : "Edição iniciada. Acompanhe as fases em Produção.");
    await refresh();
  } catch (error) {
    toast(error.message, true);
    submit.disabled = false;
    submit.textContent = form.dataset.mode === "duplicate" ? "Criar cópia" : "Aplicar edição";
  }
});

elements.jobs.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-job-action]");
  if (!button) return;
  const action = button.dataset.jobAction;
  if (action === "cancel" && !window.confirm("Cancelar este trabalho agora? Os arquivos já produzidos serão preservados para inspeção.")) return;
  const related = button.closest(".job")?.querySelectorAll("button[data-job-action]") || [button];
  related.forEach((item) => { item.disabled = true; });
  button.disabled = true;
  const label = button.querySelector("span");
  if (label) label.textContent = action === "cancel" ? "Cancelando" : action === "restart" ? "Reiniciando…" : action === "approve-visual" ? "Iniciando produção…" : action === "regenerate-visual" ? "Atualizando…" : "Continuando…";
  try {
    if (action === "cancel") {
      await api(`/api/jobs/${button.dataset.job}/cancel`, { method: "POST", body: "{}" });
      toast("Cancelamento solicitado. Os checkpoints concluídos serão preservados.");
    } else if (action === "approve-visual") {
      await api(`/api/jobs/${button.dataset.job}/approve-visual`, { method: "POST", body: "{}" });
      toast("Visual aprovado. A produção completa foi iniciada.");
    } else if (action === "regenerate-visual") {
      await api(`/api/jobs/${button.dataset.job}/regenerate-visual`, { method: "POST", body: "{}" });
      toast("Cena-piloto sendo atualizada com a versão atual do preset.");
    } else {
      await api(`/api/jobs/${button.dataset.job}/retry`, { method: "POST", body: JSON.stringify({ mode: action === "restart" ? "restart" : "resume" }) });
      toast(action === "restart" ? "Render completo reiniciado. Todas as fases serão executadas." : "Trabalho retomado. As etapas válidas serão reutilizadas.");
    }
    await refresh();
  } catch (error) {
    toast(error.message, true);
    related.forEach((item) => { item.disabled = false; });
    if (label) label.textContent = action === "cancel" ? "Cancelar" : action === "restart" ? "Refazer render completo" : action === "approve-visual" ? "Aprovar visual e produzir" : action === "regenerate-visual" ? "Atualizar cena-piloto" : "Continuar de onde parou";
  }
});

elements.refreshButton.addEventListener("click", refresh);

function toast(message, error = false) {
  const node = document.createElement("div");
  node.className = `toast${error ? " error" : ""}`;
  if (error) node.setAttribute("role", "alert");
  node.textContent = message;
  elements.toastRegion.append(node);
  setTimeout(() => node.remove(), 5200);
}

function humanize(slug) {
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatBytes(bytes) {
  if (!bytes) return "0 MB";
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

function elapsedDuration(job) {
  const end = ["completed", "failed", "cancelled"].includes(job.status) ? new Date(job.updatedAt).getTime() : Date.now();
  return Math.max(0, end - new Date(job.createdAt).getTime());
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(Number(milliseconds || 0) / 1000));
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours) return `${hours}h ${String(minutes).padStart(2, "0")}min`;
  return seconds ? `${minutes}min ${String(seconds).padStart(2, "0")}s` : `${minutes}min`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

initialize();
