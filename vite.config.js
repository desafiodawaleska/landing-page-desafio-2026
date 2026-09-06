import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// robots.txt e sitemap.xml precisam do domínio, que mora em VITE_SITE_URL
// (.env). Deixá-los como arquivos estáticos em public/ obrigaria a lembrar de
// editar o domínio em três lugares na hora de publicar; gerar no build mantém
// um lugar só e impede que fiquem apontando para o domínio antigo.
function seo(siteUrl) {
  const base = siteUrl.replace(/\/+$/, '');
  return {
    name: 'seo-robots-sitemap',
    apply: 'build',
    generateBundle() {
      const hoje = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          `  <url>\n    <loc>${base}/</loc>\n    <lastmod>${hoje}</lastmod>\n` +
          '    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n' +
          '</urlset>\n',
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = env.VITE_SITE_URL || 'https://SEU-DOMINIO.com.br';

  return {
    plugins: [react(), seo(siteUrl)],
    build: {
      // O JS/CSS compilado vai para dist/build/ em vez de dist/assets/, que é
      // onde ficam as imagens da identidade visual. Separar os dois permite
      // cachear o bundle (nome com hash) para sempre sem congelar as fotos de
      // assets/s3/, que são substituídas mantendo o mesmo nome de arquivo.
      assetsDir: 'build',
    },
  };
});
