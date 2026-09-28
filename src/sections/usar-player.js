import { useCallback, useEffect, useRef, useState } from 'react';

// Fração do quadro que precisa estar visível para a reprodução começar sozinha.
// Meio quadro é o ponto em que a seção deixa de ser "de passagem": abaixo
// disso, quem rola rápido levaria um susto de som com o vídeo ainda na beirada
// da tela.
const VISIVEL_PARA_TOCAR = 0.6;

// Play/pause, progresso e início automático do vídeo, compartilhado pelas três
// versões da seção.
//
// Aqui eu fujo de propósito da regra da casa de duplicar por breakpoint: o
// carrossel duplica porque a lógica muda de verdade entre as versões (medidas
// diferentes, e o tablet ainda observa a largura), mas a do player é idêntica
// nas três. Três cópias só criariam três lugares para desencontrar.
//
// Sobre tocar com som sozinho — isto é política de navegador, não decisão
// nossa: `play()` com áudio é rejeitado sem um gesto anterior do usuário, e o
// iOS é o mais rígido. O que dá para fazer é *tentar* com som e, quando a
// promessa é recusada, cair para o mudo e oferecer um botão "Ativar som" — o
// clique nele é o gesto que falta. Quem já interagiu com a página antes de
// chegar aqui (clicou em qualquer CTA, por exemplo) normalmente pega o som de
// primeira.
export function usarPlayer() {
  const video = useRef(null);
  // O observador vai no palco, não no <video>: é o palco que tem tamanho
  // garantido mesmo antes de o arquivo carregar.
  const palco = useRef(null);
  const [tocando, setTocando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [semSom, setSemSom] = useState(false);

  // Uma pausa feita pelo usuário vale mais que o início automático: sem isso,
  // bastava ele pausar e rolar dois dedos para o vídeo voltar a tocar sozinho.
  const pausadoPeloUsuario = useRef(false);

  const alternar = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      // O clique é um gesto do usuário, então aqui o som pode voltar sem risco
      // de recusa.
      el.muted = false;
      setSemSom(false);
      pausadoPeloUsuario.current = false;
      el.play().catch(() => {});
    } else {
      pausadoPeloUsuario.current = true;
      el.pause();
    }
  };

  const ativarSom = () => {
    const el = video.current;
    if (!el) return;
    el.muted = false;
    setSemSom(false);
    if (el.paused) el.play().catch(() => {});
  };

  const aoAvancar = () => {
    const el = video.current;
    if (el && el.duration) setProgresso(el.currentTime / el.duration);
  };

  // `tocando` vem dos eventos do próprio elemento, não do que achamos que o
  // `play()` fez: a promessa pode ser recusada, o navegador pode pausar por
  // conta própria, e o estado tem de acompanhar o vídeo, não a intenção.
  const aoTocar = useCallback(() => setTocando(true), []);
  const aoPausar = useCallback(() => setTocando(false), []);

  const aoTerminar = () => {
    setTocando(false);
    setProgresso(1);
  };

  useEffect(() => {
    const alvo = palco.current;
    if (!alvo || !video.current) return undefined;

    // Som ligando sozinho é exatamente o tipo de coisa que
    // `prefers-reduced-motion` existe para evitar — quem pede menos movimento
    // continua com o play manual, igual à intro, que também não roda nesse
    // caso.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        const el = video.current;
        if (!el) return;

        if (!entrada.isIntersecting) {
          // Saiu de vista: pausa sem marcar como pausa do usuário, para que
          // voltar à seção volte a tocar.
          if (!el.paused) el.pause();
          return;
        }

        if (pausadoPeloUsuario.current || !el.paused) return;

        el.muted = false;
        el.play().then(
          () => setSemSom(false),
          () => {
            // Recusado por falta de gesto. Mudo o navegador aceita; o botão de
            // som fica à mostra para o usuário completar o que falta.
            el.muted = true;
            setSemSom(true);
            el.play().catch(() => {});
          },
        );
      },
      { threshold: VISIVEL_PARA_TOCAR },
    );

    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return {
    video,
    palco,
    tocando,
    progresso,
    semSom,
    alternar,
    ativarSom,
    aoAvancar,
    aoTocar,
    aoPausar,
    aoTerminar,
  };
}
