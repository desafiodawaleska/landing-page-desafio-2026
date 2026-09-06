import { useEffect, useState } from 'react';
import { CTA_HREF } from './config.js';
import ScaledCanvas from './ScaledCanvas.jsx';
import Hero from './sections/Hero.jsx';
import Beneficios from './sections/Beneficios.jsx';
import Video from './sections/Video.jsx';
import Trajetoria from './sections/Trajetoria.jsx';
import Faq from './sections/Faq.jsx';
import Oferta from './sections/Oferta.jsx';
import Loading from './sections/Loading.jsx';
import VoltarAoTopo from './VoltarAoTopo.jsx';
import HeroTablet from './sections/tablet/HeroTablet.jsx';
import BeneficiosTablet from './sections/tablet/BeneficiosTablet.jsx';
import VideoTablet from './sections/tablet/VideoTablet.jsx';
import TrajetoriaTablet from './sections/tablet/TrajetoriaTablet.jsx';
import FaqTablet from './sections/tablet/FaqTablet.jsx';
import OfertaTablet from './sections/tablet/OfertaTablet.jsx';
import HeroMobile from './sections/mobile/HeroMobile.jsx';
import BeneficiosMobile from './sections/mobile/BeneficiosMobile.jsx';
import VideoMobile from './sections/mobile/VideoMobile.jsx';
import TrajetoriaMobile from './sections/mobile/TrajetoriaMobile.jsx';
import FaqMobile from './sections/mobile/FaqMobile.jsx';
import OfertaMobile from './sections/mobile/OfertaMobile.jsx';

// Duração total da intro, do primeiro frame até o último elemento da hero
// entrar. Bate com os 3s do `loader-logo`. Serve só para soltar a rolagem no
// fim — as animações em si são todas CSS.
const LOADING_MS = 3000;

// O mobile roda a mesma abertura em metade do tempo. Todos os tempos do
// design são `calc(X * var(--ld))`, então basta --ld valer 0,5 que duração e
// atrasos encolhem juntos, sem recalibrar nada. Decisão do cliente: manter a
// abertura no celular, mas curta — é a principal porta de entrada e 3s antes
// do conteúdo custa caro em conexão móvel.
const MOBILE_LOADING_SCALE = 0.5;

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

// O que precisa caber na janela — não a hero inteira, mas até um pouco abaixo
// do CTA. Ele termina em 940 no canvas (797 + 143 de altura) e os 84px
// restantes até os 1024 da seção são só fundo. Pedir a hero toda encolhia mais
// do que o necessário, e encolher infla o `--vw`: a largura visível em px de
// canvas é `larguraDaJanela / escala`, então quanto menor a escala, mais o
// desenho se espalha e mais o conteúdo se afasta das bordas.
const HERO_FIT_HEIGHT = 964;

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
function useIntro(enabled, durationMs = LOADING_MS) {
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
    }, durationMs);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previous;
    };
  }, [intro, durationMs]);

  return intro;
}

export default function App() {
  const { width: viewportWidth, height: viewportHeight } = useViewport();
  const isMobile = viewportWidth < MOBILE_BREAKPOINT;
  const isTablet = !isMobile && viewportWidth <= TABLET_MAX;
  // O tablet segue sem abertura — o design dele não a inclui. Mobile e desktop
  // têm, com durações diferentes.
  const intro = useIntro(!isTablet, isMobile ? LOADING_MS * MOBILE_LOADING_SCALE : LOADING_MS);

  // O botão de voltar ao topo fica fora do ScaledCanvas nas três versões: ele
  // é `position: fixed` e precisa manter o tamanho em px de tela, senão
  // encolheria junto com o canvas e viraria um alvo pequeno demais.
  if (isMobile) {
    return (
      <>
        <ScaledCanvas designWidth={390} viewportWidth={viewportWidth} maxScale={Infinity}>
          <HeroMobile ctaHref={CTA_HREF} intro={intro} />
          <BeneficiosMobile />
          <VideoMobile ctaHref={CTA_HREF} />
          <TrajetoriaMobile />
          <FaqMobile />
          <OfertaMobile ctaHref={CTA_HREF} />
        </ScaledCanvas>
        <VoltarAoTopo />
      </>
    );
  }

  // O tablet não passa pelo ScaledCanvas: ele é fluido de verdade, feito de
  // clamp/vw/flex, e não um canvas de largura fixa escalado. É a única das três
  // versões assim — ver CONTEXTO.md.
  if (isTablet) {
    return (
      <>
        <div style={{ width: '100%', maxWidth: `${TABLET_MAX}px`, margin: '0 auto', background: '#160100' }}>
          <HeroTablet ctaHref={CTA_HREF} />
          <BeneficiosTablet />
          <VideoTablet ctaHref={CTA_HREF} />
          <TrajetoriaTablet />
          <FaqTablet />
          <OfertaTablet ctaHref={CTA_HREF} />
        </div>
        <VoltarAoTopo />
      </>
    );
  }

  return (
    <>
      <ScaledCanvas
        designWidth={1440}
        viewportWidth={viewportWidth}
        viewportHeight={viewportHeight}
        bleedWidth={DESKTOP_BLEED}
        fitHeight={HERO_FIT_HEIGHT}
        minScale={DESKTOP_MIN_SCALE}
      >
        <Hero ctaHref={CTA_HREF} intro={intro} />
        <Beneficios />
        <Video ctaHref={CTA_HREF} />
        <Trajetoria />
        <Faq />
        <Oferta ctaHref={CTA_HREF} />
        {/* Depois das seções de propósito: a .hero tem isolation: isolate, então
            nada de dentro dela passa por cima do resto da página. Aqui, na raiz
            do canvas, o z-index do loading vale contra tudo. */}
        {intro && <Loading />}
      </ScaledCanvas>
      <VoltarAoTopo />
    </>
  );
}
