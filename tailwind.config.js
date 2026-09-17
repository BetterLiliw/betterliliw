/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // tells Tailwind where to look for classes
  ],
  theme: {
    extend: {
      // The Tsinelas design system (src/styles/tsinelas.css) provides every
      // design token via Tailwind v4 `@theme`, layered over @bettergov/kapwa.
      // This legacy config is kept minimal so nothing here can conflict.
      fontFamily: {
        display: ['var(--font-tsinelas-display)'],
        sans: ['var(--font-tsinelas-sans)'],
        mono: ['var(--font-tsinelas-mono)'],
      },
      // Custom animations live in src/index.css using @theme.
    },
  },
  plugins: [],
};
