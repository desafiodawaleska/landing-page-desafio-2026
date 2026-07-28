import { useEffect, useRef, useState } from 'react';

// Encaixa o canvas de largura fixa na janela via transform: scale(),
// preservando as proporções exatas do design. O invólucro externo ocupa a
// janela inteira e esconde o excesso; as seções pintam faixas de sangria além
// do canvas para não sobrar borda em telas largas.
//
// A escala trava em 1 enquanto a sangria cobre a janela; só acima de
// bleedWidth ela volta a crescer — assim os PNGs não borram antes da hora.
// Quando cresce, fica limitada pela altura da janela (fitHeight), senão em
// monitor ultrawide a primeira seção fica mais alta que a tela e o CTA some.
// Esse limite nunca reduz a escala abaixo de 1, então telas médias não mudam.
//
// O invólucro externo recebe a altura já escalada — sem isso o documento
// rolaria pela altura original, deixando um vão gigante depois da última
// seção.
export default function ScaledCanvas({
  designWidth,
  viewportWidth,
  viewportHeight,
  maxScale = 1,
  bleedWidth,
  fitHeight,
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
  if (scale > 1 && fitHeight && viewportHeight) {
    scale = Math.min(scale, Math.max(viewportHeight / fitHeight, 1));
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
          // Largura da janela convertida para px de canvas. É o que permite as
          // faixas de sangria acompanharem a tela e ancorar elementos na borda
          // real dela (foto da hero, moldura da S2, anel da Oferta).
          '--vw': `${viewportWidth / scale}px`,
          // A altura pelo mesmo critério. A tela de loading precisa dela: a
          // hero tem 1024px de canvas, mas em janela alta (1280x1024, por
          // exemplo) isso não chega a preencher a tela, e a Benefícios
          // apareceria por baixo do fundo do loading.
          ...(viewportHeight ? { '--vh': `${viewportHeight / scale}px` } : {}),
        }}
      >
        {children}
      </div>
    </div>
  );
}
