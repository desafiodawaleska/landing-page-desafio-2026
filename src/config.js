// Configuração da campanha. É o único arquivo que precisa mudar para trocar
// destino de CTA, domínio ou preço — nada disso fica espalhado nas seções.

// Destino real da conversão: checkout (Hotmart, Kiwify, Eduzz…), link de
// WhatsApp ou formulário. Enquanto estiver vazio, os nove botões da página
// rolam até a seção Oferta, que é a âncora `#inscricao`.
//
// Para ligar o checkout, basta preencher aqui: as três versões (desktop,
// tablet e mobile) leem esta mesma constante.
//
// Sem a query string de rastreio (`_gl`, `_gcl_au`, `_ga`…) que vinha no link
// copiado do navegador: esses parâmetros carregam o identificador de quem
// copiou. Publicados aqui, todo visitante da LP chegaria na Sympla como se
// fosse a mesma pessoa, e a atribuição da campanha ficaria toda errada. A
// própria Sympla e o Google geram os deles no clique.
export const CHECKOUT_URL =
  'https://www.sympla.com.br/evento-online/desafio-da-wal-30-dias/3591400';

// Âncora da seção Oferta. Serve de destino de fallback e continua útil depois
// do checkout entrar no ar, para links internos.
export const ANCORA_OFERTA = 'inscricao';

// O que os CTAs usam. Com CHECKOUT_URL vazio nenhum botão fica morto: todos
// levam para o bloco de preço.
export const CTA_HREF = CHECKOUT_URL || `#${ANCORA_OFERTA}`;

// Um link externo precisa abrir com rel/target seguros; a âncora interna não.
// Nova aba para a LP continuar aberta atrás do checkout. `noopener` sem
// `noreferrer` de propósito: o referrer é como a Sympla enxerga que a venda
// veio daqui.
export const CTA_EXTERNO = Boolean(CHECKOUT_URL);
export const CTA_ATTRS = CTA_EXTERNO ? { target: '_blank', rel: 'noopener' } : {};
