/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}','./src/plugin/components/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        '4.75': '1.188rem',// 19px
        '5.25': '1.313rem', //21px
        '7.5': '1.875rem', // 30px
        '7.75': '1.938rem', // 31px'
        '8.5': '2.125rem', // 34px
        '13': '3.25rem', // 52px
        '12.25': '3.063rem',// 49px
        '8.75': '2.188rem', // 35px
        '16.5': '4.125rem', // 66px
        '18': '4.5rem', // 72px
        '18.75': '4.688rem',// 75px
        '6.25': '1.563rem',// 25px
        '30': '7.5rem',// 120px
        '11.25': '2.813rem', // 45px
        '1.75': '0.438rem', // 7px
        '2.75': '0.688rem',// 11px
        '3.75': '0.938rem', // 15px
        '3.25': '0.813rem', // 13px
        '5.5': '1.375rem',// 22px
        '26': '6.5rem', // 104px
        '17.5': '4.375rem',// 70px
        '9.5': '2.375rem', // 38px
        '15': '3.75rem', // 60px
        '39': '9.75rem',// 156px
      },
      transitionDelay: {
        '3000': '3000ms',
      },
      animation: {
        'fade-out': 'fadeOut 1s linear forwards',
        'fade-in': 'fadeIn 3s linear forwards'
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
  corePlugins: {
    preflight: false,
    aspectRatio: false,
  }
}

