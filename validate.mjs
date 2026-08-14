import { readFileSync, existsSync } from 'fs';

const html = readFileSync('index.html', 'utf8');
const js = readFileSync('script.js', 'utf8');

let fail = 0;
const ok = (c, msg) => { console.log((c ? 'PASS' : 'FAIL') + '  ' + msg); if (!c) fail++; };

function extractObj(varName) {
  const start = js.indexOf('var ' + varName + ' = {');
  const bodyStart = js.indexOf('{', start);
  const end = js.indexOf('\n  };', bodyStart);
  return new Function('return (' + js.slice(bodyStart, end + 4) + ')')();
}
const HI = extractObj('I18N_HI');

const i18nKeys = new Set([...html.matchAll(/data-i18n="([a-zA-Z0-9_]+)"/g)].map(m => m[1]));
const LOAN = new Set(['f6h', 'ptGstr', 'ptPOS']);
const missing = [...i18nKeys].filter(k => !(k in HI) && !LOAN.has(k));
ok(missing.length === 0, 'data-i18n keys missing translation: ' + (missing.join(', ') || 'none'));
const orphan = Object.keys(HI).filter(k => !i18nKeys.has(k) && k !== 'title' && k !== 'desc');
ok(orphan.length === 0, 'orphan I18N_HI keys: ' + (orphan.join(', ') || 'none'));

// mockup fully removed?
ok(!html.includes('mock-side') && !html.includes('mock-stats') && !html.includes('mock-table') && !html.includes('mock-bar'), 'old mockup inner markup removed');

// screenshot asset present + referenced
ok(existsSync('app-shot.jpg'), 'app-shot.jpg exists');
ok(html.includes('src="app-shot.jpg"'), 'app-shot.jpg referenced in hero');
// hero-visual must not hide itself from assistive tech (the 3D canvas + screenshot
// are meaningful content). Other decorative elements may still use aria-hidden.
ok(!/<div class="hero-visual"[^>]*aria-hidden/.test(html), 'hero-visual no longer aria-hidden');

// tag balance (self-closing tags like <img ... /> have no closing tag)
const SELF_CLOSING = new Set(['img', 'input', 'br', 'hr', 'meta', 'link']);
for (const tag of ['div', 'section', 'span', 'a', 'button', 'table', 'ul', 'li', 'p', 'h1', 'h2', 'h3', 'h4', 'img']) {
  const open = (html.match(new RegExp('<' + tag + '(\\s|>)', 'g')) || []).length;
  if (SELF_CLOSING.has(tag)) {
    const selfClosed = (html.match(new RegExp('<' + tag + '[^>]*/>', 'g')) || []).length;
    ok(open === selfClosed, '<' + tag + '> self-closing balance: ' + open + '/' + selfClosed);
    continue;
  }
  const close = (html.match(new RegExp('</' + tag + '>', 'g')) || []).length;
  ok(open === close, '<' + tag + '> balance: ' + open + '/' + close);
}

console.log(fail === 0 ? '--- ALL CHECKS PASS ---' : '--- ' + fail + ' FAILED ---');
process.exit(fail === 0 ? 0 : 1);
