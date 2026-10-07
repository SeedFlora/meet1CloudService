/**
 * Cloud Model Engine
 * ------------------------------------------------------------------
 * Merekomendasikan kombinasi SERVICE MODEL (IaaS, PaaS, SaaS, BaaS, FaaS)
 * dan DEPLOYMENT MODEL (public, private, hybrid, multi-cloud) dari
 * sekumpulan kebutuhan (factor).
 *
 * Sengaja rule-based dan transparan: setiap bobot di bawah bisa Anda baca,
 * kritik, dan ubah. Engine ini alat bantu diskusi, BUKAN kunci jawaban.
 *
 * File ini dipakai di dua runtime sekaligus:
 *   1. Browser -> assets/app.js mengimpornya sebagai ES module
 *   2. FaaS    -> api/recommend.js (Vercel Function) mengimpornya juga
 * Karena itu file ini tidak boleh memakai API khusus Node maupun browser.
 */

/** Kebutuhan yang bisa dicentang. Urutan = urutan tampil di UI. */
export const FACTORS = [
  { id: 'regulated', label: 'Data diatur regulasi / sangat sensitif', hint: 'UU PDP, OJK, rekam medis, data layanan publik' },
  { id: 'legacy', label: 'Harus terintegrasi dengan sistem legacy on-prem', hint: 'Sistem lama tetap jalan, migrasi bertahap' },
  { id: 'osControl', label: 'Butuh kontrol OS, GPU, atau software khusus', hint: 'Driver, kernel, lisensi, konfigurasi custom' },
  { id: 'commodity', label: 'Kebutuhan umum, bukan pembeda bisnis', hint: 'Email, dokumen, chat, repo kode, payment gateway' },
  { id: 'smallTeam', label: 'Tim kecil, tanpa tim ops khusus', hint: 'Beberapa developer, tidak ada DevOps' },
  { id: 'fastLaunch', label: 'Harus rilis sangat cepat', hint: 'MVP dalam hitungan minggu' },
  { id: 'needAuthDb', label: 'Butuh login, database, dan storage standar', hint: 'CRUD, upload file, realtime' },
  { id: 'spiky', label: 'Traffic spiky, event-driven, atau sering idle', hint: 'Lonjakan saat promo, pendaftaran, webhook' },
  { id: 'steadyLoad', label: 'Beban tinggi dan stabil 24/7', hint: 'Utilisasi tinggi sepanjang waktu' },
  { id: 'lowBudget', label: 'Budget awal minim', hint: 'Tanpa CapEx, pakai free tier / pay-as-you-go' },
  { id: 'avoidLockIn', label: 'Wajib bisa pindah provider', hint: 'Hindari lock-in, resiliensi lintas provider' },
];

const FACTOR_IDS = FACTORS.map((f) => f.id);
const FACTOR_LABEL = Object.fromEntries(FACTORS.map((f) => [f.id, f.label]));

/** Lapisan tanggung jawab, dari atas (paling dekat user) ke bawah (fisik). */
export const LAYERS = [
  'Data & akses user',
  'Frontend / UI',
  'Backend logic',
  'Runtime & scaling',
  'OS & middleware',
  'Virtualisasi',
  'Hardware & jaringan',
];

/**
 * youManage = berapa lapisan teratas yang masih Anda kelola.
 * Urutan array = urutan tampil di UI (tanggung jawab Anda makin sedikit).
 */
export const STACK_MODELS = [
  {
    id: 'onprem', name: 'On-Premise', full: 'Server milik sendiri', youManage: 7,
    definition: 'Semua lapisan Anda beli, pasang, dan rawat sendiri di ruang server organisasi.',
    examples: 'Ruang server kampus, data center internal bank',
  },
  {
    id: 'IaaS', name: 'IaaS', full: 'Infrastructure as a Service', youManage: 5,
    definition: 'Provider menyewakan VM, storage, dan jaringan virtual. OS ke atas tetap urusan Anda.',
    examples: 'AWS EC2, Google Compute Engine, Azure Virtual Machines',
  },
  {
    id: 'PaaS', name: 'PaaS', full: 'Platform as a Service', youManage: 3,
    definition: 'Push kode, platform yang build, deploy, dan scale. Anda fokus ke aplikasi dan data.',
    examples: 'Vercel, Heroku, Google App Engine, Hugging Face Spaces',
  },
  {
    id: 'FaaS', name: 'FaaS', full: 'Function as a Service', youManage: 3,
    definition: 'Kode berupa fungsi yang jalan per event, scale-to-zero, bayar per eksekusi.',
    examples: 'Vercel Functions, AWS Lambda, Cloud Run functions',
  },
  {
    id: 'BaaS', name: 'BaaS', full: 'Backend as a Service', youManage: 2,
    definition: 'Auth, database, storage, dan realtime siap pakai lewat SDK/API. Anda membangun frontend dan aturan aksesnya.',
    examples: 'Supabase, Firebase, AWS Amplify',
  },
  {
    id: 'SaaS', name: 'SaaS', full: 'Software as a Service', youManage: 1,
    definition: 'Aplikasi jadi yang tinggal dipakai. Data dan hak akses user tetap tanggung jawab Anda.',
    examples: 'GitHub, Google Workspace, Microsoft 365',
  },
];

export const SERVICE_MODELS = {
  IaaS: { id: 'IaaS', name: 'IaaS', full: 'Infrastructure as a Service', examples: 'AWS EC2, Google Compute Engine, Azure VM' },
  PaaS: { id: 'PaaS', name: 'PaaS', full: 'Platform as a Service', examples: 'Vercel, Heroku, Google App Engine, HF Spaces' },
  SaaS: { id: 'SaaS', name: 'SaaS', full: 'Software as a Service', examples: 'GitHub, Google Workspace, Microsoft 365' },
  BaaS: { id: 'BaaS', name: 'BaaS', full: 'Backend as a Service', examples: 'Supabase, Firebase, AWS Amplify' },
  FaaS: { id: 'FaaS', name: 'FaaS', full: 'Function as a Service', examples: 'Vercel Functions, AWS Lambda, Cloud Run functions' },
};

export const DEPLOYMENT_MODELS = {
  public: { id: 'public', name: 'Public cloud', definition: 'Infrastruktur milik provider, dipakai bersama banyak tenant lewat internet.' },
  private: { id: 'private', name: 'Private cloud', definition: 'Infrastruktur cloud khusus satu organisasi, on-prem atau dedicated.' },
  hybrid: { id: 'hybrid', name: 'Hybrid cloud', definition: 'Private/on-prem dan public cloud yang terhubung dan dikelola bersama.' },
  multi: { id: 'multi', name: 'Multi-cloud', definition: 'Lebih dari satu public cloud provider dipakai sekaligus.' },
};

/**
 * BOBOT — bagian paling penting untuk dianalisis.
 * Positif = faktor mendukung model tsb, negatif = faktor melawan model tsb.
 * Coba ubah angkanya, jalankan `npm test`, lalu lihat efeknya di UI.
 */
export const SERVICE_WEIGHTS = {
  IaaS: { osControl: 3, legacy: 2, steadyLoad: 1, avoidLockIn: 1, regulated: 1, smallTeam: -2, fastLaunch: -1, lowBudget: -1, commodity: -3 },
  PaaS: { fastLaunch: 2, smallTeam: 2, lowBudget: 1, spiky: 1, osControl: -2, legacy: -1, commodity: -3 },
  SaaS: { commodity: 5, osControl: -2, avoidLockIn: -1 },
  BaaS: { needAuthDb: 3, fastLaunch: 2, smallTeam: 1, lowBudget: 1, avoidLockIn: -2, osControl: -1, regulated: -1, commodity: -3 },
  FaaS: { spiky: 3, lowBudget: 1, smallTeam: 1, steadyLoad: -2, osControl: -1, legacy: -1, avoidLockIn: -1, commodity: -3 },
};

export const DEPLOYMENT_WEIGHTS = {
  public: { lowBudget: 2, fastLaunch: 2, spiky: 2, smallTeam: 1, commodity: 1, regulated: -2, legacy: -1 },
  private: { regulated: 3, steadyLoad: 2, osControl: 1, legacy: 1, lowBudget: -2, smallTeam: -2, fastLaunch: -1, spiky: -1 },
  hybrid: { legacy: 3, regulated: 2, spiky: 1, smallTeam: -2, lowBudget: -1 },
  multi: { avoidLockIn: 3, smallTeam: -2, lowBudget: -1, fastLaunch: -1 },
};

/** Skor minimum agar sebuah service model ikut masuk kombinasi. */
export const INCLUDE_THRESHOLD = 3;
const MAX_COMBINATION = 4;

const TRUTHY = new Set([true, 1, '1', 'true', 'yes', 'ya', 'on']);

/**
 * Terima input dalam beberapa bentuk:
 *   - array:        ['spiky', 'smallTeam']
 *   - objek:        { spiky: true, smallTeam: '1' }
 *   - URLSearchParams (dari query string)
 * Kembalikan array factor id yang valid, urut sesuai FACTORS.
 */
export function normalizeFactors(input) {
  const picked = new Set();
  if (!input) return [];
  if (Array.isArray(input)) {
    input.forEach((id) => picked.add(String(id).trim()));
  } else if (typeof input.get === 'function' && typeof input.keys === 'function') {
    for (const key of input.keys()) {
      if (key === 'factors') {
        String(input.get(key)).split(',').forEach((id) => picked.add(id.trim()));
      } else if (TRUTHY.has(String(input.get(key)).toLowerCase())) {
        picked.add(key);
      }
    }
  } else if (typeof input === 'object') {
    const source = Array.isArray(input.factors) ? input.factors : null;
    if (source) {
      source.forEach((id) => picked.add(String(id).trim()));
    } else {
      for (const [key, value] of Object.entries(input)) {
        const v = typeof value === 'string' ? value.toLowerCase() : value;
        if (TRUTHY.has(v)) picked.add(key);
      }
    }
  }
  return FACTOR_IDS.filter((id) => picked.has(id));
}

function scoreModels(weightTable, factors) {
  return Object.entries(weightTable).map(([id, weights]) => {
    const reasons = [];
    let score = 0;
    for (const f of factors) {
      const w = weights[f] ?? 0;
      if (w !== 0) {
        score += w;
        reasons.push({ factor: f, label: FACTOR_LABEL[f], weight: w });
      }
    }
    reasons.sort((a, b) => b.weight - a.weight);
    return { id, score, reasons };
  });
}

/** Urutkan skor tertinggi dulu; kalau seri, pakai urutan definisi (stabil). */
function rank(list) {
  return list
    .map((item, index) => ({ ...item, index }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ index, ...rest }) => rest);
}

function buildNotes(factors, deploymentId, combinationIds, primaryId) {
  const has = (f) => factors.includes(f);
  const inCombo = (id) => combinationIds.includes(id);
  const notes = [];

  if (has('regulated')) {
    notes.push('Data teregulasi: pilih region atau penyedia dengan data center di Indonesia, lalu cek PP 71/2019, UU PDP No. 27/2022, dan aturan sektor (OJK, Kemenkes).');
  }
  if (has('avoidLockIn') && (inCombo('BaaS') || inCombo('FaaS') || inCombo('SaaS'))) {
    notes.push('Kombinasi ini memakai layanan proprietary. Mitigasi lock-in: standar terbuka (PostgreSQL, container, Terraform) atau layanan open-source yang bisa di-self-host.');
  }
  if (!has('avoidLockIn') && (inCombo('BaaS') || inCombo('FaaS'))) {
    notes.push('BaaS/FaaS mempercepat rilis, tapi mengikat Anda ke API provider dan biayanya bisa melonjak saat skala besar. Siapkan exit plan (mis. Supabase = PostgreSQL standar) dan pasang budget alert.');
  }
  if (has('steadyLoad') && inCombo('FaaS')) {
    notes.push('Beban stabil tinggi di FaaS bisa lebih mahal daripada VM reserved. Hitung total biaya (TCO) sebelum memutuskan.');
  }
  if ((deploymentId === 'private' || deploymentId === 'hybrid') && has('smallTeam')) {
    notes.push('Private/hybrid menuntut tim ops untuk patching, monitoring, dan DR. Tanpa tim ops, risiko operasionalnya tinggi.');
  }
  if (deploymentId === 'private' && has('lowBudget')) {
    notes.push('Private cloud butuh CapEx besar di awal, bertentangan dengan budget minim.');
  }
  if (has('legacy') && deploymentId === 'public') {
    notes.push('Ada sistem legacy tapi rekomendasinya public cloud: siapkan strategi migrasi (rehost, replatform, refactor) atau mulai dari hybrid bertahap.');
  }
  if (has('spiky') && primaryId === 'IaaS') {
    notes.push('IaaS tidak otomatis elastis: autoscaling group dan load balancer harus Anda konfigurasi sendiri.');
  }
  if (has('osControl') && primaryId !== 'IaaS') {
    notes.push('Butuh kontrol OS/GPU tapi model utamanya bukan IaaS: pastikan platform mendukung kebutuhan itu, atau jalankan container di IaaS.');
  }
  if (has('commodity') && combinationIds.some((id) => id !== 'SaaS')) {
    notes.push('Untuk fungsi umum, jangan bangun ulang. Cek dulu SaaS yang sudah ada sebelum menulis kode.');
  }
  if (deploymentId === 'private' || deploymentId === 'hybrid') {
    notes.push('Apa pun deployment model-nya, backup dan disaster recovery tetap tanggung jawab Anda.');
  }
  return notes;
}

/**
 * Fungsi utama.
 * @param {Array|Object|URLSearchParams} input kebutuhan sistem
 * @returns {Object} hasil rekomendasi, atau { ok:false, error } bila input kosong
 */
export function recommend(input) {
  const factors = normalizeFactors(input);
  if (factors.length === 0) {
    return {
      ok: false,
      error: 'Pilih minimal satu kebutuhan (factor).',
      validFactors: FACTOR_IDS,
    };
  }

  const deploymentRanking = rank(scoreModels(DEPLOYMENT_WEIGHTS, factors)).map((d) => ({
    ...d,
    name: DEPLOYMENT_MODELS[d.id].name,
  }));
  const serviceRanking = rank(scoreModels(SERVICE_WEIGHTS, factors)).map((s) => ({
    ...s,
    name: SERVICE_MODELS[s.id].name,
    full: SERVICE_MODELS[s.id].full,
    examples: SERVICE_MODELS[s.id].examples,
  }));

  const deployment = deploymentRanking[0];
  const primary = serviceRanking[0];

  // Kombinasi: model utama + model lain yang skornya >= threshold,
  // atau selisih maksimal 1 poin dari model utama (dan tetap positif).
  const combination = serviceRanking
    .filter((s, i) => i === 0 || s.score >= INCLUDE_THRESHOLD || (s.score > 0 && s.score >= primary.score - 1))
    .slice(0, MAX_COMBINATION)
    .map((s, i) => ({ ...s, role: i === 0 ? 'utama' : 'pendukung' }));

  const combinationIds = combination.map((s) => s.id);
  const notes = buildNotes(factors, deployment.id, combinationIds, primary.id);
  if (primary.score <= 0) {
    notes.unshift('Belum ada service model yang dominan. Tambahkan kebutuhan yang lebih spesifik.');
  }

  return {
    ok: true,
    factors,
    deployment: {
      id: deployment.id,
      name: deployment.name,
      definition: DEPLOYMENT_MODELS[deployment.id].definition,
      score: deployment.score,
      reasons: deployment.reasons,
      ranking: deploymentRanking.map(({ id, name, score }) => ({ id, name, score })),
    },
    services: {
      primary: primary.id,
      combination,
      ranking: serviceRanking.map(({ id, name, score }) => ({ id, name, score })),
    },
    summary: `${deployment.name} + ${combination.map((s) => s.name).join(' + ')}`,
    notes,
    disclaimer: 'Rekomendasi rule-based untuk latihan analisis, bukan jawaban final. Yang dinilai adalah justifikasi Anda.',
  };
}
