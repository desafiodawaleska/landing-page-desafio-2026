import './video-mobile.css';
import { VIDEO_SRC } from '../video-fonte.js';
import { usarPlayer } from '../usar-player.js';
import { CTA_ATTRS } from '../../config.js';

export default function VideoMobile({ ctaHref }) {
  const {
    video,
    palco,
    tocando,
    progresso,
    semSom,
    alternar,
    ativarSom,
    aoAvancar,
    aoTocar,
    aoPausar,
    aoTerminar,
  } = usarPlayer();

  return (
    <section className="video-m">
      <div className="video-m__kicker">A jornada da nossa capitã</div>
      <h2 className="video-m__title">Waleska Freitas</h2>

      <div className={`video-m__stage${tocando ? ' is-tocando' : ''}`} ref={palco}>
        {VIDEO_SRC && (
          <video
            className="video-m__media"
            ref={video}
            src={VIDEO_SRC}
            playsInline
            preload="metadata"
            onTimeUpdate={aoAvancar}
            onPlay={aoTocar}
            onPause={aoPausar}
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

        {/* Só aparece quando o navegador recusou o áudio: o clique aqui é o
            gesto que faltava para o som poder voltar. */}
        {semSom && (
          <button type="button" className="video-m__som" onClick={ativarSom}>
            Ativar som
          </button>
        )}

        <div className="video-m__track">
          <div className="video-m__fill" style={{ width: `${(progresso * 100).toFixed(2)}%` }} />
        </div>
      </div>

      <p className="video-m__note">
        O desafio que muda seus hábitos, com médico e nutri ao seu lado
      </p>

      <a className="cta video-m__cta" href={ctaHref} {...CTA_ATTRS}>
        Quero entrar agora
      </a>
    </section>
  );
}
