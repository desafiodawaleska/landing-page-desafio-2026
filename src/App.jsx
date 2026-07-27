import { useEffect, useState } from 'react';
import ScaledCanvas from './ScaledCanvas.jsx';
import Hero from './sections/Hero.jsx';
import Beneficios from './sections/Beneficios.jsx';
import Trajetoria from './sections/Trajetoria.jsx';
import Oferta from './sections/Oferta.jsx';
import HeroMobile from './sections/mobile/HeroMobile.jsx';
import BeneficiosMobile from './sections/mobile/BeneficiosMobile.jsx';
import TrajetoriaMobile from './sections/mobile/TrajetoriaMobile.jsx';
import OfertaMobile from './sections/mobile/OfertaMobile.jsx';

const CTA_HREF = '#inscricao';

// Abaixo disso entra o layout mobile de 390px; acima, o desktop de 1440px
// escalado para caber na janela.
const MOBILE_BREAKPOINT = 768;

// Largura da faixa de sangria que as seções desktop pintam além do canvas.
// Vem dos assets estendidos da hero (Logo-fundo de 2040px de largura) — é até
// onde dá para cobrir a tela sem ampliar nada. Passando disso, o canvas
// inteiro escala junto.
const DESKTOP_BLEED = 2040;

// Altura da hero. Em telas muito largas a escala fica limitada por ela, senão
// a primeira dobra passa da altura da janela e o CTA fica abaixo do corte —
// era o que acontecia em ultrawide 2560x1080.
const HERO_HEIGHT = 1024;

// clientWidth/clientHeight, não innerWidth/innerHeight: innerWidth conta a
// barra de rolagem, e os ~15px de diferença apareceriam como uma tira escura
// na direita quando a página passa a escalar pela sangria.
function useViewport() {
  const read = () => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  });
  const [size, setSize] = useState(read);
  useEffect(() => {
    // ResizeObserver além do evento de resize: quando a barra de rolagem
    // aparece, ela come ~15px de clientWidth sem disparar `resize`, e a faixa
    // de sangria ficava larga demais, jogando a moldura para fora da tela.
    const update = () =>
      setSize((prev) => {
        const next = read();
        return prev.width === next.width && prev.height === next.height ? prev : next;
      });
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);
  return size;
}

export default function App() {
  const { width: viewportWidth, height: viewportHeight } = useViewport();

  if (viewportWidth < MOBILE_BREAKPOINT) {
    return (
      <ScaledCanvas designWidth={390} viewportWidth={viewportWidth} maxScale={Infinity}>
        <HeroMobile ctaHref={CTA_HREF} />
        <BeneficiosMobile />
        <TrajetoriaMobile />
        <OfertaMobile ctaHref={CTA_HREF} />
      </ScaledCanvas>
    );
  }

  return (
    <ScaledCanvas
      designWidth={1440}
      viewportWidth={viewportWidth}
      viewportHeight={viewportHeight}
      bleedWidth={DESKTOP_BLEED}
      fitHeight={HERO_HEIGHT}
    >
      <Hero ctaHref={CTA_HREF} />
      <Beneficios />
      <Trajetoria />
      <Oferta ctaHref={CTA_HREF} />
    </ScaledCanvas>
  );
}
