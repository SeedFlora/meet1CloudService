# Panduan Git Lab 01 (repo mandiri)

**Kebijakan kelas:** Lab ini latihan formatif, tanpa tugas, nilai, atau penyerahan terpisah. Satu proyek besar dikerjakan oleh kelompok **3 orang**, dengan presentasi checkpoint minggu 7 (UTS) dan hasil akhir minggu 14 (UAS). Simpan hasil lab hanya bila berguna sebagai referensi atau bukti proses proyek. Baca [brief proyek kelompok](PROYEK_KELOMPOK.md). Bobot resmi tetap mengikuti RPS/LMS.

Repo materi kelas: https://github.com/SeedFlora/meet1CloudService. Di GitHub pilih **Use this template ? Create a new repository**; pilih akun Anda sebagai owner. Clone repo pribadi tersebut, lalu buka terminal pada **root repo**, tempat `README.md` dan `MODUL_MAHASISWA.md` berada. GitHub Codespaces dapat dibuka dari **Code ? Codespaces** bila lingkungan lab mendukung.

Sebelum commit, jalankan:

```bash
git status --short
git diff --check
git add .
git diff --cached --name-only
git diff --cached --check
git diff --cached
```

Periksa bahwa daftar staged tidak memuat `.env`, password, token, private key, atau gambar berisi kredensial. Bila aman:

```bash
git commit -m "lab01: hasil praktik dan laporan"
git push
```

Jika Anda membuat repo GitHub kosong tanpa template, dari root folder lab jalankan `git init`, `git branch -M main`, `git remote add origin https://github.com/USERNAME/NAMA_REPO.git`, lalu perintah add/commit di atas dan `git push -u origin main`. Jangan menambahkan remote kedua jika `git remote -v` sudah menunjukkan repo pribadi Anda. Jika tidak ada perubahan, Git akan menulis `nothing to commit`; tidak perlu membuat commit kosong.

Gunakan `hasil/TEMPLATE_LAPORAN.md` untuk laporan. Bukti pribadi disimpan di `hasil/bukti/`. Gambar `screenshots/` adalah referensi materi, bukan bukti tugas Anda.
