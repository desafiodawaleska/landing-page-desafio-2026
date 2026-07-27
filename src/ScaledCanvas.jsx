import { useEffect, useRef, useState } from 'react';

// Encaixa o canvas de largura fixa na janela via transform: scale(),
// preservando as proporções exatas do design. O invólucro externo recebe a
// altura já escalada — sem isso o documento rolaria pela altura original,
// deixando um vão gigante depois da última seção.
export default function ScaledCanvas({ designWidth, viewportWidth, maxScale = 1, children }) {
  const inner = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const el = inner.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(() => setContentHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = Math.min(viewportWidth / designWidth, maxScale);

  return (
    <div
      style={{
        width: `${designWidth * scale}px`,
        height: `${contentHeight * scale}px`,
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <div
        ref={inner}
        style={{
          width: `${designWidth}px`,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {children}
      </div>
    </div>
  );
}
