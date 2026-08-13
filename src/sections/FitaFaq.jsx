import { useEffect, useRef } from 'react';
import './fita-faq.css';
import { HELICE } from './faq-helice.js';

// A foto da Waleska com a fita de texto correndo pela hélice, usada pelas três
// versões da seção. Só o tamanho muda entre elas: o SVG tem viewBox fixo de
// 480x889, então texto, traçado e máscara escalam juntos com o contêiner.
//
// A fita alterna dois pesos, igual ao anel giratório da Oferta: o nome em 500
// e o "30 DIAS" em 800. Os valores saíram de medir a área de tinta de cada
// letra no mockup do design e comparar com a fonte renderizada — ver
// CONTEXTO.md.
const CICLO = [
  { texto: 'DESAFIO DA WALESKA ', peso: 500 },
  { texto: '30 DIAS ', peso: 800 },
];
const REPETICOES = 6;
const CORPO = 24; // font-size, medido no mockup
const TRACKING = 10.8; // letter-spacing, ajustado pelo passo entre letras
const VELOCIDADE = 26; // px por segundo ao longo da hélice

// A fita repete a mesma frase seis vezes. Medindo o comprimento total e
// dividindo por seis chega-se ao passo de uma repetição; deslocar por esse
// passo em módulo faz a sequência voltar ao início sem que se veja o corte.
function useFita(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let passo = 0;
    let raf = 0;
    const medir = () => {
      const total = el.getComputedTextLength();
      return total > 0 ? total / REPETICOES : 0;
    };

    const tick = (t) => {
      // A primeira medição pode sair zerada se a fonte ainda não carregou;
      // por isso ela é refeita a cada quadro até dar um valor útil.
      if (!passo) passo = medir();
      if (passo) {
        const offset = -(((t / 1000) * VELOCIDADE) % passo);
        el.setAttribute('startOffset', offset.toFixed(1));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref]);
}

export default function FitaFaq({ className = '' }) {
  const fita = useRef(null);
  useFita(fita);

  return (
    <div className={`fita-faq ${className}`.trim()}>
      <img className="fita-faq__foto" src="/assets/s4/foto.webp" alt="Waleska" />

      {/* A fita corre por cima da foto, mas some onde cruza o corpo dela: a
          máscara é a silhueta recortada da própria imagem, então o texto
          parece dar a volta por trás. Ver tools/mascara-faq.mjs. */}
      <svg className="fita-faq__svg" viewBox="0 0 480 889" aria-hidden="true">
        <defs>
          <path id="faq-helice" fill="none" d={HELICE} />
          <mask id="faq-corpo" maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="889">
            <image
              href="/assets/s4/mascara-corpo.webp"
              x="0"
              y="0"
              width="480"
              height="889"
              preserveAspectRatio="none"
            />
          </mask>
        </defs>
        <text mask="url(#faq-corpo)" fontSize={CORPO} letterSpacing={TRACKING} fill="#ffffff">
          <textPath ref={fita} href="#faq-helice" startOffset="0">
            {Array.from({ length: REPETICOES }, (_, volta) =>
              CICLO.map((parte) => (
                <tspan key={`${volta}-${parte.peso}`} fontWeight={parte.peso}>
                  {parte.texto}
                </tspan>
              )),
            )}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
