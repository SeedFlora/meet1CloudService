/**
 * /api/recommend — engine rekomendasi yang dijalankan sebagai FaaS.
 *
 * GET  /api/recommend?spiky=1&smallTeam=1
 * GET  /api/recommend?factors=spiky,smallTeam
 * POST /api/recommend   body: {"factors": ["spiky", "smallTeam"]}
 *
 * Logikanya SAMA PERSIS dengan yang dipakai browser (lib/engine.js).
 * Bedanya hanya di mana kode dieksekusi: di sini, di infrastruktur provider.
 */

import { recommend, FACTORS } from '../lib/engine.js';

const HEADERS = {
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

function reply(body, status = 200) {
  return Response.json(body, { status, headers: HEADERS });
}

function handle(input) {
  const result = recommend(input);
  return result.ok ? reply(result) : reply(result, 400);
}

export function GET(request) {
  const params = new URL(request.url).searchParams;
  if ([...params.keys()].length === 0) {
    return reply({
      usage: 'GET /api/recommend?spiky=1&smallTeam=1  atau  POST {"factors": ["spiky", "smallTeam"]}',
      factors: FACTORS.map(({ id, label }) => ({ id, label })),
    });
  }
  return handle(params);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ ok: false, error: 'Body harus JSON valid, contoh: {"factors": ["spiky"]}' }, 400);
  }
  return handle(body);
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...HEADERS,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
