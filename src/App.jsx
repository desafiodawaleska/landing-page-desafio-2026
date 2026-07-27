import Hero from './sections/Hero.jsx';
import Beneficios from './sections/Beneficios.jsx';
import Trajetoria from './sections/Trajetoria.jsx';
import Oferta from './sections/Oferta.jsx';

const CTA_HREF = '#inscricao';

export default function App() {
  return (
    <div className="canvas">
      <Hero ctaHref={CTA_HREF} />
      <Beneficios />
      <Trajetoria />
      <Oferta ctaHref={CTA_HREF} />
    </div>
  );
}
