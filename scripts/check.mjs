import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

function checkSyntax(label, source, args) {
  const result = spawnSync(process.execPath, args, {
    encoding: 'utf8',
    input: source,
  });
  if (result.status === 0) return;

  process.stderr.write(`${label} syntax check failed\n`);
  process.stderr.write(result.stderr || result.stdout || 'Unknown syntax error\n');
  process.exit(result.status || 1);
}

checkSyntax('server.mjs', undefined, ['--check', 'server.mjs']);

const html = readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/giu)];
if (scripts.length === 0) {
  process.stderr.write('index.html has no inline script to validate\n');
  process.exit(1);
}

for (const [index, match] of scripts.entries()) {
  checkSyntax(`index.html inline script ${index + 1}`, match[1], ['--check', '-']);
}

process.stdout.write(`Validated server.mjs and ${scripts.length} inline browser script(s).\n`);
