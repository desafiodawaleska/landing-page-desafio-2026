import './video-mobile.css';
import { VIDEO_SRC } from '../video-fonte.js';
import { usarPlayer } from '../usar-player.js';

export default function VideoMobile({ ctaHref }) {
  const { video, tocando, progresso, alternar, aoAvancar, aoTerminar } = usarPlayer();

  return (
    <section className="video-m">
      <div className="video-m__kicker">A jornada da nossa capitã</div>
      <h2 className="video-m__title">Waleska Freitas</h2>

      <div className="video-m__stage">
        {VIDEO_SRC && (
          <video
            className="video-m__media"
            ref={video}
            src={VIDEO_SRC}
            playsInline
            preload="metadata"
            onTimeUpdate={aoAvancar}
            onEnded={aoTerminar}
          />
        )}

        {/* Sem fonte não há o que reproduzir: o botão vira um <div>, para não
            oferecer ao leitor de tela um controle que não faz nada. */}
        {VIDEO_SRC ? (
          <button
            type="button"
            className="video-m__toggle"
            onClick={alternar}
            aria-label={tocando ? 'Pausar vídeo' : 'Reproduzir vídeo'}
          >
            <span className="video-m__badge">
              {tocando ? (
                <span className="video-m__pause">
                  <span />
                  <span />
                </span>
              ) : (
                <span className="video-m__play" />
              )}
            </span>
          </button>
        ) : (
          <div className="video-m__toggle" aria-hidden="true">
            <span className="video-m__badge">
              <span className="video-m__play" />
            </span>
          </div>
        )}

        <div className="video-m__track">
          <div className="video-m__fill" style={{ width: `${(progresso * 100).toFixed(2)}%` }} />
        </div>
      </div>

      <p className="video-m__note">
        O desafio que muda seus hábitos, com médico e nutri ao seu lado
      </p>

      <a className="cta video-m__cta" href={ctaHref}>
        Quero entrar agora
      </a>
    </section>
  );
}
