#!/usr/bin/env node
/* ADVO GO — Update Tool (CLI)
   Naya EXE link + version updates.json me daalne ke liye —
   bina website me entry kiye. Usage:
     node update-tool.mjs                     → interactive prompts
     node update-tool.mjs --url <exe-url> --version 1.2.0
   Ye file updates.json ko update karta hai — phir usse apni website ke root par upload karo. */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, 'updates.json');

function load() {
  if (!existsSync(FILE)) {
    return { exe: { version: '', url: '', size: '~120 MB' } };
  }
  try { return JSON.parse(readFileSync(FILE, 'utf8')); } catch (e) { return { exe: {} }; }
}
function save(u) {
  writeFileSync(FILE, JSON.stringify(u, null, 2) + '\n', 'utf8');
}

function prompt(q) {
  return q.q + (q.def ? ' [' + q.def + ']' : '') + ': ';
}

/* Robust sequential questioner: rl.question par nahi, 'line' events par chalta
   hai, taaki jab input beech me band ho (piped/EOF) to silently exit na ho —
   clear error ke saath abort hota hai aur kuch save nahi hota. */
function askAll(rl, questions) {
  return new Promise((resolve, reject) => {
    const answers = [];
    let i = 0;
    let done = false;
    const onClose = () => {
      if (!done && i < questions.length) {
        reject(new Error('Input beech me band ho gaya (' + i + '/' + questions.length + ' sawaal ke baad) — kuch save NAHI hua. Sab sawaal ek-ek karke bharo.'));
      }
    };
    rl.on('close', onClose);
    rl.on('line', (line) => {
      if (done || i >= questions.length) return;
      answers.push(line.trim() || questions[i].def || '');
      i++;
      if (i < questions.length) {
        process.stdout.write(prompt(questions[i]));
      } else {
        done = true;
        rl.removeListener('close', onClose);
        resolve(answers);
      }
    });
    process.stdout.write(prompt(questions[0]));
  });
}

async function interactive() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const cur = load();
  console.log('=== ADVO GO — Update Tool ===');
  console.log('(current: ' + ((cur.exe && cur.exe.version) || 'none') + ')  — kuch nahi daala to purana value rahega. Khali chhodne par Enter dabao.\n');

  const questions = [
    { q: 'Naya EXE download link', def: (cur.exe && cur.exe.url) || '' },
    { q: 'Version', def: (cur.exe && cur.exe.version) || '1.0.0' },
    { q: 'Size', def: (cur.exe && cur.exe.size) || '~120 MB' }
  ];
  const answers = await askAll(rl, questions);

  const next = {
    exe: { version: answers[1] || '1.0.0', url: answers[0], size: answers[2] }
  };
  if (next.exe.url && !/^https?:\/\//i.test(next.exe.url)) {
    console.error('\n✗ EXE link http(s) se shuru hona chahiye — abhi: "' + next.exe.url + '". Garbage URL download button tod deta hai. Kuch save NAHI hua.');
    rl.close();
    process.exit(1);
  }
  save(next);
  console.log('\n✓ updates.json save ho gaya:');
  console.log(JSON.stringify(next, null, 2));
  console.log('\nAb is file ko apni website ke root par upload karo (purani replace karo).');
  rl.close();
}

async function cliArgs(args) {
  const get = (k) => { const i = args.indexOf(k); return i > -1 && args[i + 1] ? args[i + 1] : ''; };
  const cur = load();
  const exeUrl = get('--url');
  const exeVer = get('--version');
  if (!exeUrl && !exeVer) { console.log('Kuch nahi diya — koi change nahi. (--url, --version dekho)'); process.exit(1); }
  const next = {
    exe: { version: exeVer || (cur.exe && cur.exe.version) || '1.0.0', url: exeUrl || (cur.exe && cur.exe.url) || '', size: (cur.exe && cur.exe.size) || '~120 MB' }
  };
  if (next.exe.url && !/^https?:\/\//i.test(next.exe.url)) {
    console.error('✗ EXE link http(s) se shuru hona chahiye — abhi: "' + next.exe.url + '". Kuch save NAHI hua.');
    process.exit(1);
  }
  save(next);
  console.log('✓ updates.json update ho gaya: ' + next.exe.version + ' — ' + (next.exe.url || '(koi EXE link nahi)'));
}

const args = process.argv.slice(2);
if (args.length > 0) cliArgs(args);
else interactive().catch((e) => { console.error('\n✗ ' + e.message); process.exit(1); });
