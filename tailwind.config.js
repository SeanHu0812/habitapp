/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cozy pastel palette
        cream: '#FFF8E7',
        softPink: '#FFD6E0',
        softPeach: '#FFE5D9',
        softMint: '#D4E9D7',
        softLavender: '#E8DFF5',
        softBlue: '#DCEEF3',
        softYellow: '#FFF3B0',
        warmBrown: '#8B7355',
        darkBrown: '#5D4E37',
        grassGreen: '#7CB87C',
        skyBlue: '#87CEEB',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        cozy: ['Quicksand', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-soft': 'pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
