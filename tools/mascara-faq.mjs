// Gera a máscara do corpo da Waleska para a fita de texto do FAQ.
//
// Rodar da raiz do repositório:  npm i --no-save sharp && node tools/mascara-faq.mjs
// Escreve public/assets/s4/mascara-corpo.webp — branco onde a fita aparece,
// preto onde ela está na frente.
//
// `sharp` não está no package.json de propósito: só serve para estas análises
// pontuais e pesa no install de quem só quer buildar o site.
//
// Por que não bastam formas geométricas: o protótipo do Claude Design usava
// quatro elipses, e elas erravam nos dois sentidos — escondiam texto sobre o
// fundo e deixavam letra em cima do braço, da mão e da coxa dela.
//
// Por que não basta segmentar por cor: o braço esquerdo dela encosta na sombra
// da montanha e os dois são praticamente pretos; os arbustos ao sol têm
// exatamente a luminância e a temperatura da pele. Então os contornos abaixo
// (traçados à mão sobre a foto com grade) delimitam onde a segmentação pode
// crescer, e dentro deles a cor resolve as bordas finas.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

// fileURLToPath, não .pathname: o caminho do projeto tem espaços, e .pathname
// os devolve como %20, que o sharp não resolve.
const FOTO = fileURLToPath(new URL('../public/assets/s4/foto.webp', import.meta.url));
const SAIDA = fileURLToPath(new URL('../public/assets/s4/mascara-corpo.webp', import.meta.url));

const W = 480;
const H = 889;

const CORPO_PRINCIPAL = [
  [200, 18], [258, 18], [278, 60], [274, 125],
  [302, 142], [325, 172], [352, 222], [382, 282], [404, 342],
  [416, 392], [410, 448], [404, 492], [404, 536], [388, 596],
  [356, 640], [318, 650], [296, 622],
  [300, 664], [310, 724], [318, 776], [320, 828], [302, 856],
  [226, 860], [198, 834], [200, 782], [214, 722],
  [210, 650], [198, 570], [186, 500], [176, 440],
  [170, 380], [160, 300], [150, 220], [156, 140], [178, 60],
];

// O braço esquerdo vai num contorno separado e estreito de propósito. Junto
// ao corpo, ele obrigaria o contorno a englobar a faixa de arbustos entre a
// mão e o quadril — e a segmentação vazaria para lá, comendo o "DESAFI" que
// o design mostra nesse ponto.
const BRACO_ESQUERDO = [
  [186, 150], [156, 150], [140, 215], [118, 285], [100, 348],
  [86, 398], [70, 428], [66, 472], [82, 500], [124, 500],
  [140, 472], [138, 428], [150, 388], [166, 325], [180, 255], [192, 190],
];

// Sementes espalhadas por tronco, membros e pé. A mão esquerda e o tênis que
// ela segura precisam de semente própria: a pulseira e o cadarço brancos
// cortam o caminho do crescimento e deixariam a mão de fora.
const SEMENTES = [
  [240, 300], [230, 480], [250, 650], [330, 470], [225, 200], [255, 790], [215, 100],
  [112, 445], [120, 425], [372, 392], [355, 365],
];

function preencheContorno(pts) {
  const m = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    // varredura por linha: acha os cruzamentos das arestas com esta linha
    const xs = [];
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[(i + 1) % pts.length];
      if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
        xs.push(x1 + ((y - y1) / (y2 - y1)) * (x2 - x1));
      }
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const de = Math.max(0, Math.ceil(xs[k]));
      const ate = Math.min(W - 1, Math.floor(xs[k + 1]));
      for (let x = de; x <= ate; x++) m[y * W + x] = 1;
    }
  }
  return m;
}

function morf(m, r, alvo) {
  const out = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let achou = false;
      for (let dy = -r; dy <= r && !achou; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          if (m[ny * W + nx] === alvo) { achou = true; break; }
        }
      }
      out[y * W + x] = achou ? alvo : 1 - alvo;
    }
  }
  return out;
}

// Inunda o fundo a partir da borda da imagem; o que não for alcançado está
// cercado pelo corpo e é buraco. Um brilho na manga dela abria um vão de
// ~20x25px por onde a letra reapareceria em cima do ombro.
function preencheBuracos(m) {
  const fora = new Uint8Array(W * H);
  const fila = [];
  for (let x = 0; x < W; x++) fila.push([x, 0], [x, H - 1]);
  for (let y = 0; y < H; y++) fila.push([0, y], [W - 1, y]);
  for (const [x, y] of fila) if (!m[y * W + x]) fora[y * W + x] = 1;
  while (fila.length) {
    const [cx, cy] = fila.pop();
    if (!fora[cy * W + cx]) continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const i = ny * W + nx;
      if (!m[i] && !fora[i]) { fora[i] = 1; fila.push([nx, ny]); }
    }
  }
  const out = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) out[i] = m[i] || !fora[i] ? 1 : 0;
  return out;
}

const { data } = await sharp(FOTO).flatten({ background: '#ffffff' }).blur(1.5)
  .raw().toBuffer({ resolveWithObject: true });
const lum = (i) => 0.299 * data[i * 3] + 0.587 * data[i * 3 + 1] + 0.114 * data[i * 3 + 2];
const calor = (i) => data[i * 3] - (data[i * 3 + 1] + data[i * 3 + 2]) / 2;

const a = preencheContorno(CORPO_PRINCIPAL);
const b = preencheContorno(BRACO_ESQUERDO);
const limite = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) limite[i] = a[i] || b[i] ? 1 : 0;

const corpo = new Uint8Array(W * H);
const fila = [...SEMENTES];
for (const [x, y] of fila) corpo[y * W + x] = 1;
while (fila.length) {
  const [cx, cy] = fila.pop();
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = cx + dx;
    const ny = cy + dy;
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const i = ny * W + nx;
    if (corpo[i] || !limite[i]) continue;
    // roupa escura, pele quente, ou o branco da pulseira e dos tênis —
    // o contorno já garante que nada disso é fundo
    const roupa = lum(i) < 46 && calor(i) > -5;
    const pele = lum(i) > 55 && calor(i) > 30;
    const branco = lum(i) > 95 && calor(i) < 25;
    if (roupa || pele || branco) { corpo[i] = 1; fila.push([nx, ny]); }
  }
}

const fechado = preencheBuracos(morf(morf(corpo, 5, 1), 5, 0));
let n = 0;
for (let i = 0; i < W * H; i++) n += fechado[i];
console.log('corpo:', n, 'px (' + Math.round((n / (W * H)) * 100) + '% da foto)');

// Dilato 3px antes de inverter para a letra não raspar na borda dela, e
// desfoco 3px para ela sumir suave em vez de ser cortada a faca.
const dilatado = morf(fechado, 3, 1);
const mascara = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) mascara[i] = dilatado[i] ? 0 : 255;

// Sai em metade da resolução e em WebP: a máscara já é desfocada, então não
// há detalhe a perder, e o SVG a estica de volta com suavização.
const info = await sharp(mascara, { raw: { width: W, height: H, channels: 1 } })
  .blur(3)
  .resize(Math.round(W / 2), Math.round(H / 2))
  .webp({ quality: 80, effort: 6 })
  .toFile(SAIDA);
console.log('máscara:', info.width + 'x' + info.height, Math.round(info.size / 1024) + ' kB');
