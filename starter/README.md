# Starter Lab 01: model cloud dan API pertama

Folder ini berisi aplikasi lokal untuk COMP6991031. Mulai dari [modul mahasiswa](../MODUL_MAHASISWA.md) untuk penjelasan dan screenshot tiap langkah. Node.js 20+ sudah cukup. Aplikasi tidak memiliki dependency eksternal sehingga tidak perlu `npm install`, Docker, akun Vercel, atau file `.env` untuk praktik lokal.

## 1. Buka folder yang benar

Template aktif: [SeedFlora/meet1CloudService](https://github.com/SeedFlora/meet1CloudService). Setelah clone, root repo berisi `README.md` dan folder `starter/`. Buka root repo di VS Code, lalu terminal PowerShell:

```powershell
Set-Location .\starter
Get-ChildItem package.json, student.json, index.html
node --version
npm test
```

Hasil: tiga file ditemukan dan tes mencetak `pass 18`, `fail 0`. Tes hijau memeriksa format dan perilaku aplikasi. Tes tidak membuktikan identitas contoh telah diganti. Edit `starter/student.json` melalui Explorer VS Code dengan nama publik, kelas, dan username GitHub. Jangan isi NIM atau data pribadi.

## 2. Jalankan aplikasi

Masih di `starter/` pada terminal pertama:

```powershell
npm run dev
```

Buka <http://localhost:3000>. Ganti pilihan IaaS, PaaS, SaaS, BaaS, dan FaaS lalu bandingkan tanggung jawab pengguna dan penyedia. Biarkan terminal pertama berjalan. `Ctrl+C` menghentikan server.

## 3. Uji API pada terminal kedua

Di VS Code pilih **Terminal → New Terminal**. Terminal baru dimulai di root repo. Request HTTP berikut tidak bergantung pada folder aktif:

```powershell
curl.exe -i http://localhost:3000/api/hello
curl.exe -i "http://localhost:3000/api/recommend?spiky=1&smallTeam=1"
curl.exe -i "http://localhost:3000/api/recommend?factors=ngawur"
```

Hasil berurutan: HTTP 200, 200, lalu 400. Request terakhir sengaja menguji validasi input. Untuk mengulang tes tanpa menutup server, di terminal kedua jalankan `Set-Location .\starter`, lalu `npm test`.

## 4. Diskusi sesuai subtopik

- [Pembuatan akun GitHub](docs/01-github-account.md) dan [profil GitHub](docs/02-profile-readme.md).
- [Repo, commit, dan issue](docs/03-repo-commit-issue.md), termasuk file `starter/student.json` dan workflow di root repo.
- [Public dan private repository](docs/04-public-vs-private.md).
- [Vercel melalui GitHub OAuth](docs/05-vercel-oauth-deploy.md). Untuk demonstrasi cloud, impor repo pribadi dan pilih **Root Directory `starter`**, Framework **Other**, tanpa build command. Jalur ini membutuhkan akun cloud dan bersifat tambahan setelah aplikasi lokal berhasil.

GitHub Pages menyajikan file statis dan tidak menjalankan folder `api/`. Gunakan server lokal di atas untuk mencoba halaman beserta API.

## Isi aplikasi

`index.html` dan `assets/` adalah frontend. `lib/engine.js` menghitung rekomendasi model cloud. `api/` berisi handler HTTP. `tests/` menguji engine, API, dan format identitas. `scripts/dev-server.mjs` menyajikan semuanya di laptop. [Studi kasus](exercises/case-studies.md) dan [worksheet](exercises/worksheet.md) membantu membandingkan keputusan per komponen. Engine adalah alat diskusi dan rekomendasinya perlu diperiksa dengan kebutuhan kasus.

Semua catatan, screenshot pribadi, commit, dan push lab bersifat opsional sebagai referensi proyek kelompok. Praktik lokal selesai saat halaman terbuka, pilihan model berubah, dan tiga request API memberi hasil yang dijelaskan.
