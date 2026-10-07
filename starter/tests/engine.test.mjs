import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  recommend, normalizeFactors, FACTORS, STACK_MODELS, LAYERS,
  SERVICE_WEIGHTS, DEPLOYMENT_WEIGHTS,
} from '../lib/engine.js';

const cases = JSON.parse(readFileSync(new URL('../data/cases.json', import.meta.url), 'utf8')).cases;
const preset = (caseId, index = 0) => cases.find((c) => c.id === caseId).components[index].factors;

test('input kosong ditolak dengan pesan yang jelas', () => {
  const r = recommend([]);
  assert.equal(r.ok, false);
  assert.match(r.error, /minimal satu/);
});

test('normalizeFactors menerima array, objek, dan query string', () => {
  assert.deepEqual(normalizeFactors(['spiky', 'smallTeam', 'ngawur']), ['smallTeam', 'spiky']);
  assert.deepEqual(normalizeFactors({ spiky: true, smallTeam: '1', legacy: false }), ['smallTeam', 'spiky']);
  assert.deepEqual(normalizeFactors(new URLSearchParams('factors=legacy,spiky')), ['legacy', 'spiky']);
  assert.deepEqual(normalizeFactors(new URLSearchParams('regulated=true&spiky=0')), ['regulated']);
});

test('W1 marketplace UMKM: public + BaaS/PaaS/FaaS', () => {
  const r = recommend(preset('W1'));
  assert.equal(r.deployment.id, 'public');
  const ids = r.services.combination.map((s) => s.id);
  assert.equal(r.services.primary, 'BaaS');
  assert.ok(ids.includes('PaaS') && ids.includes('FaaS'));
});

test('W1 komponen pembayaran/email: cukup SaaS', () => {
  const r = recommend(preset('W1', 1));
  assert.deepEqual(r.services.combination.map((s) => s.id), ['SaaS']);
});

test('W2 bank: analisis per komponen menghasilkan model berbeda', () => {
  assert.equal(recommend(preset('W2', 0)).deployment.id, 'private');
  assert.equal(recommend(preset('W2', 0)).services.primary, 'IaaS');
  assert.equal(recommend(preset('W2', 1)).deployment.id, 'hybrid');
  assert.equal(recommend(preset('W2', 2)).services.primary, 'SaaS');
});

test('data teregulasi selalu memunculkan catatan region Indonesia', () => {
  const r = recommend(['regulated', 'smallTeam']);
  assert.ok(r.notes.some((n) => n.includes('Indonesia')));
});

test('wajib bebas lock-in mendorong multi-cloud', () => {
  const r = recommend(preset('C'));
  assert.equal(r.deployment.id, 'multi');
});

test('kombinasi selalu berisi tepat satu model utama', () => {
  for (const c of cases) {
    for (const comp of c.components) {
      const r = recommend(comp.factors);
      assert.equal(r.services.combination.filter((s) => s.role === 'utama').length, 1, `${c.id} ${comp.name}`);
    }
  }
});

test('stack: tanggung jawab Anda tidak pernah naik dari kiri ke kanan', () => {
  for (let i = 1; i < STACK_MODELS.length; i += 1) {
    assert.ok(STACK_MODELS[i].youManage <= STACK_MODELS[i - 1].youManage);
  }
  assert.equal(STACK_MODELS[0].youManage, LAYERS.length);
});

test('semua bobot hanya memakai factor yang terdaftar', () => {
  const ids = new Set(FACTORS.map((f) => f.id));
  for (const table of [SERVICE_WEIGHTS, DEPLOYMENT_WEIGHTS]) {
    for (const weights of Object.values(table)) {
      for (const key of Object.keys(weights)) assert.ok(ids.has(key), `factor tidak dikenal: ${key}`);
    }
  }
});

test('semua preset di cases.json memakai factor yang valid', () => {
  const ids = new Set(FACTORS.map((f) => f.id));
  for (const c of cases) {
    for (const comp of c.components) {
      for (const f of comp.factors) assert.ok(ids.has(f), `${c.id}: factor ${f} tidak dikenal`);
    }
  }
});
