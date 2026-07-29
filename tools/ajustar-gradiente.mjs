// Deriva o radial-gradient da seção Benefícios a partir do gradiente.png.
//
// Rodar da raiz do repositório:  npm i --no-save sharp && node tools/ajustar-gradiente.mjs
//
// Produziu os valores que estão em src/sections/beneficios.css (.beneficios__glow).
// Rode de novo se o PNG mudar, e substitua o bloco inteiro pelo que sair aqui.
//
// Hipótese: elipse centrada no meio de baixo. Para um par de raios (rx, ry), a
// cor média de cada faixa de raio é, por definição, a rampa que minimiza o erro
// quadrático daquele par. Então basta varrer os pares e ficar com o de menor
// erro. O ajuste que gerou o CSS atual fechou em 1,10/255 por canal.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

// fileURLToPath, não .pathname: o caminho do projeto tem espaços, e .pathname
// os devolve como %20, que o sharp não resolve.
const A = fileURLToPath(new URL('../public/assets/', import.meta.url));
const BASE = [30, 1, 0]; // #1e0100, o fundo da seção sob o degradê

const { data, info } = await sharp(`${A}s2/gradiente.png`)
  .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;

// amostra já composta sobre o fundo da seção
const pts = [];
for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) {
  const i = (y * W + x) * 4, a = data[i+3] / 255;
  pts.push([x, y, [0,1,2].map((c) => data[i+c] * a + BASE[c] * (1 - a))]);
}

const NB = 100;
function avalia(rx, ry) {
  const soma = Array.from({ length: NB }, () => [0, 0, 0, 0]);
  for (const [x, y, c] of pts) {
    const b = Math.min(NB - 1, Math.floor(Math.hypot((x - W/2)/rx, (y - H)/ry) * NB));
    soma[b][3]++;
    for (let k = 0; k < 3; k++) soma[b][k] += c[k];
  }
  const ramp = soma.map((s) => (s[3] ? s.slice(0,3).map((v) => v / s[3]) : null));
  for (let b = 1; b < NB; b++) if (!ramp[b]) ramp[b] = ramp[b-1];
  let err = 0;
  for (const [x, y, c] of pts) {
    const b = Math.min(NB - 1, Math.floor(Math.hypot((x - W/2)/rx, (y - H)/ry) * NB));
    for (let k = 0; k < 3; k++) err += Math.abs(ramp[b][k] - c[k]);
  }
  return { err: err / (pts.length * 3), ramp };
}

let best = { err: Infinity };
for (let rx = 1400; rx <= 4200; rx += 25)
  for (let ry = 600; ry <= 1600; ry += 15) {
    const { err } = avalia(rx, ry);
    if (err < best.err) best = { err, rx, ry };
  }

const { ramp } = avalia(best.rx, best.ry);
const hex = (c) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');

console.log(`erro medio ${best.err.toFixed(2)}/255 por canal\n`);
console.log('  background-image: radial-gradient(');
console.log(`    ellipse ${(best.rx/W*100).toFixed(1)}% ${(best.ry/H*100).toFixed(1)}% at 50% 100%,`);
const linhas = [];
for (let b = 0; b <= 95; b += 5) linhas.push(`    ${hex(ramp[Math.min(b, NB-1)])} ${b}%`);
console.log(linhas.join(',\n'));
console.log('  );');
