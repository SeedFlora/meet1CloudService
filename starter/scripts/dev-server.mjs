/**
 * Dev server lokal tanpa dependency (Node.js 20+).
 *
 * Meniru cara Vercel menjalankan project ini:
 *   - file statis (index.html, assets/, data/, ...) -> disajikan apa adanya
 *   - /api/<nama> -> import api/<nama>.js lalu panggil export GET/POST/...
 *
 * Jalankan:  npm run dev   lalu buka http://localhost:3000
 * Alternatif resmi: `npx vercel dev` (butuh login Vercel CLI).
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// fileURLToPath aman untuk path Windows yang mengandung spasi, mis. D:\cloud services\...
const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.env.PORT ?? 3000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

// Muat .env (kalau ada) supaya mirip Environment Variables di dashboard Vercel.
const envFile = join(ROOT, '.env');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (match && !line.trim().startsWith('#')) process.env[match[1]] ??= match[2].replace(/^['"]|['"]$/g, '');
  }
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

async function runFunction(req, res, name) {
  const file = join(ROOT, 'api', `${name}.js`);
  if (!/^[a-z0-9-_]+$/i.test(name) || !existsSync(file)) {
    return send(res, 404, 'application/json', JSON.stringify({ error: `Function /api/${name} tidak ditemukan` }));
  }
  // Query ?v=mtime memaksa re-import saat file berubah (hot reload sederhana).
  const version = (await stat(file)).mtimeMs;
  const mod = await import(`${pathToFileURL(file).href}?v=${version}`);
  const method = req.method.toUpperCase();
  const handler = mod[method] ?? (typeof mod.default?.fetch === 'function' ? mod.default.fetch.bind(mod.default) : null);
  if (!handler) {
    return send(res, 405, 'application/json', JSON.stringify({ error: `Method ${method} tidak didukung oleh /api/${name}` }));
  }

  const url = `http://${req.headers.host ?? `localhost:${PORT}`}${req.url}`;
  const body = ['GET', 'HEAD'].includes(method) ? undefined : await readBody(req);
  const request = new Request(url, { method, headers: req.headers, body });

  const started = performance.now();
  const response = await handler(request);
  const elapsed = (performance.now() - started).toFixed(1);
  console.log(`  λ ${method} /api/${name} -> ${response.status} (${elapsed} ms)`);

  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}

function send(res, status, type, body) {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

async function serveStatic(res, pathname) {
  const relative = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, '');
  const target = resolve(ROOT, relative || 'index.html');
  if (target !== ROOT && !target.startsWith(ROOT + sep)) return send(res, 403, 'text/plain', 'Forbidden');
  // Jangan pernah sajikan dotfile (.env, .git, ...) atau node_modules.
  if (relative.split(/[/\\]/).some((part) => part.startsWith('.') || part === 'node_modules')) {
    return send(res, 404, 'text/plain; charset=utf-8', `404 - ${pathname} tidak ditemukan`);
  }
  try {
    const info = await stat(target);
    const file = info.isDirectory() ? join(target, 'index.html') : target;
    const data = await readFile(file);
    send(res, 200, MIME[extname(file)] ?? 'application/octet-stream', data);
  } catch {
    send(res, 404, 'text/plain; charset=utf-8', `404 - ${pathname} tidak ditemukan`);
  }
}

const server = createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, 'http://localhost');
    const fn = pathname.match(/^\/api\/([^/]+?)(?:\.js)?\/?$/);
    if (fn) return await runFunction(req, res, fn[1]);
    return await serveStatic(res, pathname);
  } catch (error) {
    console.error(error);
    return send(res, 500, 'application/json', JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`\n  Cloud Model Lab jalan di http://localhost:${PORT}`);
  console.log('  Static  : index.html, assets/, data/, student.json');
  console.log('  FaaS    : /api/hello, /api/recommend');
  console.log('  Ctrl+C untuk berhenti\n');
});
