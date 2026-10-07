# Proyek besar Cloud Services (COMP6991031)

**Format:** satu proyek berkelanjutan, kelompok tepat **3 mahasiswa**. Praktikum Lab 01-11 adalah latihan terbimbing dan sumber teknik untuk proyek ini; tidak ada tugas atau pengumpulan bernilai yang terpisah untuk setiap lab. Challenge dan checker dalam repo lab dipakai untuk mencoba konsep serta memeriksa hasil sendiri. Repo dan tangkapan layar latihan boleh disimpan sebagai portofolio/bukti proses, tetapi bukan penyerahan mingguan yang wajib.

**Presentasi:** kemajuan proyek dipresentasikan pada **minggu 7 (UTS)** dan hasil akhir pada **minggu 14 (UAS)**. Ketentuan ini adalah rencana presentasi kelas dari dosen. RPS tertulis menempatkan *Lab: Group Project* pada bobot **50%** mata kuliah, serta *Theory: Mid Exam* 20% dan *Theory: Final Exam* 30%. Bobot dan administrasi penilaian resmi harus mengikuti LMS/RPS; brief ini tidak mengubah komponen ujian teori.

## Masalah yang diselesaikan

Pilih satu persoalan kerja nyata yang memerlukan aplikasi cloud-native multi-tier. Contoh: catatan kerja lintas tim yang privat, pelacakan tiket layanan, triase ulasan pelanggan, atau tanya jawab atas dokumen internal. Tulis siapa pengguna, alur utama, data yang diproses, batas biaya, dan risiko keamanan. Kelompok boleh memilih kasus lain dengan ruang lingkup sebanding.

## Produk minimal

1. **Frontend** untuk alur pengguna yang jelas, menampilkan status berhasil/gagal dan tidak menaruh secret di browser.
2. **Backend/API** dengan validasi input, respons HTTP yang tepat, endpoint kesehatan, serta log yang dapat membantu diagnosis.
3. **Database** persisten dengan skema yang terdokumentasi. Bila ada akun/pemilik data, tunjukkan isolasi antar pengguna melalui Auth/RLS atau kontrol akses setara.
4. **Jalur lokal yang dapat diulang** menggunakan Dockerfile dan Docker Compose untuk komponen yang sesuai. Sertakan README, `.env.example` tanpa nilai rahasia, serta langkah uji dari kondisi bersih.
5. **Jalur deploy** di layanan yang tersedia dan sesuai kuota/izin. Bila akun cloud tidak tersedia, tunjukkan demonstrasi lokal end-to-end dan jelaskan rencana deploy serta batas yang belum diuji; jangan mengklaim telah deploy.
6. **Pengukuran dan operasi**: skenario normal, input salah, satu gangguan layanan, pemulihan, log, dan sekurangnya satu metrik terukur (misalnya p50/p95 latensi atau availability pada sampel yang dijelaskan).
7. **Komponen ML/RAG bila relevan dengan kasus**: jelaskan model/data, evaluasi, keterbatasan, sumber jawaban, dan biaya. Fitur ini tidak boleh menggantikan kualitas frontend, backend, database, keamanan, dan operasi inti.

## Hubungan teori dan praktikum

| Sesi | Konsep yang dibawa ke satu proyek besar |
|---|---|
| 01-02 | Pilihan model cloud, shared responsibility, Git, Linux, permission, dan otomasi shell. |
| 03 | DNS, jaringan, HTTP, port, TLS, serta diagnosis koneksi antar tier. |
| 04-06 | VM/container, Docker image, lifecycle, Compose, network, volume, healthcheck, API, database, dan cache. |
| 07-08 | Skema data, Auth/RLS, alur browser-frontend-backend, dan deployment frontend bila tersedia. |
| 09-11 | Model/Gradio bila relevan, metrik dan monitoring, serta RAG dengan sitasi bila kasus membutuhkannya. |
| 12-14 | Integrasi, bukti pengujian, dokumentasi arsitektur, presentasi, dan refleksi trade-off. |

Tidak perlu menyalin semua lab ke produk akhir. Kelompok memilih teknik yang memang menyelesaikan masalah, lalu menunjukkan hubungan keputusan itu dengan konsep yang dipelajari.

## Presentasi minggu 7: checkpoint UTS

Tunjukkan masalah pengguna, peran tiga anggota, diagram arsitektur, repo proyek, dan demo lokal yang sudah menghubungkan sekurangnya frontend/API/database atau potongan paling kritis yang dapat dijalankan. Jelaskan keputusan container, jaringan, penyimpanan data, dan batas keamanan. Perlihatkan satu uji gagal serta cara mendiagnosisnya. Akhiri dengan pekerjaan yang masih perlu diselesaikan sampai minggu 14. Ini checkpoint dari proyek **yang sama**, bukan proyek kedua.

## Presentasi minggu 14: hasil akhir UAS

Jalankan demo end-to-end dari kondisi yang dapat direproduksi. Tunjukkan satu skenario normal, input salah, gangguan dan pemulihan, kontrol akses bila ada data per pengguna, hasil pengukuran, biaya/perkiraan biaya, serta satu keputusan desain yang berubah setelah uji. Presentasi harus menyertakan keterbatasan nyata dan kontribusi setiap anggota. Bila URL publik ada, uji saat presentasi; bila tidak, gunakan demo lokal dan bukti yang jelas.

## Artefak proyek bersama

- Satu repo GitHub **milik kelompok** dengan riwayat kontribusi tiga anggota, README setup lokal/deploy, diagram arsitektur, kode, tes yang relevan, dan `.env.example`. Jangan commit password, token, private key, atau data pribadi.
- Satu dokumen ringkas desain dan evaluasi (format paper IEEE bila diwajibkan dosen/RPS), memuat masalah, metode, hasil ukur, ancaman/mitigasi, keterbatasan, dan sumber.
- Slide dan demo video cadangan. Screenshot dari lab dapat dipakai untuk menunjukkan proses belajar, tetapi penilaian proyek bertumpu pada implementasi dan pengujian proyek kelompok sendiri.

## Cara dosen memberi umpan balik

Gunakan rubrik proyek tunggal: kejelasan masalah dan keputusan arsitektur; aplikasi multi-tier yang benar-benar berjalan; keamanan data dan secret; pengujian/observabilitas; kualitas dokumentasi dan presentasi; serta kontribusi seimbang tiga anggota. Challenge lab adalah alat latihan formatif, bukan komponen nilai terpisah. Catat keputusan penilaian akhir di LMS sesuai RPS resmi.
