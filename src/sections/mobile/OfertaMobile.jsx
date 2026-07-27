import { useRef } from 'react';
import './oferta-mobile.css';

const PRICE = 'R$297';

export default function OfertaMobile({ ctaHref }) {
  const bgPhoto = useRef(null);
  const cutPhoto = useRef(null);

  const setTransform = (value) => {
    if (bgPhoto.current) bgPhoto.current.style.transform = value;
    if (cutPhoto.current) cutPhoto.current.style.transform = value;
  };

  const onMouseMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const dx = ((e.clientX - box.left) / box.width - 0.5) * -14;
    const dy = ((e.clientY - box.top) / box.height - 0.5) * -8;
    setTransform(`translate3d(${dx.toFixed(1)}px,${dy.toFixed(1)}px,0)`);
  };

  return (
    <section
      className="oferta-m"
      onMouseMove={onMouseMove}
      onMouseLeave={() => setTransform('translate3d(0,0,0)')}
    >
      <div className="oferta-m__card" />

      <div className="oferta-m__photos">
        <div className="oferta-m__photo-box">
          <img className="oferta-m__photo-bg" ref={bgPhoto} src="/assets/s5/foto-cf-ext.png" alt="" />
        </div>
        <img
          className="oferta-m__photo-cut"
          ref={cutPhoto}
          src="/assets/s5/foto-sf.png"
          alt="Waleska"
        />
      </div>

      <div className="oferta-m__kicker">Faça parte do desafio, por apenas</div>

      <div className="oferta-m__price">
        <span>{PRICE}</span>
      </div>
      <div className="oferta-m__price-shine" aria-hidden="true">
        <span>{PRICE}</span>
      </div>

      <a className="cta oferta-m__cta" href={ctaHref}>
        <span>Quero entrar agora</span>
      </a>

      <div className="oferta-m__note">As vagas da turma são limitadas. Garanta a sua.</div>

      <img className="oferta-m__ring" src="/assets/s5/ring-text.svg" alt="" aria-hidden="true" />
    </section>
  );
}
