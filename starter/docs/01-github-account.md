# 01. Membuat dan Mengamankan Akun GitHub

GitHub adalah **SaaS**: aplikasinya siap pakai, server dan backup-nya diurus GitHub. Tapi akun, data, dan hak akses tetap tanggung jawab Anda. Bagian ini membahas tanggung jawab itu.

## 1. Daftar

1. Buka [github.com/signup](https://github.com/signup).
2. **Email**: pakai email pribadi yang awet. Email kampus bisa dinonaktifkan setelah lulus, padahal akun GitHub akan Anda pakai bertahun-tahun. Email kampus nanti ditambahkan sebagai email kedua.
3. **Username**: ini akan menjadi URL portofolio Anda (`github.com/<username>`).
   - Baik: `rina-wulandari`, `adit-pratama`, `dimas-kurniawan`
   - Hindari: `xX_dark_coder_Xx`, `rina12345`, NIM, atau nama yang sulit dieja
   - Huruf kecil dan tanda minus paling aman. Username bisa diganti nanti, tapi link lama akan rusak.
4. Selesaikan verifikasi, lalu pilih plan **Free**.

## 2. Verifikasi email

Buka inbox, klik link verifikasi dari GitHub. Tanpa email terverifikasi Anda tidak bisa membuat repository, membuka issue, atau meng-authorize OAuth App, termasuk login ke Vercel dengan GitHub di [docs/05](05-vercel-oauth-deploy.md).

Tambahkan juga email kampus: **Settings → Emails → Add email address**, lalu verifikasi. Email ini berguna untuk GitHub Education.

## 3. Aktifkan two-factor authentication (2FA)

GitHub mewajibkan 2FA untuk akun yang berkontribusi kode. Aktifkan sekarang, jangan tunggu diminta di tengah praktikum.

1. **Settings → Password and authentication → Enable two-factor authentication**.
2. Pilih **Authenticator app** (Google Authenticator, Microsoft Authenticator, 2FAS, atau yang sejenis), scan QR code, masukkan kode 6 digit.
3. **Unduh recovery codes** dan simpan di tempat aman di luar laptop yang sama (password manager atau cetak). Kalau HP hilang dan recovery codes juga hilang, akun bisa terkunci permanen.
4. Opsional: tambahkan **passkey** agar login lebih cepat dan tahan phishing.

> Kenapa ini penting untuk cloud? Akun GitHub Anda nanti terhubung ke Vercel. Siapa pun yang mengambil alih akun GitHub bisa mengubah kode yang ter-deploy di website Anda.

## 4. Sembunyikan email pribadi

Setiap commit menyimpan nama dan email pembuatnya, dan di repo public siapa pun bisa membacanya.

1. **Settings → Emails** → centang **Keep my email addresses private**.
2. Centang juga **Block command line pushes that expose my email**.
3. Salin alamat noreply yang muncul, formatnya `ID+username@users.noreply.github.com`.

Kalau nanti memakai Git di laptop, pakai alamat itu:

```bash
git config --global user.name "Nama Lengkap"
git config --global user.email "12345678+username@users.noreply.github.com"
git config --global init.defaultBranch main
```

Email commit harus terhubung ke akun GitHub Anda. Kalau tidak, commit tidak dihitung di contribution graph dan Vercel bisa memblokir deployment karena tidak mengenali commit author.

## 5. Opsional: GitHub Student Developer Pack

Buka [education.github.com/pack](https://education.github.com/pack) dan ajukan verifikasi status mahasiswa memakai email kampus dan bukti aktif kuliah. Paket ini berisi GitHub Pro dan berbagai kredit layanan developer. Tidak wajib untuk mata kuliah ini.

## Cek mandiri

- [ ] Email utama terverifikasi, email kampus sudah ditambahkan
- [ ] 2FA aktif dan recovery codes tersimpan di luar laptop
- [ ] Keep my email addresses private aktif
- [ ] Anda tahu alamat noreply Anda

Lanjut ke [02. Profil dan profile README](02-profile-readme.md).
