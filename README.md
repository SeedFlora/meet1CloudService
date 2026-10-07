# Lab 01 — Introduction to Cloud Computing dan GitHub

<!-- lecture-materials:start -->

## Materi teori sebelum praktikum

- [Pertemuan 01: Pengantar Cloud Computing](slides/Teori_Pertemuan_01.pptx)

Slide menghubungkan konsep, kasus kerja, bacaan/video resmi, dan langkah lab.

[Peta materi dan tautan seluruh 13 pertemuan](MATERI_KULIAH.md).

<!-- lecture-materials:end -->

**Kebijakan kelas:** Lab ini latihan formatif, tanpa tugas, nilai, atau penyerahan terpisah. Satu proyek besar dikerjakan oleh kelompok **3 orang**, dengan presentasi checkpoint minggu 7 (UTS) dan hasil akhir minggu 14 (UAS). Simpan hasil lab hanya bila berguna sebagai referensi atau bukti proses proyek. Baca [brief proyek kelompok](PROYEK_KELOMPOK.md). Bobot resmi tetap mengikuti RPS/LMS.

Repo template mandiri: [SeedFlora/meet1CloudService](https://github.com/SeedFlora/meet1CloudService). Mulai dari [modul mahasiswa dengan kunci](MODUL_MAHASISWA.md) dan [panduan Git](PANDUAN_GIT.md). Versi cetak: [PDF mahasiswa](MODUL_MAHASISWA.pdf). Slide kelas ada di `slides/`.

**RPS COMP6991031, sesi 1 (LO 1, F2F).** Lab ini memakai proyek kecil yang sama untuk membahas service model, deployment model, batas tanggung jawab, GitHub, dan Vercel.

## Materi yang disediakan

Folder [starter](starter/) berisi aplikasi, `docs/`, `exercises/`, tes, dan contoh workflow. Panduan detail ada di [starter/README.md](starter/README.md), termasuk [worksheet studi kasus](starter/exercises/worksheet.md), [panduan umpan balik formatif](starter/exercises/rubric.md), dan [panduan GitHub–Vercel](starter/docs/05-vercel-oauth-deploy.md). [Modul mahasiswa](MODUL_MAHASISWA.md) menyertakan kunci latihan dan contoh keputusan untuk seluruh kasus A–D.

## Tujuan dan teori singkat

Mahasiswa dapat:

1. Menjelaskan lima karakteristik esensial cloud menurut NIST: on-demand self-service, broad network access, resource pooling, rapid elasticity, dan measured service.
2. Membedakan IaaS, PaaS, SaaS, BaaS, FaaS berdasarkan bagian yang dikelola pengguna dan penyedia.
3. Memilih public, private, hybrid, atau multi-cloud berdasarkan kebutuhan teknis, biaya, dan kepatuhan.
4. Membuat profil GitHub, repo, commit, issue, serta menghubungkan repo ke Vercel melalui GitHub OAuth.

| Komponen proyek | Model | Bukti yang bisa diamati |
|---|---|---|
| GitHub repository, issue, Actions | SaaS | Dapat dipakai tanpa mengelola server Git |
| Halaman statis di Vercel | PaaS | Kode halaman dipush; hosting dan HTTPS dikelola platform |
| `api/hello.js` dan `api/recommend.js` | FaaS | Fungsi dijalankan saat dipanggil |
| Supabase (diperkenalkan sesi 7) | BaaS | Database, Auth, Storage dikelola platform |
| VM Linux (dibahas sesi 2–4) | IaaS | Pengguna mengelola OS dan aplikasi |

Contoh deployment proyek ini adalah **public cloud**. Multi-cloud berarti memakai lebih dari satu penyedia cloud; itu tidak sama dengan memakai beberapa produk dari satu penyedia.

Dalam diskusi teori, bandingkan contoh layanan AWS, Azure, dan GCP pada model yang sama. Bandingkan pula **pay-as-you-go** (bayar sesuai pemakaian), **reserved** (komitmen kapasitas/waktu), dan **spot** (kapasitas sisa yang dapat dihentikan penyedia). Pilihan harga harus dihubungkan dengan pola beban dan risiko interupsi; jangan menyamakan harga murah dengan biaya total terendah.

## Prasyarat dan jalur kerja

Jalur browser/cloud memerlukan akun GitHub dengan email terverifikasi dan akun Vercel yang dihubungkan ke GitHub. Jalur lokal memerlukan Node.js 20+; Git diperlukan hanya jika akan membuat riwayat dan push.

**Jalur lokal:** dari root repo Lab 01, masuk ke `starter/`, lalu:

~~~bash
cd starter
node --version
npm run dev
~~~

Buka `http://localhost:3000`. Pada terminal kedua di folder yang sama:

~~~bash
npm test
curl http://localhost:3000/api/hello
curl "http://localhost:3000/api/recommend?spiky=1&smallTeam=1"
~~~

Di PowerShell gunakan `curl.exe`. Proyek tidak memerlukan `npm install` karena tidak memiliki dependency eksternal. `npm test` menjalankan **18 tes**; status awal dapat hijau meski `student.json` masih berisi teks contoh, sehingga isi data tetap harus diperiksa manual.

Setelah demo, hentikan `npm run dev` dengan `Ctrl+C` sebelum Lab 03, karena lab jaringan juga memakai port 3000.

**Jalur GitHub dan Vercel:** gunakan [repo template Lab 01](https://github.com/SeedFlora/meet1CloudService), pilih **Use this template**, lalu clone repo pribadi. Ikuti [panduan Git repo mandiri](PANDUAN_GIT.md), [panduan akun](starter/docs/01-github-account.md), [profil](starter/docs/02-profile-readme.md), [repo/commit/issue](starter/docs/03-repo-commit-issue.md), [public vs private](starter/docs/04-public-vs-private.md), dan [Vercel](starter/docs/05-vercel-oauth-deploy.md). Saat impor ke Vercel, atur **Root Directory** ke `starter`. Jangan menaruh token, kata sandi, atau NIM pada repo publik.

## Langkah kelas dan hasil yang diharapkan

1. Isi `student.json` dengan nama, kelas, dan username GitHub. Jalankan `npm test`. **Hasil:** 18 tes lulus dan halaman menampilkan data Anda.
2. Buka aplikasi. Bandingkan output Cloud Model Lab untuk dua preset dan satu kasus baru. **Hasil:** rekomendasi model serta alasan; engine adalah bahan diskusi, bukan kunci jawaban.
3. Panggil `/api/hello` dan `/api/recommend`. **Hasil:** JSON HTTP 200. Coba input tidak valid dan catat respons 400.
4. Di GitHub, buat issue latihan, commit perubahan, dan amati tab Actions. **Hasil:** issue, commit, dan workflow root `.github/workflows/verify.yml` terlihat. Jalankan `npm test` lokal sebelum push.
5. Buat satu repo private percobaan, lihat URL-nya dari jendela incognito, lalu bandingkan dengan website Vercel yang dapat dibuka publik.
6. Hubungkan repo ke Vercel dan buka URL produksi. **Hasil:** halaman, `/api/hello`, dan `/api/recommend` dapat diakses melalui HTTPS.

Latihan analisis ada di [case studies](starter/exercises/case-studies.md). Isi [worksheet](starter/exercises/worksheet.md) untuk satu kasus: pilih model per komponen, jelaskan sedikitnya tiga faktor keputusan, batas shared responsibility, trade-off, dan satu alternatif.

Tambahkan satu tabel kecil pada worksheet: padankan satu layanan AWS, Azure, dan GCP untuk kebutuhan komputasi kasus Anda; pilih salah satu model harga di atas dan jelaskan apakah beban kerja boleh terinterupsi.

## Bukti latihan yang boleh disimpan untuk proyek

- Tautan profil GitHub, repo, website Vercel, dan issue analisis (jika jalur cloud dikerjakan).
- Tangkapan layar `npm test` atau tab Actions, output dua endpoint, dan perbandingan public/private.
- Worksheet keputusan arsitektur. Untuk jalur lokal saja, simpan file worksheet dan tangkapan layar aplikasi lokal bila bermanfaat untuk proyek; beri keterangan bahwa deploy belum dilakukan.

## Troubleshooting

| Gejala | Langkah cek |
|---|---|
| Port 3000 terpakai | Hentikan proses lain di port itu atau ubah port pada `scripts/dev-server.mjs` untuk latihan lokal. |
| `npm` tidak ditemukan | Pasang Node.js 20+ atau gunakan jalur browser/cloud. |
| `student.json` tidak terbaca | Periksa tanda kutip dan koma JSON, lalu jalankan `npm test`. |
| Endpoint lokal 404 | Jalankan `npm run dev` dari folder `starter/`, bukan dari root repo. |
| Repo tidak terlihat di Vercel | Periksa izin GitHub App untuk repo yang dipilih dan status hubungan akun. |
| Halaman deploy lama | Lihat status deployment terbaru dan commit yang terhubung. |

## Rujukan

- `COMP6991031- Cloud Services - R0.0-BDS1.pdf`, Lecture/Laboratory sesi 1 dan rubrik LO 1.
- [NIST SP 800-145: The NIST Definition of Cloud Computing](https://csrc.nist.gov/pubs/sp/800/145/final).
- [GitHub Docs: repository templates](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).
- [Vercel Docs: Git deployments](https://vercel.com/docs/git).
