import './video-tablet.css';
import { VIDEO_SRC } from '../video-fonte.js';
import { usarPlayer } from '../usar-player.js';

export default function VideoTablet({ ctaHref }) {
  const { video, tocando, progresso, alternar, aoAvancar, aoTerminar } = usarPlayer();

  return (
    <section className="video-t">
      <div className="video-t__kicker">A jornada da nossa capitã</div>
      <h2 className="video-t__title">Waleska Freitas</h2>

      <div className="video-t__stage">
        {VIDEO_SRC && (
          <video
            className="video-t__media"
            ref={video}
            src={VIDEO_SRC}
            playsInline
            preload="metadata"
            onTimeUpdate={aoAvancar}
            onEnded={aoTerminar}
          />
        )}

        {/* Sem fonte não há o que reproduzir: o botão vira um <div>, para não
            oferecer ao teclado e ao leitor de tela um controle que não faz
            nada. Com fonte, volta a ser botão de verdade. */}
        {VIDEO_SRC ? (
          <button
            type="button"
            className="video-t__toggle"
            onClick={alternar}
            aria-label={tocando ? 'Pausar vídeo' : 'Reproduzir vídeo'}
          >
            <span className="video-t__badge">
              {tocando ? (
                <span className="video-t__pause">
                  <span />
                  <span />
                </span>
              ) : (
                <span className="video-t__play" />
              )}
            </span>
          </button>
        ) : (
          <div className="video-t__toggle" aria-hidden="true">
            <span className="video-t__badge">
              <span className="video-t__play" />
            </span>
          </div>
        )}

        <div className="video-t__track">
          <div className="video-t__fill" style={{ width: `${(progresso * 100).toFixed(2)}%` }} />
        </div>
      </div>

      <div className="video-t__rodape">
        <p className="video-t__note">
          O desafio que muda seus hábitos,
          <br />
          com médico e nutri ao seu lado
        </p>

        <a className="video-t__cta" href={ctaHref}>
          Quero entrar agora
        </a>
      </div>
    </section>
  );
}
