import { useEffect, useRef, useState } from 'react';
import './trajetoria.css';

const SLIDES = [
  { src: '/assets/s3/antes-1.png', label: 'Antes' },
  { src: '/assets/s3/depois-1.png', label: 'Depois' },
  { src: '/assets/s3/antes-2.png', label: 'Antes' },
  { src: '/assets/s3/depois-2.png', label: 'Depois' },
  { src: '/assets/s3/antes-3.png', label: 'Antes' },
  { src: '/assets/s3/depois-3.png', label: 'Depois' },
];

const N = SLIDES.length;
const PITCH = 354;
const CARD_W = 329;
const TRAVEL = 900;
const OPEN = 620;
const HOLD = 2000;
const CLOSE = 300;

const RAIL = SLIDES.concat(SLIDES, SLIDES);

export default function Trajetoria() {
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
        // Travel to the duplicated slide, then snap back a full loop with the
        // transition disabled so the rail never rewinds on screen.
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
    <section className="trajetoria">
      <div className="trajetoria__kicker">Toda a minha</div>
      <h2 className="trajetoria__title">Trajetória</h2>

      <div className="trajetoria__viewport">
        <div
          className="trajetoria__rail"
          style={{
            transform: `translate3d(${720 - CARD_W / 2 - index * PITCH}px,0,0)`,
            transition: jump ? 'none' : `transform ${TRAVEL}ms cubic-bezier(.65,0,.2,1)`,
          }}
        >
          {RAIL.map((slide, i) => {
            const on = i === index && open;
            return (
              <div
                className="trajetoria__card"
                key={i}
                style={{
                  width: `${CARD_W}px`,
                  height: `${on ? 488 : 405}px`,
                  marginRight: `${PITCH - CARD_W}px`,
                  transition: `height ${on ? OPEN : CLOSE}ms cubic-bezier(.3,.9,.3,1)`,
                }}
              >
                <div
                  className="trajetoria__photo"
                  role="img"
                  aria-label={slide.label}
                  style={{
                    width: `${CARD_W - 6}px`,
                    height: `${on ? 448 : 399}px`,
                    backgroundImage: `url(${slide.src})`,
                    filter: on ? 'none' : 'brightness(0.8) saturate(0.85)',
                    transition: `height ${on ? OPEN : CLOSE}ms cubic-bezier(.3,.9,.3,1), filter 400ms ease`,
                  }}
                />
                <div
                  className="trajetoria__frame"
                  style={{
                    width: `${CARD_W}px`,
                    height: `${on ? 488 : 0}px`,
                    transition: on
                      ? 'height 560ms cubic-bezier(.2,.7,.3,1) 180ms'
                      : 'height 200ms ease-in',
                  }}
                >
                  <img
                    src="/assets/s3/moldura.png"
                    alt=""
                    style={{ position: 'absolute', left: 0, top: 0, width: '329px', height: '488px' }}
                  />
                </div>
                <div
                  className="trajetoria__word"
                  style={{
                    width: `${CARD_W}px`,
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
