import { useEffect, useRef, useState } from 'react';

// Encaixa o canvas de largura fixa na janela via transform: scale(),
// preservando as proporções exatas do design. O invólucro externo ocupa a
// janela inteira e esconde o excesso; as seções pintam camadas de sangria
// além do canvas (até bleedWidth) para não sobrar borda em telas largas.
// A escala trava em 1 enquanto a sangria cobre a janela; só acima de
// bleedWidth ela volta a crescer — assim os PNGs não borram antes da hora.
// O invólucro externo recebe a altura já escalada — sem isso o documento
// rolaria pela altura original, deixando um vão gigante depois da última
// seção.
export default function ScaledCanvas({
  designWidth,
  viewportWidth,
  maxScale = 1,
  bleedWidth,
  children,
}) {
  const inner = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const el = inner.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(() => setContentHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  let scale = Math.min(viewportWidth / designWidth, maxScale);
  if (bleedWidth && viewportWidth > bleedWidth) {
    scale = viewportWidth / bleedWidth;
  }

  return (
    <div
      style={{
        width: '100%',
        height: `${contentHeight * scale}px`,
        overflow: 'hidden',
      }}
    >
      <div
        ref={inner}
        style={{
          width: `${designWidth}px`,
          position: 'relative',
          left: '50%',
          marginLeft: `${-designWidth / 2}px`,
          transform: `scale(${scale})`,
          transformOrigin: '50% 0',
          // Largura da janela convertida para px de canvas. É o que permite
          // ancorar um elemento na borda real da tela (e não na do canvas),
          // como o anel giratório da Oferta.
          '--vw': `${viewportWidth / scale}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
