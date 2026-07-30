import './hero-mobile.css';

// Posições do protótipo `Hero Desafio Waleska Mobile.dc.html`. São três
// quadrados cheios agora (o desktop tem dois) e quatro em outline.
const SQUARES = [
  { src: 'quad-1.png', left: 301, top: 35, o1: 1, dim: 0.42, dur: 6.4, delay: -0.2 },
  { src: 'quad-2.png', left: 35, top: 142, o1: 1, dim: 0.34, dur: 7.9, delay: -3.1 },
  { src: 'quad-3.png', left: 302, top: 299, o1: 1, dim: 0.3, dur: 7.2, delay: -1.1 },
  { src: 'borda-1.png', left: 88, top: 88, o1: 0.95, dim: 0.55, dur: 5.6, delay: -1.4 },
  { src: 'borda-2.png', left: 248, top: 248, o1: 0.92, dim: 0.6, dur: 8.6, delay: -5.2 },
  { src: 'borda-3.png', left: 88, top: 351, o1: 0.88, dim: 0.5, dur: 7.1, delay: -2.6 },
  { src: 'borda-4.png', left: 35, top: 562, o1: 0.92, dim: 0.58, dur: 6.9, delay: -4.4 },
];

export default function HeroMobile({ ctaHref, intro = false }) {
  return (
    // --ld comanda todos os tempos da abertura de uma vez: 1 roda a intro
    // inteira, 0 a desliga, e frações a encurtam. Aqui vem 0,5 do App, metade
    // do desktop. O valor não muda depois da montagem — mexer nele no meio
    // faria as animações recalcularem e reiniciarem.
    <section className="hero-m" style={{ '--ld': intro ? 0.5 : 0 }}>
      <img className="hero-m__bg" src="/assets/m/logo-fundo.webp" alt="" />
      <div className="hero-m__warm" aria-hidden="true" />
      <img className="hero-m__grid" src="/assets/m/grid.png" alt="" />

      <img className="hero-m__photo" src="/assets/m/foto-waleska.webp" alt="Waleska" />
      {/* Depois da foto: a luz passa por cima dela, como no desktop. */}
      <img className="hero-m__light" src="/assets/m/luz.webp" alt="" />

      <div className="hero-m__squares" aria-hidden="true">
        {SQUARES.map((s) => (
          <img
            key={s.src}
            className="hero-m__square"
            src={`/assets/m/${s.src}`}
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

      <p className="hero-m__kicker">
        <span>Sem fórmula mágica!</span>
        <span>Apenas hábito &amp;</span>
        <span>Constância</span>
      </p>

      <div className="hero-m__title-wrap">
        <img className="hero-m__title" src="/assets/m/titulo.webp" alt="Desafio da Waleska" />
        <div className="hero-m__title-shine" aria-hidden="true" />
      </div>

      <div className="hero-m__days-wrap">
        <img className="hero-m__days" src="/assets/m/30-dias.png" alt="30 dias" />
        <div className="hero-m__days-shine" aria-hidden="true" />
      </div>

      <p className="hero-m__support">
        O desafio que muda seus hábitos,
        <br />
        com médico e nutri ao seu lado
      </p>

      <a className="cta hero-m__cta" href={ctaHref}>
        <span>Quero participar</span>
      </a>

      {/* A abertura do mobile mora dentro da hero, diferente do desktop: sem o
          fundo escuro cobrindo a página, o `isolation: isolate` da seção não
          atrapalha. */}
      {intro && (
        <div className="hero-m__loader" aria-hidden="true">
          <img src="/assets/loading/titulo-vetor.svg" alt="" />
          <div className="hero-m__loader-shine" />
        </div>
      )}
    </section>
  );
}
