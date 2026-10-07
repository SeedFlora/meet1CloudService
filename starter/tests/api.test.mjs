import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as hello from '../api/hello.js';
import * as rec from '../api/recommend.js';

// Handler Vercel Function = fungsi biasa yang menerima Request dan
// mengembalikan Response (Web standard). Jadi bisa dites tanpa server.

test('GET /api/hello: cold start hanya di panggilan pertama instance', async () => {
  const first = await (await hello.GET(new Request('http://localhost/api/hello'))).json();
  const second = await (await hello.GET(new Request('http://localhost/api/hello'))).json();
  assert.equal(first.coldStart, true);
  assert.equal(second.coldStart, false);
  assert.equal(second.instance.id, first.instance.id);
  assert.equal(second.instance.invocations, first.instance.invocations + 1);
  assert.equal(first.region, process.env.VERCEL_REGION ?? 'local');
});

test('GET /api/recommend tanpa parameter mengembalikan petunjuk pemakaian', async () => {
  const res = rec.GET(new Request('http://localhost/api/recommend'));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.factors) && body.factors.length > 0);
});

test('GET /api/recommend dengan query string', async () => {
  const res = rec.GET(new Request('http://localhost/api/recommend?spiky=1&smallTeam=1&lowBudget=1'));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.equal(body.deployment.id, 'public');
});

test('POST /api/recommend dengan body JSON', async () => {
  const res = await rec.POST(new Request('http://localhost/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ factors: ['regulated', 'legacy'] }),
  }));
  assert.equal(res.status, 200);
  assert.equal((await res.json()).deployment.id, 'hybrid');
});

test('POST dengan JSON rusak -> 400', async () => {
  const res = await rec.POST(new Request('http://localhost/api/recommend', { method: 'POST', body: '{rusak' }));
  assert.equal(res.status, 400);
});

test('POST tanpa factor valid -> 400', async () => {
  const res = await rec.POST(new Request('http://localhost/api/recommend', { method: 'POST', body: '{"factors": ["ngawur"]}' }));
  assert.equal(res.status, 400);
});
