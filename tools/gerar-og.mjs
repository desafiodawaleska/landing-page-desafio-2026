// Gera o card de compartilhamento (public/og.jpg) remontando a hero.
//
// Não é uma arte nova: são os mesmos assets da seção Hero, nas mesmas
// coordenadas do canvas de 1440x1024, na mesma ordem de camadas e com os
// mesmos modos de mesclagem. O que muda é só o recorte no fim — a hero é
// quase quadrada (1440x1024) e o card é uma faixa larga (1200x630), então
// pega-se uma faixa horizontal dela em vez de espremer tudo.
//
// Manter isso como script (e não um PNG solto em public/) é o que permite
// regerar o card quando a arte da hero mudar, sem redesenhar na mão.
//
//   npm i --no-save sharp && node tools/gerar-og.mjs

import sharp from 'sharp';
import { statSync } from 'node:fs';

const A = 'public/assets';

// O canvas do design. Todas as coordenadas abaixo saem de hero.css /
// Hero.jsx sem conversão — em 1440 as contas de `--vw`/`--lead` devolvem os
// valores originais do design, então é o único ponto em que dá para copiar
// as posições direto.
const W = 1440;
const H = 1024;

// A faixa da hero que vira o card, centrada no bloco de marca: o título
// começa em y=268 e a tag de 30 dias fecha em y=629, então o centro dele é
// 448 — e 81..816 deixa esse centro no meio da faixa, com o mesmo respiro em
// cima e embaixo (160px depois de encolher).
//
// 1400x735 tem exatamente a proporção do card (1,905), então a redução para
// 1200x630 não deforma nada. A direita para em 1440, a borda do canvas: é
// onde a foto termina no design, e cortar antes disso a deixaria sem o ombro.
const RECORTE = { left: 40, top: 81, width: 1400, height: 735 };
const CARD = { width: 1200, height: 630 };

const quadrados = [
  { src: 'quad-1.png', left: 227, top: 85 },
  { src: 'quad-2.png', left: 791, top: 655 },
  { src: 'borda-1.png', left: 367, top: 227 },
  { src: 'borda-2.png', left: 932, top: 512 },
  { src: 'borda-3.png', left: 226, top: 655 },
  { src: 'borda-4.png', left: 1215, top: 797 },
];

const redimensionar = (arquivo, width, height) =>
  sharp(`${A}/${arquivo}`).resize(width, height, { fit: 'fill' }).png().toBuffer();

// Camada de cor cheia, para os `multiply` do design.
const cor = (r, g, b) =>
  sharp({ create: { width: W, height: H, channels: 3, background: { r, g, b } } })
    .png()
    .toBuffer();

const og = async () => {
  // A foto sangra para fora do canvas nos dois eixos (x=499 + 1218 de largura,
  // y=-15). `composite` não aceita deslocamento negativo nem transbordo, então
  // o recorte visível é feito antes.
  const foto = await sharp(`${A}/hero-foto-wide.webp`)
    .resize(1218, 1500, { fit: 'fill' })
    .extract({ left: 0, top: 15, width: W - 499, height: H })
    .png()
    .toBuffer();

  const camadas = [
    // Ordem exata do DOM da hero (ver Hero.jsx): fundo, grid, camada quente,
    // foto, luz, quadrados, e por último o bloco de marca.
    { input: await redimensionar('logo-fundo.webp', W, H), left: 0, top: 0 },
    { input: await redimensionar('grid.png', 1271, 855), left: 85, top: 85 },
    { input: await cor(255, 245, 215), left: 0, top: 0, blend: 'multiply' },
    { input: foto, left: 499, top: 0 },
    { input: await redimensionar('luz.webp', 1216, 660), left: 224, top: 364, blend: 'multiply' },
    ...(await Promise.all(
      quadrados.map(async (q) => ({
        input: await redimensionar(q.src, 142, 143),
        left: q.left,
        top: q.top,
      })),
    )),
    { input: await redimensionar('titulo.png', 729, 310), left: 137, top: 268 },
    { input: await redimensionar('30-dias.png', 217, 57), left: 393, top: 572 },
  ];

  // Duas passagens de propósito: num pipeline só, o sharp aplica `composite`
  // por último — depois de `extract`/`resize` —, então o recorte aconteceria
  // antes das camadas entrarem e elas não caberiam mais na base.
  const heroCompleta = await sharp({
    create: { width: W, height: H, channels: 3, background: '#f6efe9' },
  })
    .composite(camadas)
    .png()
    .toBuffer();

  await sharp(heroCompleta)
    .extract(RECORTE)
    .resize(CARD.width, CARD.height)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile('public/og.jpg');

  const { width, height } = await sharp('public/og.jpg').metadata();
  const kb = (statSync('public/og.jpg').size / 1024).toFixed(0);
  console.log(`public/og.jpg  ${width}x${height}  ${kb} KB`);
};

og();
