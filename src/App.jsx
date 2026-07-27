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

// clientWidth, não innerWidth: innerWidth conta a barra de rolagem, e os ~15px
// de diferença apareceriam como uma tira escura na direita quando a página
// passa a escalar pela sangria.
function useViewportWidth() {
  const read = () => document.documentElement.clientWidth;
  const [width, setWidth] = useState(read);
  useEffect(() => {
    const onResize = () => setWidth(read());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

export default function App() {
  const viewportWidth = useViewportWidth();

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
    <ScaledCanvas designWidth={1440} viewportWidth={viewportWidth} bleedWidth={DESKTOP_BLEED}>
      <Hero ctaHref={CTA_HREF} />
      <Beneficios />
      <Trajetoria />
      <Oferta ctaHref={CTA_HREF} />
    </ScaledCanvas>
  );
}
