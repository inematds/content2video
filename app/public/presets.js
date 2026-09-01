const state = { presets: [], selected: null, dirty: false, projects: [] };
const elements = {
  list: document.querySelector("#preset-list"),
  form: document.querySelector("#preset-form"),
  title: document.querySelector("#preset-editor-title"),
  palette: document.querySelector("#palette-preview"),
  message: document.querySelector("#preset-message"),
  producedList: document.querySelector("#produced-list"),
  producedCount: document.querySelector("#produced-count"),
  toastRegion: document.querySelector("#toast-region")
};

async function api(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Erro HTTP ${response.status}`);
  return payload;
}

async function initialize() {
  try {
    const [presetData, projectData] = await Promise.all([api("/api/visual-presets"), api("/api/projects")]);
    state.presets = presetData.presets || [];
    state.projects = projectData.projects || [];
    const requested = new URLSearchParams(location.search).get("preset");
    selectPreset(state.presets.find((preset) => preset.id === requested) || state.presets.find((preset) => preset.id === presetData.defaultPresetId) || state.presets[0]);
    renderVideos();
  } catch (error) { toast(error.message, true); }
}

function selectPreset(preset) {
  if (!preset) return;
  state.selected = structuredClone(preset);
  state.dirty = false;
  history.replaceState(null, "", `/presets.html?preset=${encodeURIComponent(preset.id)}`);
  for (const [name, value] of Object.entries(preset)) if (elements.form.elements[name]) elements.form.elements[name].value = value;
  elements.title.textContent = preset.name;
  elements.message.textContent = "Nenhuma alteração.";
  renderPresetList();
  renderPalette();
}

function renderPresetList() {
  elements.list.innerHTML = state.presets.map((preset) => `<button type="button" class="preset-list-item${preset.id === state.selected?.id ? " is-active" : ""}" data-preset="${escapeHtml(preset.id)}"><strong>${escapeHtml(preset.name)}</strong><span>${escapeHtml(preset.description)}</span></button>`).join("");
}

function renderPalette() {
  const colors = [...new Set((elements.form.elements.palette.value.match(/#[0-9a-f]{6}\b/gi) || []))].slice(0, 8);
  elements.palette.innerHTML = colors.map((color) => `<i style="--swatch:${escapeHtml(color)}" title="${escapeHtml(color)}"></i>`).join("");
}

function renderVideos() {
  elements.producedCount.textContent = `${state.projects.length} ${state.projects.length === 1 ? "vídeo editável" : "vídeos editáveis"}`;
  if (!state.projects.length) {
    elements.producedList.innerHTML = '<p class="preset-empty">Nenhum vídeo concluído ainda.</p>';
    return;
  }
  elements.producedList.innerHTML = state.projects.map((project) => `<article class="produced-item">
    ${project.thumbnail ? `<img src="${escapeHtml(project.thumbnail)}" alt="Prévia de ${escapeHtml(project.name)}" loading="lazy">` : '<div class="produced-placeholder" aria-hidden="true"></div>'}
    <div><h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(project.aspectRatio)} · ${escapeHtml(project.visualPresetName)} · ${project.renders.length ? "MP4 pronto" : "Aguardando render"}</p></div>
    <div class="produced-actions"><button type="button" data-edit-project="${escapeHtml(project.slug)}">Abrir editor</button><a href="/?edit=${encodeURIComponent(project.slug)}#library-title">Editar com prompt</a></div>
  </article>`).join("");
}

elements.list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-preset]");
  if (!button) return;
  if (state.dirty && !confirm("Descartar as alterações ainda não salvas?")) return;
  selectPreset(state.presets.find((preset) => preset.id === button.dataset.preset));
});

elements.form.addEventListener("input", () => {
  state.dirty = true;
  elements.message.textContent = "Alterações ainda não salvas.";
  elements.title.textContent = elements.form.elements.name.value || state.selected.name;
  renderPalette();
});

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = elements.form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.querySelector("span").textContent = "Salvando…";
  try {
    const payload = Object.fromEntries(new FormData(elements.form));
    const { preset } = await api(`/api/visual-presets/${state.selected.id}`, { method: "PUT", body: JSON.stringify(payload) });
    const index = state.presets.findIndex((item) => item.id === preset.id);
    state.presets[index] = preset;
    selectPreset(preset);
    elements.message.textContent = "Preset salvo localmente.";
    toast("Preset salvo. Use “Atualizar cena-piloto” no gate para aplicar as mudanças.");
  } catch (error) {
    elements.message.textContent = error.message;
    toast(error.message, true);
  } finally {
    button.disabled = false;
    button.querySelector("span").textContent = "Salvar preset local";
  }
});

elements.producedList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-edit-project]");
  if (!button) return;
  const editorWindow = window.open("about:blank", "_blank");
  if (!editorWindow) return toast("Permita pop-ups para abrir o editor.", true);
  button.disabled = true;
  try {
    editorWindow.document.body.textContent = "Preparando o HyperFrames Studio…";
    const result = await api(`/api/projects/${button.dataset.editProject}/preview`, { method: "POST", body: "{}" });
    editorWindow.opener = null;
    editorWindow.location.href = result.url;
  } catch (error) {
    editorWindow.close();
    toast(error.message, true);
  } finally { button.disabled = false; }
});

window.addEventListener("beforeunload", (event) => {
  if (!state.dirty) return;
  event.preventDefault();
  event.returnValue = "";
});

function toast(message, error = false) {
  const node = document.createElement("div");
  node.className = `toast${error ? " error" : ""}`;
  node.textContent = message;
  elements.toastRegion.append(node);
  setTimeout(() => node.remove(), 5200);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

initialize();
