const screens = {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
const maxScreens = Object.keys(screens).reduce((acc, key) => {
  acc[`${key}-max`] = { max: screens[key] }
  return acc
}, {})

module.exports = {
  purge: ['./components/**/*.tsx', './pages/**/*.tsx'],
  theme: {
    extend: {
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
      },
    },
    screens: {
      ...screens,
      ...maxScreens,
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
}
