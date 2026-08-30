const state = {
  config: null,
  projects: [],
  jobs: [],
  loading: false
};

const elements = {
  form: document.querySelector("#create-form"),
  input: document.querySelector("#source-url"),
  createButton: document.querySelector("#create-button"),
  formMessage: document.querySelector("#form-message"),
  defaults: document.querySelector("#defaults"),
  authLabel: document.querySelector("#auth-label"),
  systemState: document.querySelector("#system-state"),
  jobs: document.querySelector("#jobs"),
  projects: document.querySelector("#projects"),
  projectCount: document.querySelector("#project-count"),
  refreshButton: document.querySelector("#refresh-button"),
  toastRegion: document.querySelector("#toast-region")
};

const icons = {
  edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.3-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"/><path d="m14 7 3 3"/></svg>',
  render: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/></svg>'
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
    setInterval(refresh, 3500);
  } catch (error) {
    toast(error.message, true);
    elements.authLabel.textContent = "Sistema indisponível";
    elements.systemState.classList.remove("is-checking", "is-ready");
    elements.systemState.classList.add("is-error");
  }
}

function renderConfig() {
  const config = state.config;
  elements.authLabel.textContent = config.authReady
    ? `${config.authMessage} · ${config.voiceId}`
    : config.authMessage;
  elements.systemState.classList.remove("is-checking", "is-ready", "is-error");
  elements.systemState.classList.add(config.authReady ? "is-ready" : "is-error");
  const facts = [
    `${config.targetDuration}s ±${config.tolerance}%`,
    `${config.aspectRatio} · ${config.resolution}`,
    `${config.language} · ${config.voiceId}`,
    `qualidade ≥ ${config.minimumQuality}`
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
    renderProjects();
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
    const statusLabel = { queued: "Na fila", running: "Em andamento", completed: "Concluído", failed: "Falhou" }[job.status] || job.status;
    const message = job.error || job.stage;
    return `<article class="job ${escapeHtml(job.status)}">
      <div class="job-top">
        <strong title="${escapeHtml(job.project)}">${escapeHtml(humanize(job.project))}</strong>
        <span class="job-state ${escapeHtml(job.status)}">${statusLabel}</span>
      </div>
      <p>${escapeHtml(message)}</p>
      <div class="job-progress" aria-label="${escapeHtml(statusLabel)}"><i></i></div>
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
    const poster = project.thumbnail
      ? `<img src="${project.thumbnail}" alt="Prévia de ${escapeHtml(project.name)}" loading="lazy">`
      : `<div class="poster-placeholder" aria-hidden="true">▶</div>`;
    const renderMeta = latest ? `${formatBytes(latest.size)} · MP4 pronto` : "Ainda sem MP4";
    const download = latest ? `<a class="download-action" href="${latest.url}" download>${icons.download}<span>Baixar</span></a>` : "";
    return `<article class="project" data-project="${escapeHtml(project.slug)}">
      <div class="project-poster">${poster}</div>
      <div class="project-body">
        <h3>${escapeHtml(project.name)}</h3>
        <div class="project-meta">
          <span>${escapeHtml(renderMeta)}</span>
          <span>Atualizado ${formatDate(project.modifiedAt)}</span>
        </div>
      </div>
      <div class="project-actions">
        <button class="secondary-action" type="button" data-action="edit" data-project="${escapeHtml(project.slug)}">${icons.edit}<span>Editar</span></button>
        <button class="secondary-action" type="button" data-action="render" data-project="${escapeHtml(project.slug)}">${icons.render}<span>Aprovar e renderizar</span></button>
        ${download}
      </div>
    </article>`;
  }).join("");
}

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  elements.formMessage.textContent = "";
  elements.createButton.disabled = true;
  elements.form.classList.add("is-working");
  try {
    const url = elements.input.value.trim();
    await api("/api/jobs", { method: "POST", body: JSON.stringify({ url }) });
    elements.input.value = "";
    toast("Produção iniciada. Você pode acompanhar o andamento abaixo.");
    await refresh();
  } catch (error) {
    elements.formMessage.textContent = error.message;
  } finally {
    elements.createButton.disabled = false;
    elements.form.classList.remove("is-working");
  }
});

elements.projects.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const project = button.dataset.project;
  const editorWindow = button.dataset.action === "edit" ? window.open("about:blank", "_blank") : null;
  button.disabled = true;
  try {
    if (button.dataset.action === "edit") {
      if (!editorWindow) throw new Error("O navegador bloqueou a nova aba. Permita pop-ups para abrir o editor.");
      editorWindow.document.title = "Abrindo editor…";
      editorWindow.document.body.textContent = "Preparando o HyperFrames Studio…";
      button.querySelector("span").textContent = "Abrindo…";
      const result = await api(`/api/projects/${project}/preview`, { method: "POST", body: "{}" });
      editorWindow.opener = null;
      editorWindow.location.href = result.url;
      toast("Editor aberto em uma nova aba.");
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
    button.querySelector("span").textContent = button.dataset.action === "edit" ? "Editar" : "Aprovar e renderizar";
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

initialize();
