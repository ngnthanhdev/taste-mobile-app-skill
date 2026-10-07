#!/usr/bin/env node
// Repository guard for pull requests. Run locally with `node scripts/validate.mjs`.
// It is deliberately conservative: a skill is text that an agent reads and acts on, so a hidden
// instruction, an unexpected script or a dangling link is a defect, not a style issue.
import { execSync } from 'node:child_process';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, extname, resolve, relative } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const errors = [];
const warnings = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

const files = execSync('git ls-files', { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);

// 1. Only expected kinds of files. The skill itself is Markdown; code lives under examples/ and scripts/.
const TEXT_EXT = new Set(['.md', '.yml', '.yaml', '.json', '.ts', '.tsx', '.js', '.mjs', '.txt', '']);
const BINARY_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);
const ALLOWED_TOP = ['SKILL.md', 'README.md', 'LICENSE', 'CONTRIBUTING.md', 'SECURITY.md', '.gitignore'];
for (const f of files) {
  const ext = extname(f).toLowerCase();
  const top = f.split('/')[0];
  const inSkill = f === 'SKILL.md' || f.startsWith('references/') || f.startsWith('templates/');
  if (inSkill && ext !== '.md') fail(f, 'the skill directories may contain Markdown only');
  if (!inSkill && !ALLOWED_TOP.includes(f) && !['.github', 'scripts', 'examples'].includes(top)) {
    fail(f, 'unexpected top-level path; the skill is SKILL.md, references/, templates/, examples/, scripts/, .github/');
  }
  if (!TEXT_EXT.has(ext) && !BINARY_EXT.has(ext)) fail(f, `unexpected file type ${ext || '(none)'}`);
  if (BINARY_EXT.has(ext) && !/^examples\/[^/]+\/(screens|app\/assets)\//.test(f)) fail(f, 'images belong under examples/<name>/screens or examples/<name>/app/assets');
  const size = statSync(join(root, f)).size;
  if (size > 2 * 1024 * 1024) fail(f, `file is ${(size / 1048576).toFixed(1)} MB; keep files under 2 MB`);
  try {
    const mode = execSync(`git ls-files -s -- "${f}"`, { cwd: root, encoding: 'utf8' }).split(' ')[0];
    if (mode === '100755' && f !== 'scripts/validate.mjs') fail(f, 'executable bit set; nothing in this repo needs to be executable');
  } catch {}
  if (f.startsWith('.github/workflows/') && f !== '.github/workflows/validate.yml') warn(f, 'new workflow file; maintainer must review the permissions block');
}

// 2. Content checks on every text file the agent might read.
const INVISIBLE = /[​-‏‪-‮⁠-⁤⁦-⁩﻿]/;
const SUSPICIOUS = [
  [/curl[^\n|]*\|\s*(ba|z)?sh\b/i, 'pipes a download into a shell'],
  [/wget[^\n|]*\|\s*(ba|z)?sh\b/i, 'pipes a download into a shell'],
  [/base64\s+(-d|--decode)/i, 'decodes base64 at run time'],
  [/\beval\s*\(/, 'uses eval'],
  [/rm\s+-rf\s+[~/]/, 'destructive rm'],
  [/ignore (all |any )?(previous|prior|above) (instructions|rules)/i, 'prompt-injection phrase'],
  [/do not (tell|inform|mention)( this)? to the user/i, 'instruction to hide something from the user'],
  [/\b(exfiltrat|keylog|credential harvest)/i, 'suspicious intent'],
  [/https?:\/\/(bit\.ly|t\.co|tinyurl\.com|goo\.gl|is\.gd|cutt\.ly)\//i, 'URL shortener; link the real page'],
  [/https?:\/\/\d{1,3}(\.\d{1,3}){3}/, 'raw IP address URL'],
];
const mdFiles = files.filter((f) => f.endsWith('.md'));
for (const f of files) {
  const ext = extname(f).toLowerCase();
  if (!TEXT_EXT.has(ext)) continue;
  const text = readFileSync(join(root, f), 'utf8');
  if (INVISIBLE.test(text)) fail(f, 'contains zero-width or bidirectional control characters (hidden text)');
  for (const [re, why] of SUSPICIOUS) if (re.test(text)) fail(f, why);
  if (f.endsWith('.md') && (f === 'SKILL.md' || f.startsWith('references/') || f.startsWith('templates/'))) {
    const comments = text.match(/<!--[\s\S]*?-->/g) ?? [];
    for (const c of comments) if (c.length > 0) fail(f, `HTML comment in skill text (hidden from readers, visible to the agent): ${c.slice(0, 60)}`);
  }
}

// 3. Relative Markdown links resolve. Code blocks and inline code are skipped: regexes in shell
// snippets look like links to this check.
const stripCode = (t) => t.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
for (const f of mdFiles) {
  const text = stripCode(readFileSync(join(root, f), 'utf8'));
  for (const m of text.matchAll(/\]\(([^)\s#]+)(#[^)]*)?\)/g)) {
    const target = m[1];
    if (/^[a-z]+:/i.test(target)) continue;
    const p = resolve(dirname(join(root, f)), target);
    if (!existsSync(p)) fail(f, `broken relative link: ${target}`);
  }
}

// 4. SKILL.md front matter and references list.
const skill = readFileSync(join(root, 'SKILL.md'), 'utf8');
const fm = skill.split('---')[1] ?? '';
for (const key of ['name:', 'description:', 'version:']) if (!fm.includes(key)) fail('SKILL.md', `front matter is missing ${key}`);
const referenced = new Set([...skill.matchAll(/`((?:references|templates)\/[a-zA-Z0-9_.-]+\.md)`/g)].map((m) => m[1]));
for (const r of referenced) if (!existsSync(join(root, r))) fail('SKILL.md', `references missing file ${r}`);
for (const f of files) if ((f.startsWith('references/') || f.startsWith('templates/')) && !referenced.has(f)) fail(f, 'not mentioned in SKILL.md; every reference file must be reachable from the skill');

// 5. Tell and rule IDs are stable: nothing that exists on the base branch may disappear or be renumbered.
const idPattern = /^\|\s*([A-I]\d{1,2})\s*\|/gm;
const headIds = new Set([...readFileSync(join(root, 'references/tells-mobile.md'), 'utf8').matchAll(idPattern)].map((m) => m[1]));
if (headIds.size !== [...readFileSync(join(root, 'references/tells-mobile.md'), 'utf8').matchAll(idPattern)].length) fail('references/tells-mobile.md', 'duplicate tell IDs');
const base = process.env.BASE_REF;
if (base) {
  try {
    const baseTells = execSync(`git show ${base}:references/tells-mobile.md`, { cwd: root, encoding: 'utf8' });
    for (const m of baseTells.matchAll(idPattern)) if (!headIds.has(m[1])) fail('references/tells-mobile.md', `tell ${m[1]} was removed or renumbered; IDs are stable, append instead`);
    const baseRules = new Set([...execSync(`git show ${base}:references/layout-mechanics.md`, { cwd: root, encoding: 'utf8' }).matchAll(/\bR-[A-Z]{2}\d+\b/g)].map((m) => m[0]));
    const headRules = new Set([...readFileSync(join(root, 'references/layout-mechanics.md'), 'utf8').matchAll(/\bR-[A-Z]{2}\d+\b/g)].map((m) => m[0]));
    for (const r of baseRules) if (!headRules.has(r)) fail('references/layout-mechanics.md', `rule ${r} was removed; rule IDs are stable`);
  } catch (e) {
    warn('tells', `could not compare with ${base}: ${e.message.split('\n')[0]}`);
  }
}

for (const w of warnings) console.log(`warning  ${w}`);
for (const e of errors) console.log(`error    ${e}`);
console.log(`${files.length} files checked, ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
