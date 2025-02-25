import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          transformers: ['@xenova/transformers'],
          onnx: ['onnxruntime-web']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});