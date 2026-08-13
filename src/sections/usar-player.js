import { useRef, useState } from 'react';

// Play/pause e progresso do vídeo, compartilhado pelas três versões da seção.
//
// Aqui eu fujo de propósito da regra da casa de duplicar por breakpoint: o
// carrossel duplica porque a lógica muda de verdade entre as versões (medidas
// diferentes, e o tablet ainda observa a largura), mas a do player é idêntica
// nas três. Três cópias só criariam três lugares para desencontrar quando o
// MP4 finalmente entrar.
export function usarPlayer() {
  const video = useRef(null);
  const [tocando, setTocando] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const alternar = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setTocando(true);
    } else {
      el.pause();
      setTocando(false);
    }
  };

  const aoAvancar = () => {
    const el = video.current;
    if (el && el.duration) setProgresso(el.currentTime / el.duration);
  };

  const aoTerminar = () => {
    setTocando(false);
    setProgresso(1);
  };

  return { video, tocando, progresso, alternar, aoAvancar, aoTerminar };
}
