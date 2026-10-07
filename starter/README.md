# githubPagesVercel

Repo praktikum **Pertemuan 1: Introduction to Cloud Computing**
Mata kuliah Cloud Services (COMP6991031), Departemen Informatika, BINUS @Bandung.

Repo ini kecil tapi sengaja memakai beberapa service model sekaligus. Kode sumbernya disimpan di **GitHub (SaaS)**, halaman statisnya disajikan **Vercel (PaaS)**, dan folder `api/` berjalan sebagai **Vercel Functions (FaaS)**. Jadi sambil mengerjakan praktikum, Anda sedang memakai hal yang dianalisis di kelas.

## Learning Outcome

> **(C4) Analysis:** Students are able to analyze the five cloud service models (IaaS, PaaS, SaaS, BaaS, FaaS) and the four deployment models (public, private, hybrid, multi-cloud), and to select an appropriate combination.

Sub topic praktikum: GitHub account setup & profile configuration, Vercel signup via GitHub OAuth integration, GitHub interface exploration (repos, commits, issues), dan public vs private repository concepts.

## Isi repo

```
intro-cloud-lab/
├── index.html               Cloud Model Lab (UI)
├── assets/                  style.css + app.js
├── lib/engine.js            engine rekomendasi, dipakai browser DAN function
├── api/
│   ├── hello.js             GET  /api/hello      (contoh FaaS: region, cold start)
│   └── recommend.js         GET/POST /api/recommend (engine sebagai FaaS)
├── data/cases.json          studi kasus W1, W2 (contoh) dan A–D (latihan)
├── student.json             data Anda: EDIT FILE INI
├── tests/                   node --test (dijalankan juga oleh GitHub Actions)
├── scripts/dev-server.mjs   dev server lokal tanpa dependency
├── docs/                    panduan langkah demi langkah praktikum
├── exercises/               studi kasus, worksheet, rubrik
├── profile-readme-template/ contoh README profil GitHub
├── .nojekyll                GitHub Pages menyajikan file apa adanya (tanpa Jekyll)
└── .github/                 issue forms + workflow CI
```

Tidak ada `vercel.json` dan tidak ada build step. Vercel mengenali folder `api/` secara otomatis (zero config). Itulah inti PaaS/FaaS: Anda cukup menaruh kode di tempat yang disepakati, platform yang mengurus sisanya.

## Repo ini memakai service model apa?

| Bagian | Service model | Yang Anda kelola | Yang dikelola provider |
|---|---|---|---|
| Repo, Issues, Actions di GitHub | SaaS | isi repo, visibility, collaborator, 2FA | aplikasi GitHub, server, backup |
| `index.html`, `assets/` di Vercel | PaaS | kode frontend | build, CDN global, HTTPS, scaling |
| `api/*.js` di Vercel | FaaS | isi fungsi | runtime Node.js, instance, scale-to-zero |
| Supabase (mulai Pertemuan 7) | BaaS | skema data, aturan akses (RLS) | Postgres, Auth, Storage |
| VM Linux (konsep di Pertemuan 2) | IaaS | OS ke atas | hardware, virtualisasi, jaringan fisik |

Deployment model-nya: **public cloud**. Semua layanan di atas milik provider dan dipakai bersama banyak tenant.

## Quick start

### A. Tanpa install apa pun (jalur utama Praktikum 1)

1. Buka template: `https://github.com/SeedFlora/webWeek1` lalu klik **Use this template → Create a new repository**. Nama repo: `intro-cloud-lab`, visibility: **Public**.
2. Di repo baru Anda, buka `student.json`, klik ikon pensil, isi nama, kode kelas, dan username GitHub, lalu **Commit changes**.
3. Buka [vercel.com/signup](https://vercel.com/signup), klik **Continue with GitHub**, lalu pilih **Hobby** bila ditanya.
4. Di dashboard Vercel: **Add New… → Project → Import** repo `intro-cloud-lab` → Framework Preset **Other** → **Deploy**.
5. Buka URL `https://<nama-project>.vercel.app`, klik **Panggil /api/hello**.

Panduan lengkap tiap langkah ada di folder [`docs/`](docs).

### B. Jalankan di laptop (opsional, butuh Node.js 20+ dan Git)

```bash
git clone https://github.com/<username-anda>/intro-cloud-lab.git
cd intro-cloud-lab
npm run dev      # http://localhost:3000, meniru static + /api seperti di Vercel
npm test         # 18 test: engine, API, dan validasi student.json
```

Tidak perlu `npm install` karena repo ini tanpa dependency. Kalau ingin mencoba `LAB_OWNER`, salin `.env.example` menjadi `.env` lalu isi nilainya.

### C. Versi statis di GitHub Pages (opsional, gratis untuk repo Public)

1. Di repo Anda: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
2. Branch `main`, folder **/(root)** (bukan `/docs`, folder itu berisi panduan) → **Save**.
3. Tunggu hingga 10 menit (lihat run **pages build and deployment** di tab Actions), lalu buka `https://<username>.github.io/intro-cloud-lab/`.

GitHub Pages hanya menyajikan file statis. Analyzer tetap jalan karena dihitung di browser, tetapi `/api/hello` dan `/api/recommend` hanya hidup di Vercel. Supaya halaman tetap benar di subfolder `/<nama-repo>/`, `index.html` dan `assets/app.js` memakai path relatif (`assets/…`, bukan `/assets/…`) dan repo berisi file `.nojekyll`. Jangan ubah kembali ke path absolut.

## Checklist Praktikum 1

**GitHub account & profil** ([docs/01](docs/01-github-account.md), [docs/02](docs/02-profile-readme.md))
- [ ] Akun GitHub dengan username profesional, email sudah terverifikasi
- [ ] 2FA aktif, recovery codes disimpan di tempat aman
- [ ] "Keep my email addresses private" aktif, `git config user.email` memakai alamat noreply
- [ ] Profil terisi (nama, foto, bio) dan profile README dari [`profile-readme-template`](profile-readme-template/README.md)

**Repo, commit, issue** ([docs/03](docs/03-repo-commit-issue.md))
- [ ] Repo `intro-cloud-lab` dibuat dari template (Public)
- [ ] Issue **Tugas: isi student.json** dibuat (menjadi issue #1)
- [ ] `student.json` diedit dan di-commit dengan pesan `chore: isi data mahasiswa (closes #1)`, issue #1 tertutup otomatis
- [ ] Tab **Actions** menampilkan centang hijau
- [ ] Issue **Analisis studi kasus** diisi untuk kasus yang dibagikan dosen (kerja kelompok, tiap anggota submit di repo masing-masing)

**Public vs private** ([docs/04](docs/04-public-vs-private.md))
- [ ] Buat repo private `catatan-privat`, buka URL-nya di jendela incognito dan catat hasilnya
- [ ] Jawab di issue analisis: mengapa website Vercel Anda tetap bisa dibuka publik walau repo-nya boleh private?

**Vercel via GitHub OAuth** ([docs/05](docs/05-vercel-oauth-deploy.md))
- [ ] Akun Vercel (Hobby) dibuat lewat Continue with GitHub
- [ ] Vercel GitHub App hanya diberi akses ke repo yang dipilih (Only select repositories)
- [ ] Project ter-deploy, `/api/hello` dan `/api/recommend` bisa dipanggil dari browser dan `curl`
- [ ] Bonus: environment variable `LAB_OWNER` di Vercel, redeploy, lalu cek pesan `/api/hello` berubah

## Yang dikumpulkan

Kirim empat URL ini ke kanal pengumpulan yang ditentukan dosen:

1. Profil GitHub: `https://github.com/<username>`
2. Repo: `https://github.com/<username>/intro-cloud-lab`
3. Website: `https://<nama-project>.vercel.app`
4. Issue analisis: `https://github.com/<username>/intro-cloud-lab/issues/<nomor>`

Rubrik lengkap: [`exercises/rubric.md`](exercises/rubric.md).

## API reference

| Endpoint | Contoh | Keterangan |
|---|---|---|
| `GET /api/hello` | `curl https://<project>.vercel.app/api/hello` | region, cold start, instance id, jumlah invocation |
| `GET /api/recommend` | `curl https://<project>.vercel.app/api/recommend` | tanpa parameter: daftar factor yang valid |
| `GET /api/recommend?…` | `curl "https://<project>.vercel.app/api/recommend?spiky=1&smallTeam=1"` | rekomendasi dari query string, juga bisa `?factors=spiky,smallTeam` |
| `POST /api/recommend` | lihat di bawah | rekomendasi dari body JSON |

```bash
curl -X POST https://<project>.vercel.app/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"factors": ["regulated", "legacy", "spiky"]}'
```

Di Windows PowerShell, pakai `curl.exe` (bukan alias `curl`) dan escape tanda kutip, atau gunakan `Invoke-RestMethod`.

Factor yang valid: `regulated`, `legacy`, `osControl`, `commodity`, `smallTeam`, `fastLaunch`, `needAuthDb`, `spiky`, `steadyLoad`, `lowBudget`, `avoidLockIn`.

## Tentang engine rekomendasi

`lib/engine.js` rule-based dan transparan: tiap factor punya bobot positif atau negatif untuk tiap model. Engine ini **alat bantu diskusi, bukan kunci jawaban**. Yang dinilai adalah analisis Anda: apakah Anda bisa menjelaskan kapan engine benar, kapan keliru, dan bobot mana yang seharusnya diubah. Silakan ubah bobotnya, jalankan `npm test`, lalu lihat efeknya di UI.

## Catatan dosen

- Repo template saat ini: `SeedFlora/webWeek1` (public). Aktifkan **Settings → General → centang Template repository** agar tombol **Use this template** muncul. Kalau nama repo atau akunnya berubah, sesuaikan URL template di bagian Quick start.
- Issue forms di `.github/ISSUE_TEMPLATE` ikut tersalin ke repo mahasiswa yang dibuat dari template.
- Next.js baru dipakai di Pertemuan 8. Handler di `api/` sengaja memakai signature `export function GET(request)` agar transisinya ke Route Handlers Next.js mulus.

## Lisensi

MIT. Lihat [LICENSE](LICENSE).
