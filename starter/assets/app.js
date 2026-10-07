// Cloud Model Lab — frontend (vanilla JS, ES module, tanpa build step)
import { FACTORS, LAYERS, STACK_MODELS, recommend } from '../lib/engine.js';

const $ = (id) => document.getElementById(id);
const DEFAULT_MODEL = 'PaaS';

// Catatan khusus per lapisan untuk model tertentu (index = urutan di LAYERS)
const OWNER_NOTES = {
  FaaS: { 2: 'Anda, per fungsi', 3: 'Provider, scale-to-zero' },
  BaaS: { 2: 'Provider, via SDK/API' },
  SaaS: { 0: 'Anda, tetap!' },
};

/* ------------------------------------------------------------------
   1. Responsibility stack
   ------------------------------------------------------------------ */
function renderSwitcher() {
  const container = $('model-options');
  STACK_MODELS.forEach((model) => {
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'model';
    input.id = `model-${model.id}`;
    input.value = model.id;
    input.checked = model.id === DEFAULT_MODEL;
    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = model.name;
    container.append(input, label);
  });
  container.addEventListener('change', (event) => showModel(event.target.value));
}

function renderLayers() {
  const list = $('stack-layers');
  LAYERS.forEach((name, i) => {
    const li = document.createElement('li');
    li.className = 'layer';
    li.innerHTML = `<span class="level">L${LAYERS.length - i}</span><span class="name"></span><span class="owner"></span>`;
    li.querySelector('.name').textContent = name;
    list.append(li);
  });
  const boundary = document.createElement('li');
  boundary.className = 'boundary';
  boundary.setAttribute('aria-hidden', 'true');
  boundary.innerHTML = '<span></span>';
  list.append(boundary);
}

let currentModel = DEFAULT_MODEL;

function showModel(id) {
  const model = STACK_MODELS.find((m) => m.id === id) ?? STACK_MODELS[0];
  currentModel = model.id;
  $('model-name').textContent = model.name;
  $('model-full').textContent = model.full;
  $('model-definition').textContent = model.definition;
  $('model-examples').textContent = model.examples;

  const layers = [...document.querySelectorAll('.layer')];
  layers.forEach((li, i) => {
    const isYou = i < model.youManage;
    li.classList.toggle('is-you', isYou);
    li.querySelector('.owner').textContent = OWNER_NOTES[model.id]?.[i] ?? (isYou ? 'Anda' : 'Provider');
  });
  placeBoundary(model);

  const yours = LAYERS.slice(0, model.youManage).join(', ');
  $('stack-summary').textContent = `${model.name}: Anda mengelola ${model.youManage} dari ${LAYERS.length} lapisan (${yours}). Sisanya dikelola provider.`;
}

function placeBoundary(model) {
  const layers = [...document.querySelectorAll('.layer')];
  const boundary = document.querySelector('.boundary');
  if (!layers.length || !boundary) return;
  const gap = parseFloat(getComputedStyle(document.querySelector('.stack-layers')).rowGap) || 0;
  const y = model.youManage >= layers.length
    ? layers.at(-1).offsetTop + layers.at(-1).offsetHeight + gap / 2
    : layers[model.youManage].offsetTop - gap / 2;
  boundary.style.transform = `translateY(${y}px)`;
  boundary.querySelector('span').textContent = model.youManage >= layers.length
    ? 'Semua lapisan urusan Anda'
    : 'Garis tanggung jawab';
}

/* ------------------------------------------------------------------
   2. Analyzer
   ------------------------------------------------------------------ */
let cases = [];

function renderFactors() {
  const list = $('factor-list');
  FACTORS.forEach((factor) => {
    const label = document.createElement('label');
    label.className = 'factor';
    label.innerHTML = `
      <input type="checkbox" name="factor" value="${factor.id}">
      <span class="factor-label"></span>`;
    const text = label.querySelector('.factor-label');
    text.textContent = factor.label;
    const hint = document.createElement('span');
    hint.className = 'factor-hint';
    hint.textContent = factor.hint;
    text.append(hint);
    list.append(label);
  });
}

const selectedFactors = () =>
  [...document.querySelectorAll('input[name="factor"]:checked')].map((el) => el.value);

async function loadCases() {
  try {
    const res = await fetch('data/cases.json');
    if (!res.ok) throw new Error(res.status);
    cases = (await res.json()).cases;
  } catch {
    $('preset').disabled = true;
    return;
  }
  const select = $('preset');
  cases.forEach((c) => {
    const group = document.createElement('optgroup');
    group.label = `${c.type === 'worked' ? 'Contoh' : 'Latihan'} ${c.id}: ${c.title}`;
    c.components.forEach((comp, index) => {
      const option = document.createElement('option');
      option.value = `${c.id}:${index}`;
      option.textContent = comp.name;
      group.append(option);
    });
    select.append(group);
  });
}

function applyPreset(value) {
  const context = $('case-context');
  if (!value) {
    context.hidden = true;
    return;
  }
  const [caseId, index] = value.split(':');
  const c = cases.find((item) => item.id === caseId);
  const comp = c?.components[Number(index)];
  if (!comp) return;
  document.querySelectorAll('input[name="factor"]').forEach((el) => {
    el.checked = comp.factors.includes(el.value);
  });
  context.textContent = c.context;
  context.hidden = false;
  analyze();
}

let debounceTimer;
function scheduleAnalyze() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(analyze, 180);
}

let requestSeq = 0;
async function analyze() {
  const factors = selectedFactors();
  const seq = ++requestSeq;
  if (factors.length === 0) {
    $('result-empty').hidden = false;
    $('result-body').hidden = true;
    return;
  }

  let result;
  let source;
  const started = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ factors }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    result = await res.json();
    source = { remote: true, ms: Math.round(performance.now() - started) };
  } catch {
    // Fallback: logika yang sama, dijalankan di browser.
    result = recommend(factors);
    source = { remote: false };
  }
  if (seq !== requestSeq) return; // ada request yang lebih baru
  renderResult(result, source, factors);
}

function renderResult(result, source, factors) {
  if (!result.ok) {
    $('result-empty').textContent = result.error;
    $('result-empty').hidden = false;
    $('result-body').hidden = true;
    return;
  }
  $('result-empty').hidden = true;
  $('result-body').hidden = false;

  // Deployment
  $('deploy-name').textContent = result.deployment.name;
  $('deploy-def').textContent = result.deployment.definition;
  const ranking = result.deployment.ranking;
  const max = Math.max(1, ...ranking.map((d) => d.score));
  $('deploy-bars').replaceChildren(...ranking.map((d, i) => {
    const li = document.createElement('li');
    li.className = `bar${i === 0 ? ' is-top' : ''}`;
    const width = Math.max(0, (d.score / max) * 100);
    li.innerHTML = `<span class="bar-name"></span><span class="bar-track"><span class="bar-fill" style="width:${width}%"></span></span><span class="bar-score">${d.score}</span>`;
    li.querySelector('.bar-name').textContent = d.name;
    return li;
  }));

  // Service combination
  $('combo').replaceChildren(...result.services.combination.map((s) => {
    const li = document.createElement('li');
    li.className = 'combo-item';
    li.innerHTML = `
      <div class="combo-head">
        <span class="combo-name"></span>
        <span class="combo-full"></span>
        <span class="role ${s.role === 'utama' ? 'is-main' : ''}">${s.role}</span>
        <span class="combo-score">skor ${s.score}</span>
      </div>
      <ul class="reasons"></ul>
      <p class="combo-examples"></p>`;
    li.querySelector('.combo-name').textContent = s.name;
    li.querySelector('.combo-full').textContent = s.full;
    li.querySelector('.combo-examples').textContent = `Contoh layanan: ${s.examples}`;
    const reasons = li.querySelector('.reasons');
    s.reasons.forEach((r) => {
      const item = document.createElement('li');
      item.className = r.weight > 0 ? 'plus' : 'minus';
      item.textContent = `${r.weight > 0 ? '+' : '−'}${Math.abs(r.weight)} ${r.label}`;
      reasons.append(item);
    });
    return li;
  }));

  // Notes
  const notes = result.notes.length ? result.notes : ['Tidak ada catatan khusus. Tetap tulis trade-off versi Anda sendiri.'];
  $('notes').replaceChildren(...notes.map((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
  }));

  // Source + curl
  $('source').innerHTML = source.remote
    ? `Dihitung oleh <strong>FaaS /api/recommend</strong> dalam ${source.ms} ms.`
    : 'Dihitung di <strong>browser</strong>, karena /api/recommend belum tersedia (jalankan <code>npm run dev</code> atau deploy ke Vercel).';
  const query = factors.map((f) => `${f}=1`).join('&');
  $('curl-command').textContent = `curl "${location.origin}/api/recommend?${query}"`;
}

async function copyCurl() {
  const text = $('curl-command').textContent;
  const button = $('copy-curl');
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Tersalin';
  } catch {
    const range = document.createRange();
    range.selectNodeContents($('curl-command'));
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    button.textContent = 'Tekan Ctrl+C untuk menyalin';
  }
  setTimeout(() => { button.textContent = 'Salin perintah curl'; }, 1800);
}

/* ------------------------------------------------------------------
   3. FaaS live panel
   ------------------------------------------------------------------ */
async function callHello() {
  const button = $('call-hello');
  button.disabled = true;
  const started = performance.now();
  try {
    const res = await fetch(`/api/hello?t=${Date.now()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const ms = Math.round(performance.now() - started);
    $('f-region').textContent = data.region;
    $('f-cold').textContent = data.coldStart ? 'Ya' : 'Tidak';
    $('f-instance').textContent = data.instance.id;
    $('f-count').textContent = data.instance.invocations;
    $('f-latency').textContent = `${ms} ms`;
    $('hello-json').textContent = JSON.stringify(data, null, 2);
    $('hello-json').hidden = false;
  } catch {
    $('hello-json').hidden = false;
    $('hello-json').innerHTML = '<span class="error-text">/api/hello belum bisa dipanggil.</span>\nFunction hanya jalan setelah deploy ke Vercel atau lewat `npm run dev`.';
  } finally {
    button.disabled = false;
  }
}

/* ------------------------------------------------------------------
   4. Data mahasiswa (student.json)
   ------------------------------------------------------------------ */
async function loadStudent() {
  const line = $('student-line');
  try {
    const res = await fetch('student.json', { cache: 'no-store' });
    const s = await res.json();
    const isDefault = /Nama Lengkap Anda|username-github|Kode Kelas/.test(JSON.stringify(s));
    if (isDefault) {
      line.innerHTML = '<span class="student-warning">student.json masih berisi contoh.</span> Edit file itu, commit, lalu push. Vercel akan deploy ulang otomatis.';
      return;
    }
    line.textContent = `Dideploy oleh ${s.name}, kelas ${s.class}. GitHub: `;
    const link = document.createElement('a');
    link.href = `https://github.com/${encodeURIComponent(s.github)}`;
    link.textContent = `@${s.github}`;
    link.rel = 'noopener';
    line.append(link);
  } catch {
    line.textContent = 'student.json tidak terbaca. Pastikan formatnya JSON valid.';
  }
}

/* ------------------------------------------------------------------
   Init
   ------------------------------------------------------------------ */
renderSwitcher();
renderLayers();
showModel(DEFAULT_MODEL);
renderFactors();
loadCases();
loadStudent();

$('factor-form').addEventListener('change', (event) => {
  if (event.target.id === 'preset') applyPreset(event.target.value);
  else if (event.target.name === 'factor') scheduleAnalyze();
});
$('clear-factors').addEventListener('click', () => {
  document.querySelectorAll('input[name="factor"]').forEach((el) => { el.checked = false; });
  $('preset').value = '';
  $('case-context').hidden = true;
  analyze();
});
$('copy-curl').addEventListener('click', copyCurl);
$('call-hello').addEventListener('click', callHello);
window.addEventListener('resize', () => {
  const model = STACK_MODELS.find((m) => m.id === currentModel);
  if (model) placeBoundary(model);
});
document.fonts?.ready.then(() => showModel(currentModel));
