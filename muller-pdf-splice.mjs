import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
const p = join(__dirname, 'index.html');
const s = fs.readFileSync(p, 'utf8');
const lines = s.split('\n');
const I_START = 11400;
const I_END_INCL = 11572;
const before = lines.slice(0, I_START);
const classic = lines.slice(I_START, I_END_INCL);
const after = lines.slice(I_END_INCL);
const im = fs.readFileSync(join(__dirname, 'pdf-immersive-body.jsx'), 'utf8');
const imLines = im.split('\n');
if (imLines.length < 2) {
  console.error('immersive empty');
  process.exit(1);
}
// Si ya está inyectado (rama inmersiva con ref en el cuerpo del overlay), abortar
if (lines.slice(11370, 11620).some((l) => l.includes('ref={pdfImmersiveFsRef}'))) {
  console.log('already spliced');
  process.exit(0);
}
const out = [
  ...before,
  "                      {pdfStudyFsView === 'overlay' ? (",
  ...imLines,
  '                      ) : (',
  ...classic,
  '                      )}',
  ...after,
];
fs.writeFileSync(p, out.join('\n'), 'utf8');
console.log('spliced', { before: before.length, classic: classic.length, after: after.length });
