import './loading.css';

// Tela de abertura: o título entra pequeno no centro da janela, estoura,
// assenta, e nos últimos 8% da animação viaja até a posição exata do título da
// hero, onde o de verdade assume. Quem faz a troca passar despercebida é o
// `fade-hold` da .hero__title-wrap, que segura o título real invisível até o
// momento do pouso.
//
// Renderiza depois de todas as seções (ver App.jsx) — é o que permite ao
// z-index valer contra a página inteira.
export default function Loading() {
  return (
    <div className="loading" aria-hidden="true">
      <div className="loading__backdrop">
        <img className="loading__bg" src="/assets/loading/fundo.png" alt="" />
      </div>
      <div className="loading__logo">
        <img src="/assets/titulo.png" alt="" />
        <div className="loading__shine" />
      </div>
    </div>
  );
}
