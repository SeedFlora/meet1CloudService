# Rubrik Praktikum 1

Bagian A adalah daftar bukti praktik. Nilai resmi mengikuti ketentuan dosen dan LMS. Bagian B memberi contoh cara menilai analisis studi kasus; jawaban yang berbeda dapat sama-sama kuat bila alasannya jelas.

## Bagian A. Bukti praktik

| No | Bukti | Cara memeriksa |
|---|---|---|
| A1 | Repo pribadi dibuat dari template `SeedFlora/meet1CloudService` | URL repo dan riwayat commit dapat dibuka |
| A2 | `starter/student.json` berisi nama, kelas, dan username GitHub yang benar, tanpa NIM atau kredensial | Bandingkan isi file dengan halaman web yang berjalan |
| A3 | Tes lokal lulus 18/18 | Jalankan `cd starter` lalu `npm test`; simpan screenshot hasil sendiri |
| A4 | Halaman model cloud terbuka di `http://localhost:3000` | Jalankan `npm run dev`, buka browser, dan coba pilihan model |
| A5 | `/api/hello` dan `/api/recommend` memberi HTTP 200 untuk input valid, sedangkan faktor tak dikenal memberi HTTP 400 | Uji dengan browser atau `curl`; simpan hasil dan jelaskan maknanya |
| A6 | `hasil/lab01.md` memuat analisis kasus A–D, alasan, trade-off, dan bukti uji | Buka laporan dan `hasil/bukti/` pada repo pribadi |
| A7 | Perubahan telah di-commit dan di-push; CI dapat diperiksa | Bandingkan SHA lokal dengan remote dan lihat tab Actions |
| A8 | **Opsional:** deployment Vercel menampilkan halaman dan kedua API; eksplorasi `LAB_OWNER` bila dikerjakan | Buka URL deploy milik sendiri; jalur lokal sudah mencukupi praktik inti |

Jangan unggah NIM, password, token, `.env`, atau screenshot kredensial ke repo publik. Jika dosen meminta identitas resmi, kirim melalui LMS sesuai petunjuk kelas.

## Bagian B. Analisis studi kasus (100 poin)

| Kriteria | Bobot | Sangat baik | Cukup | Kurang |
|---|---|---|---|---|
| Ketepatan kombinasi | 40 | Kombinasi deployment dan service model tepat untuk tiap komponen; sistem dipecah menjadi komponen yang masuk akal (34–40) | Kombinasi umumnya tepat tetapi dianalisis sebagai satu kesatuan, atau ada satu komponen yang kurang cocok (22–33) | Kombinasi tidak sesuai konteks atau hanya menyalin hasil engine (0–21) |
| Justifikasi | 40 | Minimal tiga faktor yang saling terkait, merujuk konteks kasus (regulasi, tim, traffic, budget), dan membandingkan dengan alternatif (34–40) | Dua sampai tiga faktor tetapi generik atau tidak dikaitkan dengan konteks (22–33) | Kurang dari dua faktor atau hanya klaim tanpa alasan (0–21) |
| Trade-off | 20 | Trade-off nyata beserta mitigasi konkret; kritis terhadap engine (17–20) | Trade-off disebut tanpa mitigasi (10–16) | Tidak ada trade-off atau hanya “tidak ada kekurangan” (0–9) |

Tidak ada satu jawaban benar. Dua kelompok bisa memilih kombinasi berbeda dan sama-sama mendapat nilai tinggi bila justifikasi dan trade-off-nya kuat.
