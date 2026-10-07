# Cheat Sheet Pertemuan 1

## Service model dalam satu kalimat

| Model | Anda menyerahkan… | Anda masih mengurus… | Contoh |
|---|---|---|---|
| **IaaS** | hardware, jaringan fisik, virtualisasi | OS, runtime, aplikasi, data | AWS EC2, Google Compute Engine, Azure VM |
| **PaaS** | + OS, runtime, scaling | kode aplikasi dan data | Vercel, Heroku, Google App Engine, HF Spaces |
| **FaaS** | + server sepenuhnya, bayar per eksekusi | isi fungsi dan data | Vercel Functions, AWS Lambda, Cloud Run functions |
| **BaaS** | + backend umum (auth, database, storage) | frontend dan aturan akses data | Supabase, Firebase, AWS Amplify |
| **SaaS** | + seluruh aplikasi | data, akun, dan hak akses user | GitHub, Google Workspace, Microsoft 365 |

## Deployment model

| Model | Inti | Pertanyaan pemicu |
|---|---|---|
| **Public** | infrastruktur milik provider, multi-tenant | Butuh cepat, murah di awal, elastis? |
| **Private** | khusus satu organisasi | Regulasi ketat, beban stabil, kontrol penuh? |
| **Hybrid** | private/on-prem + public, terhubung | Ada sistem legacy atau data yang harus tetap di dalam? |
| **Multi-cloud** | lebih dari satu public provider | Harus bebas lock-in atau tahan gangguan satu provider? |

Keluaran analisis selalu **kombinasi + justifikasi + trade-off**, dan boleh berbeda per komponen sistem.

## Git

```bash
git config --global user.name "Nama Lengkap"
git config --global user.email "ID+username@users.noreply.github.com"
git config --global init.defaultBranch main

git clone <url>             # salin repo ke laptop
git status                  # apa yang berubah?
git diff                    # detail perubahan
git add <file>              # masukkan ke staging
git commit -m "tipe: pesan" # buat snapshot
git push                    # kirim ke GitHub
git pull                    # ambil perubahan terbaru
git log --oneline -10       # riwayat singkat
```

Kata kunci penutup issue di pesan commit: `closes #N`, `fixes #N`, `resolves #N`.

## Lokasi penting di GitHub

| Kebutuhan | Menu |
|---|---|
| 2FA | Settings → Password and authentication |
| Sembunyikan email | Settings → Emails → Keep my email addresses private |
| Profil | Settings → Public profile |
| Cabut izin aplikasi | Settings → Applications |
| Ganti visibility repo | repo → Settings → General → Danger Zone |
| Jadikan repo template | repo → Settings → General → Template repository |
| Hasil CI | repo → tab Actions |

## Lokasi penting di Vercel

| Kebutuhan | Menu |
|---|---|
| Project baru | Add New… → Project → Import |
| Akses repo | Import → Adjust GitHub App Permissions |
| Environment variable | Project → Settings → Environment Variables (lalu Redeploy) |
| Region function | Project → Settings → Functions → Function Region |
| Riwayat deploy | Project → Deployments |
| Log function | Project → Logs |

## Endpoint repo ini

```bash
curl https://<project>.vercel.app/api/hello
curl https://<project>.vercel.app/api/recommend
curl "https://<project>.vercel.app/api/recommend?regulated=1&legacy=1"
curl -X POST https://<project>.vercel.app/api/recommend \
  -H "Content-Type: application/json" -d '{"factors":["spiky","smallTeam"]}'
```

## Keamanan minimum

- 2FA aktif, recovery codes disimpan di luar laptop
- Email pribadi disembunyikan, commit memakai alamat noreply
- Secret di `.env` (di-ignore) dan di Environment Variables Vercel, bukan di repo
- Key yang bocor: rotate dulu, bersihkan belakangan
- Berikan akses aplikasi pihak ketiga sesempit mungkin (Only select repositories)
