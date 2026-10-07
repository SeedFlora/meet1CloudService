# 03. Menjelajah GitHub: Repo, Commit, dan Issue

Tiga istilah yang akan Anda pakai sepanjang semester:

| Istilah | Artinya | Analogi |
|---|---|---|
| **Repository (repo)** | Folder project beserta seluruh riwayat perubahannya | Map proyek yang menyimpan semua versi |
| **Commit** | Snapshot perubahan, punya pesan, author, waktu, dan ID unik (SHA) | Titik simpan (save point) di game |
| **Issue** | Catatan tugas, bug, atau diskusi yang punya nomor `#N` | Tiket di papan tugas |

## 1. Buat repo dari template

1. Buka repo template dari dosen, klik **Use this template → Create a new repository**.
2. Owner: akun Anda. Repository name: `intro-cloud-lab`. Visibility: **Public**.
3. Klik **Create repository**.

Repo baru ini milik Anda sepenuhnya: riwayatnya mulai dari satu commit awal, dan perubahan Anda tidak memengaruhi repo template.

## 2. Anatomi halaman repo

```
+------------------------------------------------------------------+
| username / intro-cloud-lab                              [Public] |  pemilik / nama repo + visibility
| Code    Issues    Pull requests    Actions    Settings           |  tab utama
+------------------------------------------------------------------+
| [main v]  branch                          Go to file   [<> Code] |  branch aktif, tombol clone
| username  chore: isi data mahasiswa    a1b2c3d · 2 minutes ago   |  commit terakhir: author, pesan, SHA
| api/            feat: tambah /api/hello            last week     |
| assets/         ...                                              |
| student.json    chore: isi data mahasiswa          2 min ago     |  tiap file: commit terakhir yang mengubahnya
+------------------------------------------------------------------+
| README.md  (dirender otomatis di bawah file list)                |
+------------------------------------------------------------------+
```

Yang perlu Anda kenali:
- **Badge Public/Private** di sebelah nama repo.
- **Tab Settings** hanya muncul untuk pemilik dan admin.
- **Angka commits** (mis. "12 Commits") di kanan atas file list membuka riwayat commit.
- **Tombol `<> Code`** berisi URL untuk `git clone` dan opsi Download ZIP.

## 3. Buat issue #1

1. Tab **Issues → New issue** → pilih **Tugas: isi student.json**.
2. Biarkan judul bawaan, klik **Create**. Perhatikan nomornya, seharusnya `#1`.

Issue adalah cara tim mencatat *apa* yang perlu dikerjakan. Commit adalah catatan *apa* yang sudah dikerjakan. Keduanya bisa dihubungkan.

## 4. Commit lewat web editor

1. Tab **Code** → klik `student.json` → ikon pensil (**Edit this file**).
2. Ganti isinya:

   ```json
   {
     "name": "Rina Wulandari",
     "class": "LA01",
     "github": "rina-wulandari"
   }
   ```

   Jangan tambahkan NIM. File ini tampil di website publik, dan test otomatis akan gagal kalau ada field `nim`.
3. Klik **Commit changes…**. Isi commit message:

   ```
   chore: isi data mahasiswa (closes #1)
   ```

4. Pilih **Commit directly to the main branch** → **Commit changes**.

Lalu amati:
- **Issue #1 tertutup otomatis.** Kata kunci `closes`, `fixes`, atau `resolves` diikuti `#N` menutup issue saat commit masuk ke default branch.
- **Tab Actions** menjalankan workflow CI (`npm test`). Centang hijau berarti `student.json` valid.
- **Vercel** membuat deployment baru dalam hitungan detik, kalau project sudah terhubung ([docs/05](05-vercel-oauth-deploy.md)). Kalau belum, lanjutkan saja dan cek lagi setelah deploy.

## 5. Membaca riwayat commit

1. Klik angka **Commits** di atas file list.
2. Setiap baris menampilkan pesan, author, waktu, dan **short SHA** (7 karakter pertama, mis. `a1b2c3d`).
3. Klik SHA untuk melihat **diff**: baris merah dihapus, baris hijau ditambahkan.
4. Di halaman file, tombol **History** menampilkan commit yang menyentuh file itu saja, dan **Blame** menunjukkan siapa terakhir mengubah tiap baris.

SHA adalah hash dari isi snapshot. Isi berbeda pasti menghasilkan SHA berbeda, sehingga riwayat Git sulit dipalsukan diam-diam.

## 6. Pesan commit yang baik

Pakai format singkat `tipe: ringkasan`, huruf kecil, kalimat perintah:

| Tipe | Kapan | Contoh |
|---|---|---|
| `feat` | fitur baru | `feat: tampilkan region di halaman utama` |
| `fix` | perbaikan bug | `fix: tombol salin curl tidak berfungsi di Safari` |
| `docs` | dokumentasi | `docs: tambah cara menjalankan lokal` |
| `chore` | pekerjaan rutin, konfigurasi, data | `chore: isi data mahasiswa (closes #1)` |
| `test` | menambah atau memperbaiki test | `test: cek field github tidak kosong` |

Hindari `update`, `fix bug`, `asdf`, atau `final revisi 2`. Pesan commit adalah dokumentasi untuk diri Anda enam bulan lagi.

## 7. Opsional: alur yang sama lewat terminal

```bash
git clone https://github.com/<username>/intro-cloud-lab.git
cd intro-cloud-lab
# edit student.json dengan editor favorit
git status                      # file apa yang berubah?
git diff                        # apa perubahannya?
git add student.json            # masukkan ke staging area
git commit -m "chore: isi data mahasiswa (closes #1)"
git push                        # kirim ke GitHub
git log --oneline -5            # 5 commit terakhir
```

Sebelum commit pertama di laptop, atur identitas dengan alamat noreply ([docs/01](01-github-account.md) bagian 4). Saat `git push` pertama kali, Git akan meminta login lewat browser (Git Credential Manager) atau personal access token. Password akun GitHub tidak bisa dipakai untuk `git push`.

## Cek mandiri

- [ ] Repo `intro-cloud-lab` milik Anda sudah ada
- [ ] Issue #1 tertutup oleh commit, bukan ditutup manual
- [ ] Anda bisa menunjukkan diff commit tersebut
- [ ] Workflow CI di tab Actions hijau

Lanjut ke [04. Public vs private repository](04-public-vs-private.md).
