import './video.css';
import { VIDEO_SRC } from './video-fonte.js';
import { usarPlayer } from './usar-player.js';

export default function Video({ ctaHref }) {
  // Mesmo hook do tablet e do mobile. Antes o desktop repetia a lógica aqui,
  // o que contrariava o motivo pelo qual o hook existe.
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
    <section className="video">
      <div className="video__bleed" aria-hidden="true" />

      <div className="video__kicker">A jornada da nossa capitã</div>
      <h2 className="video__title">Waleska Freitas</h2>

      <div className={`video__stage${tocando ? ' is-tocando' : ''}`} ref={palco}>
        {VIDEO_SRC && (
          <video
            className="video__media"
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
            oferecer ao teclado e ao leitor de tela um controle que não faz
            nada. Com fonte, volta a ser botão de verdade. */}
        {VIDEO_SRC ? (
          <button
            type="button"
            className="video__toggle"
            onClick={alternar}
            aria-label={tocando ? 'Pausar vídeo' : 'Reproduzir vídeo'}
          >
            <span className="video__badge">
              {tocando ? (
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

        {/* Só aparece quando o navegador recusou o áudio: o clique aqui é o
            gesto que faltava para o som poder voltar. */}
        {semSom && (
          <button type="button" className="video__som" onClick={ativarSom}>
            Ativar som
          </button>
        )}

        <div className="video__track">
          <div className="video__fill" style={{ width: `${(progresso * 100).toFixed(2)}%` }} />
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
