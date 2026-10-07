# Rubrik Praktikum 1

## Bagian A. Setup (syarat kelengkapan)

Setiap butir diperiksa dari URL yang dikumpulkan. Butir yang belum selesai mengurangi nilai praktikum sesuai ketentuan dosen.

| No | Butir | Cara memeriksa |
|---|---|---|
| A1 | Profil GitHub lengkap (nama, foto, bio) tanpa data pribadi sensitif | buka URL profil |
| A2 | Profile README tampil | repo `<username>/<username>` public |
| A3 | Repo `intro-cloud-lab` dibuat dari template | halaman repo menampilkan "generated from" |
| A4 | Issue #1 tertutup oleh commit `closes #1` | timeline issue #1 menunjukkan commit penutup |
| A5 | Workflow CI hijau | tab Actions |
| A6 | Website Vercel menampilkan data dari `student.json` | footer website |
| A7 | `/api/hello` dan `/api/recommend` merespons | buka endpoint di browser |
| A8 | Bonus: `LAB_OWNER` terbaca di `/api/hello` | pesan "Halo dari FaaS milik …" |

## Bagian B. Analisis studi kasus (100 poin)

| Kriteria | Bobot | Sangat baik | Cukup | Kurang |
|---|---|---|---|---|
| Ketepatan kombinasi | 40 | Kombinasi deployment + service model tepat untuk tiap komponen; sistem dipecah menjadi komponen yang masuk akal (34–40) | Kombinasi umumnya tepat tapi dianalisis sebagai satu kesatuan, atau ada satu komponen yang kurang cocok (22–33) | Kombinasi tidak sesuai konteks atau hanya menyalin hasil engine (0–21) |
| Justifikasi | 40 | Minimal 3 faktor yang saling terkait, merujuk konteks kasus (regulasi, tim, traffic, budget), dan membandingkan dengan alternatif (34–40) | 2–3 faktor tapi generik atau tidak dikaitkan dengan konteks (22–33) | Kurang dari 2 faktor atau hanya klaim tanpa alasan (0–21) |
| Trade-off | 20 | Trade-off nyata beserta mitigasi konkret; kritis terhadap engine (17–20) | Trade-off disebut tanpa mitigasi (10–16) | Tidak ada trade-off atau hanya "tidak ada kekurangan" (0–9) |

Tidak ada satu jawaban benar. Dua kelompok bisa memilih kombinasi berbeda dan sama-sama mendapat nilai tinggi bila justifikasi dan trade-off-nya kuat.
