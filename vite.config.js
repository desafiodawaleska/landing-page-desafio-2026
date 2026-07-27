import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // O JS/CSS compilado vai para dist/build/ em vez de dist/assets/, que é
    // onde ficam as imagens da identidade visual. Separar os dois permite
    // cachear o bundle (nome com hash) para sempre sem congelar as fotos de
    // assets/s3/, que são substituídas mantendo o mesmo nome de arquivo.
    assetsDir: 'build',
  },
});
