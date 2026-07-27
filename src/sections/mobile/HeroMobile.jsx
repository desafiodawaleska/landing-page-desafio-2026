import './hero-mobile.css';

const SQUARES = [
  { src: 'quad-1.png', left: 150, top: 22, o1: 1, dim: 0.42, dur: 6.4, delay: -0.2 },
  { src: 'borda-1.png', left: 215, top: 87, o1: 0.95, dim: 0.55, dur: 5.6, delay: -1.4 },
  { src: 'quad-2.png', left: 280, top: 218, o1: 1, dim: 0.3, dur: 7.9, delay: -3.1 },
  { src: 'borda-3.png', left: 20, top: 283, o1: 0.88, dim: 0.5, dur: 7.1, delay: -2.6 },
  { src: 'borda-4.png', left: 305, top: 348, o1: 0.92, dim: 0.58, dur: 6.9, delay: -4.4 },
];

export default function HeroMobile({ ctaHref }) {
  return (
    <section className="hero-m">
      <img className="hero-m__bg" src="/assets/logo-fundo.png" alt="" />
      <div className="hero-m__grid" aria-hidden="true" />
      <div className="hero-m__warm" aria-hidden="true" />

      {SQUARES.map((s) => (
        <img
          key={s.src}
          className="hero-m__square"
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

      <p className="hero-m__kicker">
        <span>Sem fórmula mágica!</span>
        <span>Apenas hábito &amp; constância</span>
      </p>

      <div className="hero-m__title-wrap">
        <img className="hero-m__title" src="/assets/titulo.png" alt="Desafio da Waleska" />
        <div className="hero-m__title-shine" aria-hidden="true" />
      </div>

      <div className="hero-m__days-wrap">
        <img className="hero-m__days" src="/assets/30-dias.png" alt="30 dias" />
        <div className="hero-m__days-shine" aria-hidden="true" />
      </div>

      <p className="hero-m__support">
        O desafio que muda
        <br />
        seus hábitos, com médico
        <br />
        e nutri ao seu lado
      </p>

      <a className="cta hero-m__cta" href={ctaHref}>
        <span>Quero participar</span>
      </a>

      <div className="hero-m__photo-box">
        <img className="hero-m__photo" src="/assets/foto-waleska.png" alt="Waleska" />
        <img className="hero-m__light" src="/assets/luz.png" alt="" />
      </div>
    </section>
  );
}
