import './beneficios-tablet.css';

const MARQUEE_ITEMS = Array.from({ length: 4 }).flatMap(() => [
  '30 dias',
  'Desafio da Waleska',
]);

// Aqui os textos não vêm quebrados na mão como no desktop — a caixa tem
// largura fluida e o texto reflui sozinho.
const BENEFITS = [
  { icon: 'icone-1.png', label: 'Consulta com endocrinologista' },
  { icon: 'icone-2.png', label: 'Grupo exclusivo da turma' },
  { icon: 'icone-3.png', label: 'Treinos para fazer em casa' },
  // Único ícone que não preenche a caixa: o desenho dele tem 92px, não 100.
  { icon: 'icone-4.png', label: 'Check-ins semanais e sistema de selos', short: true },
  { icon: 'icone-5.png', label: 'Consulta com nutricionista e plano alimentar individualizado' },
  { icon: 'icone-6.svg', label: 'Suporte da equipe durante os 30 dias' },
  { icon: 'icone-7.png', label: 'Cardápio, lista de substituição e receitas' },
];

export default function BeneficiosTablet() {
  return (
    <section className="beneficios-t">
      <div className="marquee-t">
        <div className="marquee-t__track">
          {[0, 1].map((group) => (
            <div className="marquee-t__group" key={group} aria-hidden={group === 1}>
              {MARQUEE_ITEMS.map((text, i) => (
                <span key={i}>{text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Degradê e moldura em CSS, como no desktop. O protótipo estica
          gradiente.png e borda.png a 100%x100%, mas esticar a moldura deixa o
          traço mais grosso na horizontal que na vertical. */}
      <div className="beneficios-t__bg" aria-hidden="true">
        <div className="beneficios-t__glow" />
        <div className="beneficios-t__frame" />
      </div>

      <div className="beneficios-t__content">
        <div className="beneficios-t__head">
          <div className="beneficios-t__kicker">O que você ganha</div>
          <h2 className="beneficios-t__title">Participando</h2>
        </div>

        <div className="beneficios-t__items">
          {BENEFITS.map((b) => (
            <div className="benefit-t" key={b.icon}>
              <div className="benefit-t__icon">
                <img src={`/assets/s2/${b.icon}`} alt="" className={b.short ? 'is-short' : ''} />
              </div>
              <p>{b.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
