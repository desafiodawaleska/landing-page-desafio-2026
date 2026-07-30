import { useEffect, useRef, useState } from 'react';
import './trajetoria-mobile.css';

// Mesmos seis pares do desktop e do tablet — ver comentário em Trajetoria.jsx.
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
const CARD_W = 230;
const PITCH = 252;
const H_SMALL = 283;
const H_BIG = 341;
const IMG_SMALL = 279;
const IMG_BIG = 313;
const FRAME_H = 341;
const TRAVEL = 800;
const OPEN = 560;
const HOLD = 2000;
const CLOSE = 280;

const RAIL = SLIDES.concat(SLIDES, SLIDES);

export default function TrajetoriaMobile() {
  const [index, setIndex] = useState(N);
  const [open, setOpen] = useState(false);
  const [jump, setJump] = useState(false);
  const indexRef = useRef(N);

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
        // Vai até o slide duplicado e volta um loop inteiro com a transição
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

  return (
    <section className="trajetoria-m">
      <div className="trajetoria-m__kicker">Toda a minha</div>
      <h2 className="trajetoria-m__title">Trajetória</h2>

      <div className="trajetoria-m__viewport">
        <div
          className="trajetoria-m__rail"
          style={{
            transform: `translate3d(${195 - CARD_W / 2 - index * PITCH}px,0,0)`,
            transition: jump ? 'none' : `transform ${TRAVEL}ms cubic-bezier(.65,0,.2,1)`,
          }}
        >
          {RAIL.map((slide, i) => {
            const on = i === index && open;
            return (
              <div
                className="trajetoria-m__card"
                key={i}
                style={{
                  width: `${CARD_W}px`,
                  height: `${on ? H_BIG : H_SMALL}px`,
                  marginRight: `${PITCH - CARD_W}px`,
                  transition: `height ${on ? OPEN : CLOSE}ms cubic-bezier(.3,.9,.3,1)`,
                }}
              >
                <div
                  className="trajetoria-m__photo"
                  role="img"
                  aria-label={slide.label}
                  style={{
                    width: `${CARD_W - 4}px`,
                    height: `${on ? IMG_BIG : IMG_SMALL}px`,
                    backgroundImage: `url(${slide.src})`,
                    filter: on ? 'none' : 'brightness(0.8) saturate(0.85)',
                    transition: `height ${on ? OPEN : CLOSE}ms cubic-bezier(.3,.9,.3,1), filter 400ms ease`,
                  }}
                />
                <div
                  className="trajetoria-m__frame"
                  style={{
                    width: `${CARD_W}px`,
                    height: `${on ? FRAME_H : 0}px`,
                    transition: on
                      ? 'height 520ms cubic-bezier(.2,.7,.3,1) 160ms'
                      : 'height 200ms ease-in',
                  }}
                >
                  <img
                    src="/assets/s3/moldura.png"
                    alt=""
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${CARD_W}px`,
                      height: `${FRAME_H}px`,
                    }}
                  />
                </div>
                <div
                  className="trajetoria-m__word"
                  style={{
                    width: `${CARD_W}px`,
                    opacity: on ? 1 : 0,
                    transition: on ? 'opacity 300ms ease 640ms' : 'opacity 140ms ease',
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
