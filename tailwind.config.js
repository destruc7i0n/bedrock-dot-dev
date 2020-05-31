module.exports = {
  purge: ['./components/**/*.tsx', './pages/**/*.tsx'],
  theme: {
    extend: {},
    maxWidth: {
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%'
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
}
