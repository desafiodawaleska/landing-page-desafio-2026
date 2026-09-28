// Fonte do vídeo da seção "A jornada da nossa capitã".
//
// Ponto único de troca das três versões (desktop, tablet e mobile): assim que
// o MP4 entrar em public/assets/s6/, basta apontar aqui — por exemplo
// '/assets/s6/waleska.mp4' — que os três players ligam sozinhos.
//
// Vazio, a seção fica no estado de repouso: o quadro laranja com o botão de
// play desenhado, sem interação. É o mesmo caminho do prop `videoSrc` do
// protótipo do Claude Design, que também nasce vazio.
//
// O arquivo publicado é reencodado, não o master. O original entregue tinha
// 333 MB (1920x1080 a 16 Mbps, 2m52s) — acima do limite de 100 MB por arquivo
// do GitHub, além de inviável de servir. Ver `docs/CONTEXTO.md` para os
// parâmetros e como refazer.
export const VIDEO_SRC = '/assets/s6/waleska.mp4';
