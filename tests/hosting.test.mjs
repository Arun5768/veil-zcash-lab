import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');

test('Hosting: assets resolve under the GitHub Pages project path', () => {
  const base = 'https://arun5768.github.io/veil-zcash-lab/';
  const stylesheet = html.match(/<link rel="stylesheet" href="([^"]+)"/)[1];
  const script = html.match(/<script type="module" src="([^"]+)"/)[1];
  assert.equal(new URL(stylesheet, base).href, `${base}style.css`);
  assert.equal(new URL(script, base).href, `${base}app.js`);
});

test('Hosting: CSP and referrer policy precede executable content', () => {
  assert.match(html, /http-equiv="Content-Security-Policy"/);
  assert.match(html, /<meta name="referrer" content="no-referrer">/);
  assert.ok(html.indexOf('Content-Security-Policy') < html.indexOf('<script'));
  assert.match(html, /object-src 'none'; base-uri 'none'; form-action 'none'/);
});

test('Hosting: static deployment opts out of Jekyll processing', async () => {
  await access(new URL('../dist/.nojekyll', import.meta.url));
});
