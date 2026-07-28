import './hero.css';

const SQUARES = [
  { src: 'quad-1.png', left: 227, top: 85, o1: 1, dim: 0.42, dur: 6.4, delay: -0.2 },
  { src: 'quad-2.png', left: 791, top: 655, o1: 1, dim: 0.3, dur: 7.9, delay: -3.1 },
  { src: 'borda-1.png', left: 367, top: 227, o1: 0.95, dim: 0.55, dur: 5.6, delay: -1.4 },
  { src: 'borda-2.png', left: 932, top: 512, o1: 0.92, dim: 0.6, dur: 8.6, delay: -5.2 },
  { src: 'borda-3.png', left: 226, top: 655, o1: 0.88, dim: 0.5, dur: 7.1, delay: -2.6 },
  { src: 'borda-4.png', left: 1215, top: 797, o1: 0.92, dim: 0.58, dur: 6.9, delay: -4.4 },
];

export default function Hero({ ctaHref, intro = false }) {
  return (
    // --ld vale 1 com a intro ligada e 0 sem ela; é por onde passam todos os
    // atrasos de entrada dos elementos. Com 0 eles caem para zero e a hero
    // aparece direto. O valor não muda depois da montagem — mexer nele no meio
    // faria as animações recalcularem e reiniciarem.
    <section className="hero" style={{ '--ld': intro ? 1 : 0 }}>
      {/* Faixa de sangria de 2040px centrada no canvas: é ela que cobre a
          janela em telas largas. Fundo, luz e foto sangram; o grid entra aqui
          só para manter a ordem da pilha (ele fica sob as camadas de multiply).
          Textos, quadrados e CTA seguem ancorados no canvas de 1440. */}
      <div className="hero__bleed">
        <img className="hero__bg" src="/assets/logo-fundo.png" alt="" />
        <img className="hero__grid" src="/assets/grid.png" alt="" />
        <div className="hero__warm" aria-hidden="true" />
        <img className="hero__photo" src="/assets/hero-foto-wide.png" alt="Waleska" />
        {/* Depois da foto: a luz do canto inferior direito passa por cima dela,
            e não por baixo. Fica entre a foto e os quadrados soltos, que estão
            fora da faixa e continuam no topo da pilha. */}
        <img className="hero__light" src="/assets/luz.png" alt="" />
      </div>

      <div className="hero__squares" aria-hidden="true">
        {SQUARES.map((s) => (
          <img
            key={s.src}
            className="hero__square"
            src={`/assets/${s.src}`}
            alt=""
            style={{
              left: `${s.left}px`,
              top: `${s.top}px`,
              '--o1': s.o1,
              '--dim': s.dim,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="hero__title-wrap">
        <img className="hero__title" src="/assets/titulo.png" alt="Desafio da Waleska" />
        <div className="hero__title-shine" aria-hidden="true" />
      </div>

      <p className="hero__kicker">
        <span>Sem fórmula mágica!</span>
        <span>Apenas hábito &amp; constância</span>
      </p>

      <div className="hero__days-wrap">
        <img className="hero__days" src="/assets/30-dias.png" alt="30 dias" />
        <div className="hero__days-shine" aria-hidden="true" />
      </div>

      <p className="hero__support">
        O desafio que muda seus
        <br />
        hábitos, com médico e
        <br />
        nutri ao seu lado
      </p>

      <a className="cta hero__cta" href={ctaHref}>
        <span>Quero participar</span>
      </a>
    </section>
  );
}
