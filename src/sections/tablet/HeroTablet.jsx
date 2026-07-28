import './hero-tablet.css';

// Posições em porcentagem da caixa do grid, não do canvas. É o que mantém os
// quadrados encaixados nas células quando tudo é fluido: a caixa do grid tem
// aspect-ratio 1271/855 fixo, então a grade interna nunca deforma.
const SQUARES = [
  { src: 'quad-1.png', left: 11.17, top: 0, o1: 1, dim: 0.42, dur: 6.4, delay: -0.2 },
  { src: 'quad-2.png', left: 55.55, top: 66.67, o1: 1, dim: 0.3, dur: 7.9, delay: -3.1 },
  { src: 'borda-1.png', left: 22.19, top: 16.61, o1: 0.95, dim: 0.55, dur: 5.6, delay: -1.4 },
  { src: 'borda-2.png', left: 66.64, top: 49.94, o1: 0.92, dim: 0.6, dur: 8.6, delay: -5.2 },
  { src: 'borda-3.png', left: 11.09, top: 66.67, o1: 0.88, dim: 0.5, dur: 7.1, delay: -2.6 },
  { src: 'borda-4.png', left: 88.9, top: 83.27, o1: 0.92, dim: 0.58, dur: 6.9, delay: -4.4 },
];

export default function HeroTablet({ ctaHref }) {
  return (
    <section className="hero-t">
      <img className="hero-t__bg" src="/assets/logo-fundo.png" alt="" />
      <img className="hero-t__light" src="/assets/luz.png" alt="" />
      <div className="hero-t__warm" aria-hidden="true" />
      <img className="hero-t__photo" src="/assets/foto-waleska.png" alt="Waleska" />

      <div className="hero-t__grid" aria-hidden="true">
        <img className="hero-t__grid-img" src="/assets/grid.png" alt="" />
        {SQUARES.map((s) => (
          <img
            key={s.src}
            className="hero-t__square"
            src={`/assets/${s.src}`}
            alt=""
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              '--o1': s.o1,
              '--dim': s.dim,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="hero-t__col">
        <p className="hero-t__kicker">
          <span>Sem fórmula mágica!</span>
          <span>Apenas hábito &amp; constância</span>
        </p>

        <div className="hero-t__title-wrap">
          <img className="hero-t__title" src="/assets/titulo.png" alt="Desafio da Waleska" />
          <div className="hero-t__title-shine" aria-hidden="true" />
        </div>

        <div className="hero-t__days-wrap">
          <img className="hero-t__days" src="/assets/30-dias.png" alt="30 dias" />
          <div className="hero-t__days-shine" aria-hidden="true" />
        </div>

        {/* Sem <br>: aqui o texto reflui dentro de 22ch, ao contrário do
            desktop, onde as três linhas são quebradas na mão. */}
        <p className="hero-t__support">
          O desafio que muda seus hábitos, com médico e nutri ao seu lado
        </p>

        <a className="hero-t__cta" href={ctaHref}>
          Quero participar
        </a>
      </div>
    </section>
  );
}
