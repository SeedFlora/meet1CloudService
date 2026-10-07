# 05. Vercel via GitHub OAuth dan Deployment Pertama

Vercel adalah **PaaS** (hosting frontend) sekaligus **FaaS** (Vercel Functions). Anda tidak membuat password baru di Vercel. Anda meminjam identitas GitHub lewat **OAuth**.

## 1. Apa yang terjadi saat klik "Continue with GitHub"

```
 Browser (Anda)                 Vercel                          GitHub
      │                            │                               │
      │ 1. klik Continue with GitHub                               │
      │───────────────────────────>│                               │
      │ 2. redirect ke github.com/login/oauth/authorize            │
      │    ?client_id=…&redirect_uri=…&scope=…&state=…             │
      │<───────────────────────────│                               │
      │ 3. login (password + 2FA) di github.com, klik Authorize    │
      │───────────────────────────────────────────────────────────>│
      │ 4. redirect kembali ke Vercel dengan ?code=…&state=…       │
      │<───────────────────────────────────────────────────────────│
      │───────────────────────────>│                               │
      │                            │ 5. tukar code + client_secret │
      │                            │    dengan access token        │
      │                            │    (server ke server)         │
      │                            │──────────────────────────────>│
      │                            │<──────────────────────────────│
      │                            │ 6. baca profil & email via API│
      │                            │──────────────────────────────>│
      │ 7. akun Vercel siap        │<──────────────────────────────│
      │<───────────────────────────│                               │
```

Poin yang perlu dipahami:
- **Password GitHub tidak pernah diberikan ke Vercel.** Anda mengetiknya di github.com (langkah 3).
- **`state`** adalah nilai acak dari Vercel yang dicek lagi di langkah 4, mencegah serangan CSRF.
- **`scope`** menentukan izin yang diminta. Baca layar Authorize sebelum menyetujui.
- **Access token** didapat server Vercel langsung dari GitHub memakai `client_secret` (langkah 5), tidak lewat browser Anda.
- Akses bisa dicabut kapan saja di **GitHub → Settings → Applications**.

### Dua izin yang berbeda

| | Untuk apa | Di mana diatur |
|---|---|---|
| **Login dengan GitHub** | Vercel mengenali siapa Anda | layar Authorize saat signup |
| **Vercel GitHub App** | Vercel membaca repo dan membuat deployment saat Anda push | saat import project, pilih **Only select repositories** |

Selalu berikan izin sesempit mungkin (*principle of least privilege*). Vercel tidak perlu melihat semua repo Anda, cukup repo yang akan di-deploy.

## 2. Daftar Vercel

1. Buka [vercel.com/signup](https://vercel.com/signup).
2. Pilih **Hobby** (untuk project pribadi, non-komersial, gratis). Isi nama.
3. Klik **Continue with GitHub** → login di GitHub bila diminta → **Authorize**.
4. Anda masuk ke dashboard Vercel.

Kalau layar Authorize tidak muncul atau gagal, cek email GitHub Anda sudah terverifikasi ([docs/01](01-github-account.md)).

## 3. Import dan deploy

1. Dashboard Vercel → **Add New… → Project**.
2. Di **Import Git Repository**, kalau repo belum terlihat, klik **Install** atau **Adjust GitHub App Permissions**, pilih **Only select repositories**, centang `intro-cloud-lab`, lalu **Install/Save**.
3. Klik **Import** di sebelah `intro-cloud-lab`.
4. Pengaturan project:
   - **Framework Preset**: `Other`
   - **Root Directory**: `./`
   - **Build Command** dan **Output Directory**: biarkan default. Repo ini tanpa build step, jadi file di root langsung disajikan.
5. Klik **Deploy**. Tunggu sampai muncul halaman selamat.

Vercel otomatis:
- menyajikan `index.html`, `assets/`, `data/`, `student.json` lewat CDN global (PaaS)
- mengubah setiap file di `api/` menjadi Vercel Function (FaaS)
- memasang HTTPS dan domain `https://<nama-project>.vercel.app`

## 4. Verifikasi

1. Buka URL production. Footer seharusnya menampilkan nama Anda dari `student.json`.
2. Klik **Panggil /api/hello**. Region biasanya `iad1` (Washington, D.C.), region default Vercel Functions.
3. Klik beberapa kali: nomor invocation naik di instance yang sama. Setelah lama tidak dipanggil, instance bisa dimatikan; panggilan berikutnya memicu instance baru dengan `coldStart: true`. Vercel berusaha memakai ulang instance yang masih hangat, jadi cold start memang tidak selalu muncul.
4. Uji dari terminal:

   ```bash
   curl https://<nama-project>.vercel.app/api/hello
   curl "https://<nama-project>.vercel.app/api/recommend?spiky=1&smallTeam=1&lowBudget=1"
   ```

   Di Windows PowerShell pakai `curl.exe`.

## 5. Alur kerja setelah terhubung

| Aksi di GitHub | Hasil di Vercel |
|---|---|
| push atau commit ke `main` | **Production deployment**, URL utama ter-update |
| push ke branch lain | **Preview deployment** dengan URL unik |
| buka pull request | Preview deployment + komentar bot berisi link preview |

Inilah yang disebut *Git-based deployment*: tidak ada upload manual, tidak ada SSH ke server.

## 6. Environment variable (bonus)

1. Vercel → project → **Settings → Environment Variables**.
2. Key: `LAB_OWNER`, Value: nama Anda, Environment: Production (dan Preview kalau mau). **Save**.
3. Tab **Deployments** → deployment terbaru → menu **⋯ → Redeploy**. Environment variable baru berlaku setelah redeploy.
4. Panggil `/api/hello` lagi. Pesannya berubah menjadi "Halo dari FaaS milik …".

Nilai ini tidak ada di repo, tapi fungsi bisa membacanya lewat `process.env.LAB_OWNER`. Pola yang sama dipakai untuk API key di pertemuan-pertemuan berikutnya.

## 7. Bonus: pindahkan function ke Singapura

1. **Settings → Functions → Function Region** → pilih **Singapore (sin1)** → **Save**.
2. Redeploy, lalu bandingkan latensi di panel "Function ini jalan di mana?".

Tidak ada region Vercel di Jakarta; Singapura yang paling dekat. Diskusikan: data apa yang *tidak boleh* diproses di luar Indonesia? (Kaitkan dengan PP 71/2019 dan UU PDP yang dibahas di kelas.)

## 8. Troubleshooting

| Gejala | Penyebab umum | Solusi |
|---|---|---|
| `/api/hello` menghasilkan 404 | file tidak di folder `api/` di root, atau salah nama | pastikan path `api/hello.js` dan ada `export function GET` |
| Deployment **Blocked**: commit author tidak punya akses | email commit tidak terhubung ke akun GitHub yang login Vercel, atau commit dari orang lain di repo private (Hobby) | samakan `git config user.email` dengan email terverifikasi/noreply GitHub; commit ulang |
| Push tidak memicu deployment | GitHub App tidak punya akses ke repo, atau Login Connection belum terhubung | **Adjust GitHub App Permissions**; cek **Account Settings → Authentication** di Vercel |
| Halaman masih versi lama | cache browser, atau deployment belum selesai | hard refresh (Ctrl+F5), cek status di tab Deployments |
| Footer menulis "student.json tidak terbaca" | JSON tidak valid (koma, tanda kutip) | perbaiki, lihat pesan error di tab Actions GitHub |
| Preview URL meminta login Vercel | Deployment Protection aktif untuk preview | normal; URL production tetap publik |

## Cek mandiri

- [ ] Akun Vercel terhubung ke GitHub, tanpa password baru
- [ ] Vercel GitHub App hanya punya akses ke repo yang dipilih
- [ ] URL production menampilkan nama Anda dan `/api/hello` merespons
- [ ] Anda bisa menjelaskan tujuh langkah OAuth di atas dengan kata-kata sendiri

Selanjutnya: kerjakan latihan di [`exercises/case-studies.md`](../exercises/case-studies.md).
