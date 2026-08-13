import { useRef, useState } from 'react';
import './video.css';
import { VIDEO_SRC } from './video-fonte.js';

export default function Video({ ctaHref }) {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const onTimeUpdate = () => {
    const el = video.current;
    if (el && el.duration) setProgress(el.currentTime / el.duration);
  };

  return (
    <section className="video">
      <div className="video__bleed" aria-hidden="true" />

      <div className="video__kicker">A jornada da nossa capitã</div>
      <h2 className="video__title">Waleska Freitas</h2>

      <div className="video__stage">
        {VIDEO_SRC && (
          <video
            className="video__media"
            ref={video}
            src={VIDEO_SRC}
            playsInline
            preload="metadata"
            onTimeUpdate={onTimeUpdate}
            onEnded={() => {
              setPlaying(false);
              setProgress(1);
            }}
          />
        )}

        {/* Sem fonte não há o que reproduzir: o botão vira um <div>, para não
            oferecer ao teclado e ao leitor de tela um controle que não faz
            nada. Com fonte, volta a ser botão de verdade. */}
        {VIDEO_SRC ? (
          <button
            type="button"
            className="video__toggle"
            onClick={togglePlay}
            aria-label={playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}
          >
            <span className="video__badge">
              {playing ? (
                <span className="video__pause">
                  <span />
                  <span />
                </span>
              ) : (
                <span className="video__play" />
              )}
            </span>
          </button>
        ) : (
          <div className="video__toggle" aria-hidden="true">
            <span className="video__badge">
              <span className="video__play" />
            </span>
          </div>
        )}

        <div className="video__track">
          <div className="video__fill" style={{ width: `${(progress * 100).toFixed(2)}%` }} />
        </div>
      </div>

      <p className="video__note">
        O desafio que muda seus hábitos,
        <br />
        com médico e nutri ao seu lado
      </p>

      <a className="cta video__cta" href={ctaHref}>
        Quero entrar agora
      </a>
    </section>
  );
}
