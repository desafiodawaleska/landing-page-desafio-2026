import './beneficios-mobile.css';

const MARQUEE_ITEMS = Array.from({ length: 4 }).flatMap(() => ['30 dias', 'Desafio da Waleska']);

// Ordem, tamanhos de ícone e quebras de linha do protótipo mobile — todos
// diferem do desktop. O `delay` escalona o `item-pop`, que no celular faz o
// papel do hover.
const BENEFITS = [
  { icon: 'icone-1.png', w: 56, h: 56, delay: 0, lines: ['Consulta com', 'endocrinologista'] },
  { icon: 'icone-4.png', w: 53, h: 53, delay: 1.2, lines: ['Check-ins semanais', 'e sistema de selos'] },
  { icon: 'icone-2.png', w: 56, h: 56, delay: 2.4, lines: ['Grupo exclusivo', 'da turma'] },
  { icon: 'icone-3.png', w: 56, h: 56, delay: 3.6, lines: ['Treinos para', 'fazer em casa'] },
  { icon: 'icone-7.png', w: 56, h: 56, delay: 4.8, lines: ['Cardápio, lista de substituição e receitas'] },
  { icon: 'icone-6.svg', w: 56, h: 57, delay: 6, lines: ['Suporte da equipe', 'durante os 30 dias'] },
  {
    icon: 'icone-5.png',
    w: 56,
    h: 56,
    delay: 7.2,
    largo: true,
    lines: ['Consulta com nutri e plano', 'alimentar individualizado'],
  },
];

export default function BeneficiosMobile() {
  return (
    <section className="beneficios-m">
      <img loading="lazy" decoding="async" className="beneficios-m__glow" src="/assets/s2/gradiente.webp" alt="" />
      <div className="beneficios-m__frame" aria-hidden="true" />

      {/* As duas metades precisam ser idênticas: o `marquee-run` desloca -50%,
          e é isso que faz a emenda passar despercebida. O protótipo trazia a
          segunda com gap e corpo diferentes, o que faria o loop saltar a cada
          volta — desvio deliberado. */}
      <div className="beneficios-m__marquee">
        <div className="beneficios-m__track">
          {[0, 1].map((group) => (
            <div className="beneficios-m__group" key={group} aria-hidden={group === 1}>
              {MARQUEE_ITEMS.map((text, i) => (
                <span key={i}>{text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="beneficios-m__head">
        <div className="beneficios-m__kicker">O que você ganha</div>
        <h2 className="beneficios-m__title">Participando</h2>
      </div>

      <div className="beneficios-m__grid">
        {BENEFITS.map((b) => (
          <div
            className={`benefit-m${b.largo ? ' benefit-m--largo' : ''}`}
            key={b.icon}
            style={{ animationDelay: `${b.delay}s` }}
          >
            <div className="benefit-m__icon">
              <img loading="lazy" decoding="async" src={`/assets/s2/${b.icon}`} alt="" style={{ width: `${b.w}px`, height: `${b.h}px` }} />
            </div>
            <p>
              {b.lines.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
