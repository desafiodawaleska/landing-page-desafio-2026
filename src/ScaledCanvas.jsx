import { useEffect, useRef, useState } from 'react';

// Encaixa o canvas de largura fixa na janela via transform: scale(),
// preservando as proporções exatas do design. O invólucro externo ocupa a
// janela inteira e esconde o excesso; as seções pintam faixas de sangria além
// do canvas para não sobrar borda em telas largas.
//
// A escala trava em 1 enquanto a sangria cobre a janela; só acima de
// bleedWidth ela volta a crescer — assim os PNGs não borram antes da hora.
//
// `fitHeight` (a altura da hero) limita a escala nos dois sentidos: encolhe
// quando a janela é mais baixa que a hero e cresce quando é mais alta. É o que
// mantém o CTA acima da dobra — a maioria das janelas de desktop é mais larga
// e mais baixa que a proporção 1440x1024 do design. `minScale` põe um piso
// nisso, para o texto não ficar ilegível em janela muito baixa.
//
// O invólucro externo recebe a altura já escalada — sem isso o documento
// rolaria pela altura original, deixando um vão gigante depois da última
// seção.
export default function ScaledCanvas({
  designWidth,
  viewportWidth,
  viewportHeight,
  maxScale = 1,
  minScale = 0,
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
  // O ajuste por altura vale nos dois sentidos. Antes ele só agia quando a
  // escala já estava aumentando (`scale > 1`) e nunca descia de 1 — então
  // entre 1440 e 2040 de largura a hero ficava travada em 1024px de altura, e
  // qualquer janela mais baixa que isso cortava o CTA.
  if (fitHeight && viewportHeight) {
    scale = Math.min(scale, Math.max(viewportHeight / fitHeight, minScale));
  }

  return (
    <div
      style={{
        width: '100%',
        height: `${contentHeight * scale}px`,
        // `clip`, não `hidden`: os dois recortam igual, mas `hidden` cria um
        // contêiner rolável, e este aqui tem transbordo de verdade — o
        // `transform: scale()` encolhe o desenho do canvas, não a caixa de
        // layout dele, que continua com a altura original. A sobra é a
        // diferença entre as duas (com 5440 de conteúdo a 0,93 de escala,
        // 361px).
        //
        // Isso importa porque, ao levar uma âncora para a vista (clique num
        // `<a href="#inscricao">` ou URL aberta direto em `/#inscricao`), o
        // navegador rola *todos* os ancestrais roláveis do alvo, não só a
        // janela. Com `hidden` ele empurrava este invólucro para o fim do
        // transbordo: a página inteira subia 361px, cortando o topo da hero
        // e deixando uma faixa vazia do mesmo tamanho no fim — e sem volta,
        // porque `window.scrollTo` mexe na janela, não neste elemento.
        // `clip` recorta sem criar área rolável, então não há o que empurrar.
        overflow: 'clip',
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
