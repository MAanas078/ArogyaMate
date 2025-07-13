import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5174,
    allowedHosts: ['arogyamate-admin.onrender.com'] // 👈 Add this line
  },
  assetsInclude: ['**/*.JPG']
});
