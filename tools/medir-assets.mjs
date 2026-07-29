// Extrai dos PNGs originais os números que hoje estão fixos no CSS.
//
// Rodar da raiz do repositório:  npm i --no-save sharp && node tools/medir-assets.mjs
//
// `sharp` não está no package.json de propósito: só serve para esta análise
// pontual e pesa no install de quem só quer buildar o site.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

// fileURLToPath, não .pathname: o caminho do projeto tem espaços, e .pathname
// os devolve como %20, que o sharp não resolve.
const A = fileURLToPath(new URL('../public/assets/', import.meta.url));

const raw = async (f) => {
  const { data, info } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { d: data, W: info.width, H: info.height };
};
const px = (r, x, y) => { const i = (y * r.W + x) * 4; return [r.d[i], r.d[i+1], r.d[i+2], r.d[i+3]]; };
const hex = (c) => '#' + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

// agrupa índices contíguos numa lista de linhas detectadas
const agrupa = (hits) => {
  if (!hits.length) return [];
  const g = [];
  let cur = [hits[0]];
  for (let i = 1; i < hits.length; i++) {
    if (hits[i] - hits[i-1] <= 2) cur.push(hits[i]); else { g.push(cur); cur = [hits[i]]; }
  }
  g.push(cur);
  return g.map((gr) => (gr[0] + gr[gr.length-1]) / 2);
};

// ---- GRID: célula e cor da linha (usado em hero.css) ----------------------
{
  const g = await raw(`${A}grid.png`);
  const col = [], row = [];
  for (let x = 0; x < g.W; x++) { let s = 0;
    for (let y = 0; y < g.H; y += 3) s += g.d[(y*g.W+x)*4+3];
    if (s / (g.H/3) > 20) col.push(x); }
  for (let y = 0; y < g.H; y++) { let s = 0;
    for (let x = 0; x < g.W; x += 3) s += g.d[(y*g.W+x)*4+3];
    if (s / (g.W/3) > 20) row.push(y); }
  const vs = agrupa(col), hs = agrupa(row);
  // mediana dos intervalos, não a média do total: uma das colunas do PNG é
  // mais fraca e escapa da detecção, e isso puxaria a média para 158,75.
  const passo = (a) => {
    const d = a.slice(1).map((v, i) => v - a[i]).sort((x, y) => x - y);
    return d[Math.floor(d.length / 2)];
  };
  // o vao total dividido pelo numero de celulas; nas linhas horizontais, onde
  // nenhuma escapa da deteccao, e a medida mais fiel (855/6 = 142,5)
  const medio = (a, total) => total / (a.length - 1 + (total - a[a.length-1] > 1 ? 1 : 0));
  console.log(`\n=== grid.png (${g.W}x${g.H}) ===`);
  console.log(`celula (mediana dos intervalos): ${passo(vs).toFixed(2)} x ${passo(hs).toFixed(2)}`);
  console.log(`celula (vao total / n de celulas): ${(g.W/9).toFixed(2)} x ${(g.H/6).toFixed(2)}`);
  console.log(`cor da linha: rgba(${px(g, Math.round(vs[1]), Math.round(g.H/2)).slice(0,3)}, ` +
    `${(px(g, Math.round(vs[1]), Math.round(g.H/2))[3] / 255).toFixed(3)})`);
}

// ---- MOLDURA da seção Benefícios (traço e cor, usados em beneficios.css) --
{
  const b = await raw(`${A}s2/borda.png`);
  const midY = Math.floor(b.H / 2);
  let t = 0; while (b.d[(midY*b.W + t)*4 + 3] > 40) t++;
  console.log(`\n=== s2/borda.png (${b.W}x${b.H}) ===`);
  console.log(`traco: ${t}px   cor: ${hex(px(b, 0, midY))}`);
}

// ---- OPACIDADE dos fundos -------------------------------------------------
// Por que importa: asset semitransparente compoe sobre o que estiver atras.
// Se a cor de base da secao nao cobrir a faixa de sangria inteira, aparece um
// retangulo na largura do canvas. Foi exatamente o bug de 28/07/2026.
//
// A pergunta util nao e "qual o alfa do canto" e sim "esse asset tapa tudo que
// esta atras dele". Por isso o minimo, nao uma amostra.
console.log('\n=== os fundos tapam o que esta atras? ===');
for (const f of ['logo-fundo.png', 'luz.png', 's2/gradiente.png']) {
  const r = await raw(`${A}${f}`);
  let min = 255, soma = 0, n = 0;
  for (let y = 0; y < r.H; y += 2) for (let x = 0; x < r.W; x += 2) {
    const a = r.d[(y*r.W + x)*4 + 3];
    if (a < min) min = a;
    soma += a; n++;
  }
  const opaco = min === 255;
  console.log(`${f.padEnd(20)} alfa min ${String(min).padStart(3)}  medio ${String(Math.round(soma/n)).padStart(3)}  ` +
    `${opaco ? 'opaco' : '>>> NAO tapa: exige cor de base na faixa'}`);
}
