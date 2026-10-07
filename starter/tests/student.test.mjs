import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Dijalankan juga oleh GitHub Actions (tab Actions) setiap kali Anda push.
test('student.json valid dan field wajib terisi', () => {
  const raw = readFileSync(new URL('../student.json', import.meta.url), 'utf8');
  let data;
  assert.doesNotThrow(() => { data = JSON.parse(raw); }, 'student.json bukan JSON valid (cek koma & tanda kutip)');
  for (const key of ['name', 'class', 'github']) {
    assert.equal(typeof data[key], 'string', `field "${key}" harus berupa teks`);
    assert.ok(data[key].trim().length > 0, `field "${key}" masih kosong`);
  }
  assert.match(data.github, /^[A-Za-z0-9-]+$/, 'username GitHub hanya boleh huruf, angka, dan tanda minus');
  assert.equal('nim' in data, false, 'Jangan taruh NIM di website publik');
});
