import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const p = join(__dirname, 'index.html');
const lines = fs.readFileSync(p, 'utf8').split('\n');

// Immersive branch is the only place with ref={pdfImmersiveFsRef} in the PDF Coach overlay body.
if (lines.slice(11370, 11620).some((l) => l.includes('ref={pdfImmersiveFsRef}'))) {
  console.log('already merged');
  process.exit(0);
}
const I_START = 11400; // 0-based start of block to replace (line 11401, 1-based)
const I_END = 11572; // exclusive (classic was lines[11400..11571])

const before = lines.slice(0, I_START);
const classic = lines.slice(I_START, I_END);
const after = lines.slice(I_END);
const im = fs.readFileSync(join(__dirname, 'pdf-immersive-body.jsx'), 'utf8').trimEnd();

const out = [
  ...before,
  "                      {pdfStudyFsView === 'overlay' ? (",
  ...im.split('\n'),
  '                      ) : (',
  ...classic,
  '                      )}',
  ...after,
];
fs.writeFileSync(p, out.join('\n'), 'utf8');
console.log('merged', { linesBefore: before.length, classic: classic.length, after: after.length });
