import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // El SDK de Firebase pesa mas de 500 kB por si solo, asi que se sube el aviso de tamaño.
  build: { chunkSizeWarningLimit: 2048 },
});
