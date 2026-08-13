import { useEffect, useRef, useState } from 'react';
import './faq.css';
import FitaFaq from './FitaFaq.jsx';
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
  const corpos = useRef([]);
  const [aberto, setAberto] = useState(-1);
  const [medidas, setMedidas] = useState({});
  const [, forcar] = useState(0);

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

      <FitaFaq className="faq__fita" />

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
