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
    darkSelector: '.dark-mode',
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
      colors: {
        'dark-gray': {
          '950': '#141414',
          '900': '#1a1a1a',
          '800': '#282828',
          '700': '#323232',
        }
      },
    },
    screens: {
      ...screens,
      ...maxScreens,
    },
  },
  variants: {
    backgroundColor: ['dark', 'dark-hover', 'hover', 'responsive'],
    textColor: ['dark', 'dark-hover', 'hover', 'responsive'],
    borderColor: ['dark', 'responsive', 'hover'],
    opacity: ['hover', 'dark-hover', 'responsive'],
  },
  plugins: [
    require('@tailwindcss/ui'),
    require('tailwindcss-dark-mode')(),
  ],
}
