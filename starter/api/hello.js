/**
 * GET /api/hello — contoh FaaS paling sederhana.
 *
 * Setiap file di folder /api otomatis menjadi Vercel Function (zero config).
 * Tidak ada server yang Anda nyalakan: fungsi ini hanya jalan saat ada request.
 *
 * Variabel di luar handler (scope modul) hidup selama instance masih "hangat".
 * Instance baru = cold start = counter kembali ke 1. Coba panggil berkali-kali,
 * lalu panggil lagi setelah lama tidak dipakai. Vercel berusaha memakai ulang
 * instance yang masih hangat, jadi cold start tidak selalu muncul.
 */

const instanceId = Math.random().toString(36).slice(2, 8);
const startedAt = new Date().toISOString();
let invocations = 0;

export function GET(request) {
  invocations += 1;
  const owner = process.env.LAB_OWNER?.trim();

  return Response.json(
    {
      message: owner ? `Halo dari FaaS milik ${owner}!` : 'Halo dari FaaS!',
      region: process.env.VERCEL_REGION ?? 'local',
      runtime: `Node.js ${process.version}`,
      coldStart: invocations === 1,
      instance: {
        id: instanceId,
        startedAt,
        invocations,
      },
      time: new Date().toISOString(),
      path: new URL(request.url).pathname,
    },
    {
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
