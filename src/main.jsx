import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// O navegador restaura a posição da rolagem ao recarregar, o que fazia a
// página voltar no meio de uma seção — e, com a intro rodando por cima, o
// usuário ouvia a abertura sem ver o começo dela. Aqui o recarregamento sempre
// começa do topo, com a abertura inteira.
//
// `scrollTo` além do `scrollRestoration`: o Firefox restaura mesmo com a
// propriedade em 'manual' quando a página é recarregada com F5.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => window.scrollTo(0, 0));

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
