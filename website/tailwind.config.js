/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF7',
          100: '#FAF5E8',
          200: '#F3E5C8',
          300: '#E8CE97',
          400: '#DCB765',
          500: '#D4AF37', // signature gold
          600: '#B8860B',
          700: '#946B08',
          800: '#755406',
          900: '#523A04',
          950: '#2E1E02',
        },
        ivory: '#F3ECE0',
        ink: '#050506',
        royal: {
          black: '#07080B',
          dark: '#0D0E15',
          card: '#131520',
          border: '#24283B',
          emerald: '#06231C',
          emeraldDeep: '#031410',
          accent: '#FFB84D'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Jost"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F9D976 0%, #D4AF37 50%, #996515 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #D4AF37 0%, #FFF2B2 50%, #D4AF37 100%)',
        'dark-radial': 'radial-gradient(circle at 50% 20%, #171A29 0%, #08090E 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'chapter': 'chapter 0.9s cubic-bezier(.2,.7,.2,1) both',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        chapter: {
          '0%': { opacity: '0', transform: 'translateY(18px)', filter: 'blur(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
