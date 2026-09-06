// Configuração da campanha. É o único arquivo que precisa mudar para trocar
// destino de CTA, domínio ou preço — nada disso fica espalhado nas seções.

// Destino real da conversão: checkout (Hotmart, Kiwify, Eduzz…), link de
// WhatsApp ou formulário. Enquanto estiver vazio, os nove botões da página
// rolam até a seção Oferta, que é a âncora `#inscricao`.
//
// Para ligar o checkout, basta preencher aqui: as três versões (desktop,
// tablet e mobile) leem esta mesma constante.
export const CHECKOUT_URL = '';

// Âncora da seção Oferta. Serve de destino de fallback e continua útil depois
// do checkout entrar no ar, para links internos.
export const ANCORA_OFERTA = 'inscricao';

// O que os CTAs usam. Com CHECKOUT_URL vazio nenhum botão fica morto: todos
// levam para o bloco de preço.
export const CTA_HREF = CHECKOUT_URL || `#${ANCORA_OFERTA}`;

// Um link externo precisa abrir com rel/target seguros; a âncora interna não.
export const CTA_EXTERNO = Boolean(CHECKOUT_URL);
