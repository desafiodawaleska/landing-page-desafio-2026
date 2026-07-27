import './beneficios-mobile.css';

const MARQUEE_ITEMS = Array.from({ length: 4 }).flatMap(() => [
  '30 dias',
  'Desafio da Waleska',
]);

// Ordem e quebras de linha do design mobile — difere do desktop.
const BENEFITS = [
  { icon: 'icone-1.png', lines: ['Consulta com', 'endocrinologista'] },
  { icon: 'icone-5.png', lines: ['Consulta com nutri e plano alimentar individualizado'] },
  { icon: 'icone-2.png', lines: ['Grupo exclusivo', 'da turma'] },
  { icon: 'icone-3.png', lines: ['Treinos para', 'fazer em casa'] },
  { icon: 'icone-7.png', lines: ['Cardápio, lista de substituição e receitas'] },
  { icon: 'icone-6.svg', lines: ['Suporte da equipe', 'durante os 30 dias'], height: 65 },
  { icon: 'icone-4.png', lines: ['Check-ins semanais', 'e sistema de selos'], size: 60, wide: true },
];

export default function BeneficiosMobile() {
  return (
    <section className="beneficios-m">
      <img className="beneficios-m__glow" src="/assets/s2/gradiente.png" alt="" />
      <div className="beneficios-m__frame" aria-hidden="true" />

      <div className="marquee-m">
        <div className="marquee-m__track">
          {[0, 1].map((group) => (
            <div className="marquee-m__group" key={group} aria-hidden={group === 1}>
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
          <div className={`benefit-m${b.wide ? ' benefit-m--wide' : ''}`} key={b.icon}>
            <div className="benefit-m__icon">
              <img
                src={`/assets/s2/${b.icon}`}
                alt=""
                style={{ width: `${b.size ?? 64}px`, height: `${b.height ?? b.size ?? 64}px` }}
              />
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
