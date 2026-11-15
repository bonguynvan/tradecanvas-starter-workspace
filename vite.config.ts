import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths, so the build works from any folder,
  // GitHub Pages' https://<user>.github.io/<repo>/ included.
  base: './',
  build: {
    // The chart and its trading UI are one module of about 1.5 MB (400 kB
    // gzipped); its dialogs already load on first use. Silence the 500 kB warning.
    chunkSizeWarningLimit: 2000,
  },
});
