# 04. Public vs Private Repository

Visibility menentukan **siapa yang bisa melihat** repo, bukan siapa yang bisa mengubahnya. Di dua jenis repo, hanya Anda dan collaborator yang diundang yang bisa push.

## 1. Perbandingan

| Aspek | Public | Private |
|---|---|---|
| Melihat dan clone | semua orang di internet | hanya Anda dan collaborator |
| Push | hanya Anda dan collaborator | hanya Anda dan collaborator |
| Fork | siapa pun | hanya yang punya akses |
| Membuka issue | siapa pun yang login GitHub | hanya yang punya akses |
| GitHub Actions (plan Free) | gratis untuk runner standar | kuota 2.000 menit per bulan |
| GitHub Pages (plan Free) | bisa | butuh GitHub Pro (ada di Student Developer Pack) |
| Tampil di profil dan pencarian | ya | tidak |
| Deploy ke Vercel Hobby | bisa | bisa, tapi hanya commit dari pemilik akun Vercel yang di-deploy |

Baris terakhir penting untuk kerja kelompok: plan Hobby tidak mendukung kolaborasi di repo private, jadi commit teman sekelompok akan diblokir. Untuk tugas kelompok, pakai repo public atau minta tiap anggota men-deploy repo masing-masing.

## 2. Kapan memilih yang mana

**Public** cocok untuk:
- portofolio dan project yang ingin dilihat rekruter
- open source, template, materi belajar
- praktikum mata kuliah ini, kecuali dosen meminta lain

**Private** cocok untuk:
- kode klien atau kantor yang terikat kontrak
- tugas yang belum boleh dilihat teman sampai lewat deadline
- eksperimen yang belum siap dibagikan

## 3. Mitos: "Repo private berarti aman untuk menyimpan password"

Salah. Repo private tetap:
- tersalin ke laptop setiap collaborator yang pernah clone
- bisa berubah menjadi public karena salah klik di Settings
- menyimpan seluruh riwayat, jadi secret yang pernah di-commit tetap ada walau file-nya dihapus di commit berikutnya

Cara yang benar:
1. Simpan secret di file `.env` yang tercantum di `.gitignore` (repo ini sudah menyiapkannya).
2. Commit `.env.example` yang hanya berisi nama variabel tanpa nilai.
3. Di Vercel, isi nilainya lewat **Project → Settings → Environment Variables**.
4. Kalau secret terlanjur ter-push: **rotate atau revoke key-nya saat itu juga** di dashboard penyedianya. Menghapus commit tidak cukup, karena bot pemindai GitHub bisa menemukan key publik dalam hitungan menit.

GitHub punya secret scanning yang bisa memblokir push berisi token yang dikenalinya, tapi itu jaring pengaman, bukan pengganti kebiasaan baik.

## 4. Visibility repo tidak sama dengan visibility website

Repo private yang di-deploy ke Vercel tetap menghasilkan website yang **bisa dibuka siapa pun** di URL production `*.vercel.app`. Yang disembunyikan hanya kode sumbernya. Sebaliknya, repo public tidak otomatis punya website; website baru ada setelah di-deploy.

Artinya:
- Jangan menaruh data rahasia di file statis (`index.html`, `student.json`, dll) dengan harapan "repo-nya kan private".
- Kode di folder `api/` berjalan di server Vercel dan tidak dikirim ke browser, jadi di situlah tempat logika yang memakai secret.

## 5. Eksperimen

1. Buat repo baru: **+ → New repository**, nama `catatan-privat`, visibility **Private**, centang **Add a README file**.
2. Salin URL repo, lalu buka di **jendela incognito** (tidak login).
3. Catat apa yang tampil.

GitHub sengaja menampilkan **404 Not Found**, bukan "Access denied". Dengan begitu orang lain bahkan tidak bisa mengetahui bahwa repo itu ada. Ini contoh prinsip keamanan: jangan membocorkan informasi lewat pesan error.

4. Tulis jawaban pertanyaan ini di issue analisis Anda: *Mengapa website Vercel Anda tetap bisa dibuka publik walaupun repo-nya boleh private?*

## 6. Mengubah visibility

**Settings → General → Danger Zone → Change repository visibility**.

Hal yang perlu diketahui sebelum mengubah:
- **Public → private**: stars dan watchers terhapus, dan fork publik yang sudah ada tidak ikut menjadi private.
- **Private → public**: seluruh riwayat commit ikut terbuka. Periksa dulu bahwa tidak ada secret di commit mana pun.

## Cek mandiri

- [ ] Repo `catatan-privat` ada dan menampilkan 404 di jendela incognito
- [ ] Anda bisa menjelaskan beda "siapa bisa melihat" dan "siapa bisa push"
- [ ] Anda tahu harus melakukan apa kalau API key terlanjur ter-push

Lanjut ke [05. Vercel via GitHub OAuth dan deployment pertama](05-vercel-oauth-deploy.md).
