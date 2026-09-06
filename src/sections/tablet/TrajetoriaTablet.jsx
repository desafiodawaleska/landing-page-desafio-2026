import { useEffect, useRef, useState } from 'react';
import './trajetoria-tablet.css';

// Mesmos seis pares do desktop e do mobile — ver comentário em Trajetoria.jsx.
const SLIDES = [
  { src: '/assets/s3/antes-1.webp', label: 'Antes' },
  { src: '/assets/s3/depois-1.webp', label: 'Depois' },
  { src: '/assets/s3/antes-2.webp', label: 'Antes' },
  { src: '/assets/s3/depois-2.webp', label: 'Depois' },
  { src: '/assets/s3/antes-3.webp', label: 'Antes' },
  { src: '/assets/s3/depois-3.webp', label: 'Depois' },
  { src: '/assets/s3/antes-4.webp', label: 'Antes' },
  { src: '/assets/s3/depois-4.webp', label: 'Depois' },
  { src: '/assets/s3/antes-5.webp', label: 'Antes' },
  { src: '/assets/s3/depois-5.webp', label: 'Depois' },
  { src: '/assets/s3/antes-6.webp', label: 'Antes' },
  { src: '/assets/s3/depois-6.webp', label: 'Depois' },
];

const N = SLIDES.length;
const TRAVEL = 900;
const OPEN = 620;
const HOLD = 2000;
const CLOSE = 300;

// Proporções tiradas do card do desktop, que tem 329px de largura. Como aqui a
// largura é fluida, tudo que era medida fixa virou razão.
const R_CLOSED = 405 / 329;
const R_OPEN = 488 / 329;
const R_IMG_CLOSED = 399 / 329;
const R_IMG_OPEN = 448 / 329;
const R_INSET = 3 / 329;
const R_PITCH = 354 / 329;

const RAIL = SLIDES.concat(SLIDES, SLIDES);

export default function TrajetoriaTablet() {
  const [index, setIndex] = useState(N);
  const [open, setOpen] = useState(false);
  const [jump, setJump] = useState(false);
  const [railWidth, setRailWidth] = useState(768);
  const indexRef = useRef(N);
  const railBox = useRef(null);

  // ResizeObserver, não o evento de resize: quando a barra de rolagem aparece
  // ela come ~15px de clientWidth sem disparar `resize`, e o trilho ficaria
  // centrado no lugar errado. Mesma lição registrada no CONTEXTO.md.
  useEffect(() => {
    const el = railBox.current;
    if (!el) return undefined;
    const update = () => setRailWidth((prev) => (prev === el.clientWidth ? prev : el.clientWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timers = [];
    const later = (ms, fn) => timers.push(setTimeout(fn, ms));

    const expand = () => {
      setOpen(true);
      later(OPEN + HOLD, collapse);
    };
    const collapse = () => {
      setOpen(false);
      later(CLOSE, advance);
    };
    const advance = () => {
      const next = indexRef.current + 1;
      indexRef.current = next;
      setIndex(next);
      setJump(false);
      if (next >= N * 2) {
        // Anda até o slide duplicado e volta uma volta inteira com a transição
        // desligada, para o trilho nunca rebobinar na tela.
        later(TRAVEL, () => {
          indexRef.current = next - N;
          setIndex(next - N);
          setJump(true);
          later(40, () => {
            setJump(false);
            expand();
          });
        });
      } else {
        later(TRAVEL, expand);
      }
    };

    later(500, expand);
    return () => timers.forEach(clearTimeout);
  }, []);

  const cardW = Math.round(Math.min(300, Math.max(186, railWidth * 0.31)));
  const pitch = Math.round(cardW * R_PITCH);

  return (
    <section className="trajetoria-t">
      <div className="trajetoria-t__head">
        <div className="trajetoria-t__kicker">Toda a minha</div>
        <h2 className="trajetoria-t__title">Trajetória</h2>
      </div>

      <div
        className="trajetoria-t__viewport"
        ref={railBox}
        style={{ height: `${Math.round(cardW * R_OPEN + 14)}px` }}
      >
        <div
          className="trajetoria-t__rail"
          style={{
            transform: `translate3d(${Math.round(railWidth / 2 - cardW / 2 - index * pitch)}px,0,0)`,
            transition: jump ? 'none' : `transform ${TRAVEL}ms cubic-bezier(.65,0,.2,1)`,
          }}
        >
          {RAIL.map((slide, i) => {
            const on = i === index && open;
            return (
              <div
                className="trajetoria-t__card"
                key={i}
                style={{
                  width: `${cardW}px`,
                  height: `${Math.round(cardW * (on ? R_OPEN : R_CLOSED))}px`,
                  marginRight: `${pitch - cardW}px`,
                  transition: `height ${on ? OPEN : CLOSE}ms cubic-bezier(.3,.9,.3,1)`,
                }}
              >
                <div
                  className="trajetoria-t__photo"
                  role="img"
                  aria-label={slide.label}
                  style={{
                    left: `${Math.round(cardW * R_INSET)}px`,
                    top: `${Math.round(cardW * R_INSET)}px`,
                    width: `${Math.round(cardW * (1 - R_INSET * 2))}px`,
                    height: `${Math.round(cardW * (on ? R_IMG_OPEN : R_IMG_CLOSED))}px`,
                    backgroundImage: `url(${slide.src})`,
                    filter: on ? 'none' : 'brightness(0.8) saturate(0.85)',
                    transition: `height ${on ? OPEN : CLOSE}ms cubic-bezier(.3,.9,.3,1), filter 400ms ease`,
                  }}
                />
                <div
                  className="trajetoria-t__frame"
                  style={{
                    width: `${cardW}px`,
                    height: `${on ? Math.round(cardW * R_OPEN) : 0}px`,
                    transition: on
                      ? 'height 560ms cubic-bezier(.2,.7,.3,1) 180ms'
                      : 'height 200ms ease-in',
                  }}
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src="/assets/s3/moldura.png"
                    alt=""
                    style={{ width: `${cardW}px`, height: `${Math.round(cardW * R_OPEN)}px` }}
                  />
                </div>
                <div
                  className="trajetoria-t__word"
                  style={{
                    width: `${cardW}px`,
                    fontSize: `${Math.max(13, Math.round(cardW * 0.067))}px`,
                    opacity: on ? 1 : 0,
                    transition: on ? 'opacity 300ms ease 700ms' : 'opacity 140ms ease',
                  }}
                >
                  {slide.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
