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
  future: {
    removeDeprecatedGapUtilities: true,
  },
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
        // dark theme colours
        'dark-gray': {
          '975': '#18191a', // the navbar
          '950': '#242526', // the sidebar
          '900': '#2d2e2f', // behind the docs
          '850': '#3a3b3c', // alt color table
          '800': '#3e4042', // accent
          '700': '#4b4c4e', // table border
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
