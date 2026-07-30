import { useEffect, useState } from 'react';
import './voltar-ao-topo.css';

// Aparece depois que a página rola uma tela inteira — antes disso o topo está
// logo ali e o botão só ocuparia espaço.
const LIMIAR = 1;

export default function VoltarAoTopo() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > window.innerHeight * LIMIAR);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`ao-topo${visivel ? ' ao-topo--visivel' : ''}`}
      aria-label="Voltar ao topo"
      // `smooth` respeita `prefers-reduced-motion` sozinho nos navegadores
      // atuais, então não precisa de condicional aqui.
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 19V5M12 5l-7 7M12 5l7 7" />
      </svg>
    </button>
  );
}
