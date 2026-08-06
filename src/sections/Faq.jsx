import { useEffect, useRef, useState } from 'react';
import './faq.css';
import { HELICE } from './faq-helice.js';
import { FAQ_ITENS } from './faq-itens.js';

const N = FAQ_ITENS.length;

// Medidas da caixa, tiradas do mockup do design (uploads/P4-4.png): a caixa
// vai de y=268 a y=923, ou seja 656px de altura, e fecha rente ao pé da foto.
// Com borda de 2px e padding vertical de 16px sobram 620px de interior — e é
// essa soma que o acordeão precisa fechar sempre, aberto ou fechado.
const INNER = 620;
const GAP = 13;
const FULL = 57; // altura da pergunta aberta
const THIN = 19; // altura mínima de uma pergunta recolhida

// A fita alterna dois pesos, igual ao anel giratório da Oferta: o nome em 500
// e o "30 DIAS" em 800. Os valores saíram de medir a área de tinta de cada
// letra no mockup e comparar com a fonte renderizada — ver CONTEXTO.md.
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

// Altura de cada linha, com a caixa de altura fixa.
//
// Fechado, as nove perguntas dividem o interior em partes iguais. Aberto, a
// escolhida fica com 57px mais a resposta, e o que sobra é repartido entre as
// oito recolhidas — assim a coluna soma exatamente o interior nos dois
// estados, e a caixa nunca cresce nem sobra faixa vazia no fim.
function alturas(aberto, medidas) {
  const livre = INNER - GAP * (N - 1);
  const fechadoCheio = livre / N;
  if (aberto < 0) return { corpo: 0, cheio: fechadoCheio, fina: fechadoCheio };

  const finas = N - 1;
  const disponivel = livre - FULL - THIN * finas;
  const medida = medidas[aberto] || 0;
  const corpo = Math.min(disponivel, medida || disponivel);
  return { corpo, cheio: FULL, fina: THIN + (disponivel - corpo) / finas, disponivel, medida };
}

export default function Faq() {
  const fita = useRef(null);
  const corpos = useRef([]);
  const [aberto, setAberto] = useState(-1);
  const [medidas, setMedidas] = useState({});
  const [, forcar] = useState(0);

  useFita(fita);

  // As alturas das respostas dependem da métrica real do texto. Antes da fonte
  // carregar elas saem erradas, então uma renderização a mais depois do
  // `fonts.ready` acerta a conta.
  useEffect(() => {
    if (document.fonts?.ready) document.fonts.ready.then(() => forcar((n) => n + 1));
  }, []);

  // A altura é medida no clique, não na montagem: medir no momento do uso
  // evita guardar um valor tirado antes da fonte, e o índice vem do próprio
  // botão clicado.
  const alternar = (i) => {
    const el = corpos.current[i];
    const h = el ? el.scrollHeight : 0;
    if (h) setMedidas((prev) => (prev[i] === h ? prev : { ...prev, [i]: h }));
    setAberto((prev) => (prev === i ? -1 : i));
  };

  const { corpo, cheio, fina, disponivel, medida } = alturas(aberto, medidas);
  // Rolagem só quando a resposta realmente não cabe. Uma barra sempre visível
  // estreitaria o painel e faria o texto refluir depois de já ter sido medido.
  const rola = aberto >= 0 && medida > disponivel;

  return (
    <section className="faq">
      <div className="faq__bleed" aria-hidden="true" />

      <img className="faq__photo" src="/assets/s4/foto.webp" alt="Waleska" />

      {/* A fita corre por cima da foto, mas some onde passa pelo rosto e pelo
          corpo: a máscara abre buracos de borda suave nesses pontos, então o
          texto parece dar a volta por trás dela. */}
      <svg className="faq__fita" viewBox="0 0 480 889" aria-hidden="true">
        <defs>
          <path id="faq-helice" fill="none" d={HELICE} />
          <radialGradient id="faq-buraco">
            <stop offset="84%" stopColor="#000000" stopOpacity="1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <mask id="faq-corpo" maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="889">
            <rect x="0" y="0" width="480" height="889" fill="#ffffff" />
            <ellipse cx="248" cy="338" rx="104" ry="80" fill="url(#faq-buraco)" />
            <ellipse cx="306" cy="252" rx="62" ry="78" fill="url(#faq-buraco)" />
            <ellipse cx="292" cy="584" rx="90" ry="62" fill="url(#faq-buraco)" />
            <ellipse cx="133" cy="452" rx="36" ry="46" fill="url(#faq-buraco)" />
          </mask>
        </defs>
        <text
          mask="url(#faq-corpo)"
          fontSize={CORPO}
          letterSpacing={TRACKING}
          fill="#ffffff"
        >
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

      <div className="faq__col">
        <div className="faq__kicker">FAQ</div>
        <h2 className="faq__title">
          Perguntas
          <br />
          frequentes
        </h2>

        <div className="faq__box">
          {FAQ_ITENS.map((item, i) => {
            const on = i === aberto;
            const inteiro = aberto < 0 || on;
            const alturaPergunta = inteiro ? cheio : fina;
            return (
              <div
                className="faq__item"
                key={item.q}
                style={{ height: `${on ? FULL + corpo : alturaPergunta}px` }}
              >
                <button
                  type="button"
                  className="faq__pergunta"
                  aria-expanded={on}
                  onClick={() => alternar(i)}
                  style={{
                    height: `${alturaPergunta}px`,
                    padding: inteiro ? '10px 22px 10px 18px' : '0 22px 0 18px',
                  }}
                >
                  <span className="faq__label" style={{ fontSize: inteiro ? '18px' : '15px', lineHeight: inteiro ? '22px' : '17px' }}>
                    {item.q}
                  </span>
                  <svg
                    className="faq__chevron"
                    width="14"
                    height="9"
                    viewBox="0 0 14 9"
                    fill="none"
                    style={{ opacity: inteiro ? 1 : 0.65, transform: on ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <path
                      d="M1 1L7 7L13 1"
                      stroke="#ffffff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  className="faq__resposta"
                  style={{ height: `${on ? corpo : 0}px`, overflowY: on && rola ? 'auto' : 'hidden' }}
                >
                  <div
                    className="faq__texto"
                    ref={(el) => {
                      corpos.current[i] = el;
                    }}
                    style={{ opacity: on ? 1 : 0, transition: on ? 'opacity 300ms ease 180ms' : 'opacity 140ms ease' }}
                  >
                    {item.lead && <p>{item.lead}</p>}
                    {item.bullets.map((b) => (
                      <p className="faq__bullet" key={b}>
                        {b}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
