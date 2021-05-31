module.exports = {
  theme: {
    colors: {
      lighter: {
        DEFAULT: 'var(--color-lighter)',
        5: 'var(--color-lighter-5)',
      },
      darker: {
        DEFAULT: 'var(--color-darker)',
        5: 'var(--color-darker-5)',
      },
      dark: {
        1: 'var(--color-dark-1)',
        2: 'var(--color-dark-2)',
        3: 'var(--color-dark-3)',
        4: 'var(--color-dark-4)',
        5: 'var(--color-dark-5)',
        6: 'var(--color-dark-6)',
      },
      light: {
        5: 'var(--color-light-5)',
        4: 'var(--color-light-4)',
        3: 'var(--color-light-3)',
        2: 'var(--color-light-2)',
        DEFAULT: 'var(--color-light)',
      },
      green: {
        1: 'var(--color-green-1)',
        2: 'var(--color-green-2)',
      },
      accent: {
        DEFAULT: 'var(--color-accent)',
        dark: 'var(--color-accent-dark)',
      },
      blue: {
        DEFAULT: 'var(--color-blue)',
        darker: 'var(--color-blue-darker)',
      },
      yellow: {
        DEFAULT: 'var(--color-yellow)',
      },
      error: {
        DEFAULT: 'var(--color-error)',
      },
      transparent: {
        DEFAULT: 'transparent',
      },
    },
    extend: {
      spacing: {
        66: '16rem',
      },
      boxShadow: {
        DEFAULT: 'rgb(0 0 0 / 20%) 0px 4px 24px',
      },
    },
  },
  variants: {
    extend: {
      padding: ['hover', 'group-hover'],
      display: ['group-hover'],
    },
  },
  purge: {
    content: ['./src/**/*.tsx'],
  },
};
