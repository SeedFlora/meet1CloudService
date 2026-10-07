# Studi Kasus: Memilih Kombinasi Service Model dan Deployment Model

Tujuan latihan ini adalah LO **(C4) Analysis**: menganalisis lima service model dan empat deployment model, lalu memilih kombinasi yang tepat. Jawaban yang dinilai bukan "benar atau salah", melainkan **ketepatan kombinasi, kekuatan justifikasi, dan kejujuran trade-off**.

## Cara mengerjakan

1. **Pecah sistem menjadi komponen.** Satu organisasi hampir tidak pernah memakai satu model saja.
2. **Tulis faktor tiap komponen**: regulasi, sistem legacy, kebutuhan kontrol OS/GPU, ukuran tim, target waktu rilis, pola traffic, budget, risiko lock-in.
3. **Pilih deployment model dan kombinasi service model** per komponen.
4. **Justifikasi** dengan minimal tiga faktor yang saling terkait.
5. **Tulis trade-off** dan cara memitigasinya.
6. **Bandingkan dengan engine** di Cloud Model Lab (pilih studi kasus di dropdown). Di mana Anda setuju, di mana tidak, dan bobot mana yang menurut Anda keliru?

Format jawaban: [`worksheet.md`](worksheet.md). Pengumpulan: issue **Analisis studi kasus** di repo Anda.

---

## W1. Marketplace UMKM batik Bandung (contoh yang dibahas)

**Konteks.** Startup 3 developer tanpa tim ops. MVP harus live dalam 6 minggu: login pembeli dan penjual, katalog, upload foto produk. Traffic bisa naik 10x saat promo tanggal kembar. Budget terbatas.

| Komponen | Service model | Alasan |
|---|---|---|
| Frontend web (katalog, halaman toko) | **PaaS** (Vercel) | tanpa server yang dirawat, CDN global, preview per pull request |
| Login, database produk, foto produk | **BaaS** (Supabase) | auth, PostgreSQL, dan storage siap pakai; akses dibatasi dengan Row Level Security |
| Webhook pembayaran, hitung ongkir, notifikasi | **FaaS** (Vercel Functions) | jalan per event, idle hampir sepanjang waktu, melonjak saat promo |
| Pembayaran, email, repo kode | **SaaS** (Midtrans/Xendit, Google Workspace, GitHub) | kebutuhan umum, bukan pembeda bisnis; jangan dibangun ulang |

**Deployment model: public cloud.** Tanpa CapEx, elastis saat lonjakan promo, dan tim kecil bisa rilis cepat.

**Trade-off dan mitigasi.**
- *Lock-in*: fitur BaaS/FaaS spesifik provider. Mitigasi: Supabase berbasis PostgreSQL standar dan bisa di-self-host; handler memakai Web API standar (`Request`/`Response`).
- *Biaya saat skala besar*: bandwidth foto dan invocation bisa melonjak. Mitigasi: kompresi gambar, budget alert, evaluasi ulang saat traffic stabil tinggi.
- *Data pribadi pembeli* tetap tunduk pada UU PDP walau di public cloud: kontrol akses, enkripsi, dan persetujuan pengguna tetap tanggung jawab startup.

**Engine:** komponen aplikasi menghasilkan *Public cloud + BaaS + PaaS + FaaS*, komponen pembayaran/email menghasilkan *Public cloud + SaaS*.

---

## W2. Bank Pembangunan Daerah meluncurkan mobile banking (contoh yang dibahas)

**Konteks.** Core banking sudah berjalan di data center sendiri dan diawasi OJK. Mobile banking dan web promosi melonjak saat tanggal gajian. Tim IT besar, termasuk tim infrastruktur dan security.

POJK 11/POJK.03/2022 mewajibkan bank menempatkan sistem elektronik di pusat data dan pusat pemulihan bencana di wilayah Indonesia. Penempatan di luar negeri hanya untuk kriteria tertentu dan butuh persetujuan OJK.

| Komponen | Deployment | Service model | Alasan |
|---|---|---|---|
| Core banking dan data nasabah | **Private** | **IaaS** (virtualisasi di DC sendiri) | regulasi ketat, beban stabil 24/7, butuh kontrol OS dan lisensi |
| API mobile banking dan web promosi | **Hybrid** | **PaaS + FaaS** di region Jakarta, terhubung ke core lewat jalur privat | lonjakan tanggal gajian, rilis fitur cepat, data tetap di Indonesia |
| Email dan kolaborasi internal | **Public** | **SaaS** | kebutuhan umum; atur klasifikasi data agar data nasabah tidak lewat email |

**Deployment model organisasi: hybrid cloud.**

**Trade-off dan mitigasi.**
- *Kompleksitas integrasi*: jalur privat (VPN atau dedicated interconnect), identitas terpadu, monitoring lintas lingkungan. Mitigasi: tim infrastruktur yang sudah ada, arsitektur API gateway yang jelas.
- *Kepatuhan*: setiap komponen di public cloud harus di region Indonesia dan terdokumentasi untuk OJK.
- *Biaya dua lingkungan*: DC sendiri tetap dirawat sambil membayar public cloud.

**Insight kunci:** analisis dilakukan **per komponen, bukan per organisasi**. Bank yang sama memakai tiga kombinasi berbeda. Engine menghasilkan *Private + IaaS*, *Hybrid + PaaS + FaaS*, dan *Public + SaaS* untuk tiga komponen tersebut.

---

## Latihan A–D

Preset di Cloud Model Lab hanya titik awal untuk **keseluruhan sistem**. Nilai tertinggi diberikan pada analisis yang memecah sistem menjadi komponen dan berani tidak setuju dengan engine bila alasannya kuat.

### A. Registrasi event kampus

Aplikasi pendaftaran seminar dan lomba: sepi 11 bulan, meledak 3 hari saat pendaftaran dibuka. Panitia mahasiswa berganti tiap tahun, budget nyaris nol.

Pertanyaan pemandu:
- Apa yang terjadi pada sistem di jam pertama pendaftaran dibuka? Model mana yang biayanya mendekati nol di 11 bulan sisanya?
- Siapa yang merawat sistem ini ketika panitia berganti tahun depan?
- Data apa yang dikumpulkan, dan apa kewajiban panitia terhadap data itu?
- Apakah Google Forms (SaaS) sudah cukup? Pada kebutuhan apa ia mulai tidak cukup?

### B. Rekam medis elektronik jaringan klinik

12 klinik di Jawa Barat wajib menyelenggarakan rekam medis elektronik (Permenkes 24/2022). Data pasien sangat sensitif, staf IT hanya 2 orang.

Pertanyaan pemandu:
- *Build* atau *buy*? Apa risiko membangun sistem RME sendiri dengan 2 staf IT?
- Di mana data pasien boleh disimpan, dan bagaimana memastikannya?
- Apa yang tetap menjadi tanggung jawab klinik walaupun memakai SaaS (hak akses, audit, ekspor dan backup, perjanjian dengan vendor)?
- Apakah private cloud realistis untuk tim sekecil ini? Mengapa?

### C. Startup AI dubbing video

Training model butuh GPU beberapa hari per bulan. API inference dipakai klien dari berbagai negara. Tim ingin bebas pindah ke provider GPU termurah.

Pertanyaan pemandu:
- Pola beban training dan inference berbeda. Apakah keduanya harus memakai model yang sama?
- Kapan spot instance cocok untuk training, dan apa risikonya?
- Multi-cloud menjanjikan kebebasan. Apa biaya tersembunyinya (transfer data antar provider, kompleksitas operasional)?
- Teknologi apa yang membuat workload mudah dipindah (lihat materi Docker di Pertemuan 4–6)?

### D. Portal PPDB pemerintah kota

Penerimaan peserta didik baru: traffic ekstrem 2 minggu per tahun, wajib terintegrasi dengan data kependudukan di server pemda. Termasuk Penyelenggara Sistem Elektronik lingkup publik.

Pertanyaan pemandu:
- Apa konsekuensi status "PSE lingkup publik" menurut PP 71/2019 terhadap lokasi data?
- Komponen mana yang harus tetap dekat dengan server pemda, dan mana yang bisa diletakkan di public cloud region Indonesia?
- Bagaimana menangani lonjakan 2 minggu tanpa membeli server yang menganggur 50 minggu?
- Juni 2024, serangan ransomware ke Pusat Data Nasional Sementara mengganggu layanan ratusan instansi, dan banyak instansi tidak punya cadangan data sendiri. Apa pelajarannya untuk desain Anda?
