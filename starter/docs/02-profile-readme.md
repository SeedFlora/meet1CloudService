# 02. Profil GitHub dan Profile README

Profil GitHub dibaca oleh rekruter, dosen pembimbing, dan calon kolaborator. Buat informatif, tapi jangan membocorkan data pribadi.

## 1. Isi profil publik

Buka **Settings → Public profile**:

| Field | Saran |
|---|---|
| Name | Nama lengkap yang biasa Anda pakai secara profesional |
| Profile picture | Foto wajah yang jelas atau avatar yang rapi |
| Bio | Satu kalimat, mis. `Mahasiswa Informatika BINUS @Bandung, tertarik cloud dan web.` |
| URL / Social accounts | LinkedIn atau portofolio, kalau ada |
| Location | Cukup kota, mis. `Bandung, Indonesia` (opsional) |

**Jangan tampilkan**: NIM, nomor HP, alamat rumah, tanggal lahir, atau email pribadi. Data seperti ini termasuk data pribadi (UU PDP No. 27/2022) dan mudah disalahgunakan untuk phishing atau social engineering.

## 2. Buat profile README

GitHub menampilkan README khusus di halaman profil kalau Anda punya repo **public** yang namanya **sama persis dengan username**.

1. Klik **+ → New repository**.
2. Repository name: ketik username Anda persis (mis. `rina-wulandari`). GitHub akan menampilkan pesan bahwa repo ini spesial.
3. Visibility: **Public**. Centang **Add a README file**. Klik **Create repository**.
4. Edit `README.md` (ikon pensil), salin isi [`profile-readme-template/README.md`](../profile-readme-template/README.md), sesuaikan, lalu **Commit changes**.
5. Buka `github.com/<username>`, README muncul di atas daftar repo.

Tips isi README profil:
- Tiga sampai lima baris sudah cukup. Siapa Anda, apa yang sedang dipelajari, cara menghubungi.
- Tulis fakta, bukan klaim kosong. "Sedang belajar Docker dan Supabase di mata kuliah Cloud Services" lebih kuat daripada "Full-stack expert".
- Hindari widget pihak ketiga yang berat atau berisi data pribadi.

## 3. Pin repo terbaik

Di halaman profil, klik **Customize your pins** dan pilih hingga 6 repo. Setelah Praktikum 1, pin `intro-cloud-lab`. Isi juga bagian **About** di repo itu (ikon gerigi di kanan atas file list): deskripsi singkat dan URL website Vercel Anda.

## 4. Contribution graph

Kotak hijau di profil hanya menghitung commit yang email-nya terhubung ke akun Anda (lihat [docs/01](01-github-account.md) bagian 4). Kalau commit Anda tidak muncul, cek `git config user.email`.

## Cek mandiri

- [ ] Nama, foto, dan bio terisi. Tidak ada NIM, nomor HP, atau alamat.
- [ ] Repo `<username>/<username>` public dengan README
- [ ] Profile README tampil di `github.com/<username>`

Lanjut ke [03. Repo, commit, dan issue](03-repo-commit-issue.md).
