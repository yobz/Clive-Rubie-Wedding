// Tailwind v4's active tokens are in app/globals.css and app/heritage.css.
export default {
  theme: {
    extend: {
      colors: {
        rose: '#D85C7A', blush: '#F3B8C7', softPink: '#F8D9E1',
        mist: '#B8B8B8', warmGrey: '#D2CED0', sage: '#9BA89A',
        eucalyptus: '#B8C1B4', ivory: '#FFFDFC', deepRose: '#B94768',
        gold: '#B89A62', roseInk: '#8D3451',
      },
      fontFamily: {
        serif: ['Bodoni Moda', 'Georgia', 'serif'],
        script: ['Pinyon Script', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: { arrive: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } } },
      animation: { arrive: 'arrive .7s ease-out both' },
    },
  },
};
