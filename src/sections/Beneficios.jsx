import './beneficios.css';

const MARQUEE_ITEMS = Array.from({ length: 5 }).flatMap(() => [
  '30 dias',
  'Desafio da Waleska',
]);

const BENEFITS = [
  {
    left: 136,
    top: 401,
    icon: 'icone-1.png',
    iconSize: 100,
    boxHeight: 100,
    gap: 22,
    lines: ['Consulta com', 'endocrinologista'],
  },
  {
    left: 408,
    top: 401,
    icon: 'icone-2.png',
    iconSize: 100,
    boxHeight: 100,
    gap: 22,
    lines: ['Grupo exclusivo', 'da turma'],
  },
  {
    left: 669,
    top: 401,
    icon: 'icone-3.png',
    iconSize: 100,
    boxHeight: 100,
    gap: 22,
    lines: ['Treinos para', 'fazer em casa'],
  },
  {
    left: 950,
    top: 401,
    icon: 'icone-4.png',
    iconSize: 92,
    boxHeight: 100,
    gap: 22,
    lines: ['Check-ins semanais', 'e sistema de selos'],
  },
  {
    left: 206,
    top: 631,
    icon: 'icone-5.png',
    iconSize: 100,
    boxHeight: 116,
    gap: 15,
    lines: ['Consulta com nutricionista e', 'plano alimentar individualizado'],
  },
  {
    left: 592,
    top: 631,
    icon: 'icone-6.svg',
    iconWidth: 114,
    iconSize: 116,
    boxHeight: 116,
    gap: 15,
    lines: ['Suporte da equipe', 'durante os 30 dias'],
  },
  {
    left: 937,
    top: 631,
    icon: 'icone-7.png',
    iconSize: 100,
    boxHeight: 116,
    gap: 15,
    lines: ['Cardápio, lista de', 'substituição e receitas'],
  },
];

export default function Beneficios() {
  return (
    <section className="beneficios">
      <img className="beneficios__glow" src="/assets/s2/gradiente.png" alt="" />
      <img className="beneficios__frame" src="/assets/s2/borda.png" alt="" />

      <div className="marquee">
        <div className="marquee__track">
          {[0, 1].map((group) => (
            <div className="marquee__group" key={group} aria-hidden={group === 1}>
              {MARQUEE_ITEMS.map((text, i) => (
                <span key={i}>{text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="beneficios__kicker">O que você ganha</div>
      <h2 className="beneficios__title">Participando</h2>

      {BENEFITS.map((b) => (
        <div className="benefit" key={b.icon} style={{ left: `${b.left}px`, top: `${b.top}px` }}>
          <div className="benefit__icon" style={{ height: `${b.boxHeight}px` }}>
            <img
              src={`/assets/s2/${b.icon}`}
              alt=""
              style={{
                width: `${b.iconWidth ?? b.iconSize}px`,
                height: `${b.iconSize}px`,
              }}
            />
          </div>
          <p style={{ marginTop: `${b.gap}px` }}>
            {b.lines[0]}
            <br />
            {b.lines[1]}
          </p>
        </div>
      ))}
    </section>
  );
}
