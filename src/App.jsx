import { useEffect, useState } from 'react';
import ScaledCanvas from './ScaledCanvas.jsx';
import Hero from './sections/Hero.jsx';
import Beneficios from './sections/Beneficios.jsx';
import Trajetoria from './sections/Trajetoria.jsx';
import Oferta from './sections/Oferta.jsx';
import Loading from './sections/Loading.jsx';
import HeroTablet from './sections/tablet/HeroTablet.jsx';
import BeneficiosTablet from './sections/tablet/BeneficiosTablet.jsx';
import TrajetoriaTablet from './sections/tablet/TrajetoriaTablet.jsx';
import OfertaTablet from './sections/tablet/OfertaTablet.jsx';
import HeroMobile from './sections/mobile/HeroMobile.jsx';
import BeneficiosMobile from './sections/mobile/BeneficiosMobile.jsx';
import TrajetoriaMobile from './sections/mobile/TrajetoriaMobile.jsx';
import OfertaMobile from './sections/mobile/OfertaMobile.jsx';

const CTA_HREF = '#inscricao';

// Duração total da intro, do primeiro frame até o último elemento da hero
// entrar. Bate com os 3s do `loader-logo`. Serve só para soltar a rolagem no
// fim — as animações em si são todas CSS.
const LOADING_MS = 3000;

// Abaixo disso entra o layout mobile de 390px.
const MOBILE_BREAKPOINT = 768;

// De 768 até aqui entra o tablet; acima, o desktop de 1440px escalado.
//
// 1024 é o `max-width` do container no design do tablet. Parar exatamente nele
// é o que evita sobrar barra lateral: dentro da faixa o limite nunca chega a
// travar, então o layout sempre preenche a janela.
//
// A contrapartida, decidida com o cliente: de 1024 a ~1440 a página continua
// sendo o desktop encolhido, sem diagramação própria.
const TABLET_MAX = 1024;

// Largura da faixa de sangria que as seções desktop pintam além do canvas.
// Vem dos assets estendidos da hero (Logo-fundo de 2040px de largura) — é até
// onde dá para cobrir a tela sem ampliar nada. Passando disso, o canvas
// inteiro escala junto.
const DESKTOP_BLEED = 2040;

// Altura da hero. Em telas muito largas a escala fica limitada por ela, senão
// a primeira dobra passa da altura da janela e o CTA fica abaixo do corte —
// era o que acontecia em ultrawide 2560x1080.
const HERO_HEIGHT = 1024;

// Piso da escala do desktop. Abaixo disso o texto de 20px da hero cairia de
// 12,4px e a legibilidade custaria mais do que o CTA acima da dobra vale — em
// janela mais baixa que isso, a página volta a rolar.
const DESKTOP_MIN_SCALE = 0.62;

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

// A intro só existe no desktop: o design mobile veio sem ela no handoff.
// Quem pede menos animação também não a vê — são 3s de tela de abertura antes
// do conteúdo, exatamente o que `prefers-reduced-motion` existe para evitar.
// Sem intro, --ld cai para 0 e a hero aparece direto, que é o mesmo caminho do
// prop `showLoading` do design.
function useIntro(enabled) {
  const [intro] = useState(
    () => enabled && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  // Trava a rolagem enquanto a intro roda. O fundo dela é absoluto, ancorado
  // no topo do canvas, então rolar nesses 3s passaria por baixo e mostraria a
  // Benefícios no meio da abertura.
  useEffect(() => {
    if (!intro) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      document.body.style.overflow = previous;
    }, LOADING_MS);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previous;
    };
  }, [intro]);

  return intro;
}

export default function App() {
  const { width: viewportWidth, height: viewportHeight } = useViewport();
  const isMobile = viewportWidth < MOBILE_BREAKPOINT;
  const isTablet = !isMobile && viewportWidth <= TABLET_MAX;
  // A intro é só do desktop: nem o design mobile nem o do tablet a incluem.
  const intro = useIntro(!isMobile && !isTablet);

  if (isMobile) {
    return (
      <ScaledCanvas designWidth={390} viewportWidth={viewportWidth} maxScale={Infinity}>
        <HeroMobile ctaHref={CTA_HREF} />
        <BeneficiosMobile />
        <TrajetoriaMobile />
        <OfertaMobile ctaHref={CTA_HREF} />
      </ScaledCanvas>
    );
  }

  // O tablet não passa pelo ScaledCanvas: ele é fluido de verdade, feito de
  // clamp/vw/flex, e não um canvas de largura fixa escalado. É a única das três
  // versões assim — ver CONTEXTO.md.
  if (isTablet) {
    return (
      <div style={{ width: '100%', maxWidth: `${TABLET_MAX}px`, margin: '0 auto', background: '#160100' }}>
        <HeroTablet ctaHref={CTA_HREF} />
        <BeneficiosTablet />
        <TrajetoriaTablet />
        <OfertaTablet ctaHref={CTA_HREF} />
      </div>
    );
  }

  return (
    <ScaledCanvas
      designWidth={1440}
      viewportWidth={viewportWidth}
      viewportHeight={viewportHeight}
      bleedWidth={DESKTOP_BLEED}
      fitHeight={HERO_HEIGHT}
      minScale={DESKTOP_MIN_SCALE}
    >
      <Hero ctaHref={CTA_HREF} intro={intro} />
      <Beneficios />
      <Trajetoria />
      <Oferta ctaHref={CTA_HREF} />
      {/* Depois das seções de propósito: a .hero tem isolation: isolate, então
          nada de dentro dela passa por cima do resto da página. Aqui, na raiz
          do canvas, o z-index do loading vale contra tudo. */}
      {intro && <Loading />}
    </ScaledCanvas>
  );
}
