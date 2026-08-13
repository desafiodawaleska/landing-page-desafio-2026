import { useEffect, useRef, useState } from 'react';
import './acordeao-faq.css';
import { FAQ_ITENS } from './faq-itens.js';

// Acordeão do FAQ para tablet e mobile.
//
// Aqui a caixa **cresce** ao abrir, ao contrário do desktop, onde ela tem
// altura fixa e as nove linhas se redistribuem para somar sempre o interior.
// Aquele truque existe porque no desktop a caixa divide a altura com a foto
// ao lado; empilhado, não há nada para casar, e espremer nove perguntas mais
// uma resposta num quadro fixo deixaria o texto pequeno demais para o celular
// — que é a principal porta de entrada do projeto.
//
// Tablet e mobile compartilham o componente e as classes; o que muda entre
// eles são tamanhos, escritos em `.faq-t .acordeao__*` e `.faq-m .acordeao__*`.
export default function AcordeaoFaq() {
  const corpos = useRef([]);
  const [aberto, setAberto] = useState(-1);
  const [medidas, setMedidas] = useState({});
  const [, forcar] = useState(0);

  // As alturas dependem da métrica real do texto. Antes da fonte carregar elas
  // saem erradas, então uma renderização a mais depois do `fonts.ready`
  // acerta a conta.
  useEffect(() => {
    if (document.fonts?.ready) document.fonts.ready.then(() => forcar((n) => n + 1));
  }, []);

  // A altura é medida no clique, não na montagem: medir no momento do uso
  // evita guardar um valor tirado antes da fonte.
  const alternar = (i) => {
    const el = corpos.current[i];
    const h = el ? el.scrollHeight : 0;
    if (h) setMedidas((prev) => (prev[i] === h ? prev : { ...prev, [i]: h }));
    setAberto((prev) => (prev === i ? -1 : i));
  };

  return (
    <div className="acordeao">
      {FAQ_ITENS.map((item, i) => {
        const on = i === aberto;
        return (
          <div className="acordeao__item" key={item.q}>
            <button
              type="button"
              className="acordeao__pergunta"
              aria-expanded={on}
              onClick={() => alternar(i)}
            >
              <span className="acordeao__label">{item.q}</span>
              <svg
                className="acordeao__chevron"
                width="14"
                height="9"
                viewBox="0 0 14 9"
                fill="none"
                style={{ transform: on ? 'rotate(180deg)' : 'rotate(0deg)' }}
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

            <div className="acordeao__resposta" style={{ height: `${on ? medidas[i] || 0 : 0}px` }}>
              <div
                className="acordeao__texto"
                ref={(el) => {
                  corpos.current[i] = el;
                }}
                style={{
                  opacity: on ? 1 : 0,
                  transition: on ? 'opacity 300ms ease 140ms' : 'opacity 140ms ease',
                }}
              >
                {item.lead && <p>{item.lead}</p>}
                {item.bullets.map((b) => (
                  <p className="acordeao__bullet" key={b}>
                    {b}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
