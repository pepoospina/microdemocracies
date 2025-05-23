import { ThemeType, dark, grommet } from 'grommet/themes'
import { deepMerge } from 'grommet/utils'
import { css } from 'styled-components'

export const theme = {}

export interface StyleConstants {
  headingFontSizes: {
    1: string
    2: string
    3: string
    4: string
  }
  textFontSizes: {
    large: string
    medium: string
    normal: string
    small: string
    xsmall: string
  }
  colors: {
    primary: string
    primaryLight: string
    text: string
    textOnPrimary: string
    headings: string
    backgroundLight: string
    backgroundLightDarker: string
    border: string
    links: string
  }
}

export interface ExtendedThemeType extends ThemeType {
  constants: StyleConstants
}

const constants: StyleConstants = {
  headingFontSizes: {
    1: '36px',
    2: '28px',
    3: '22px',
    4: '22px',
  },
  textFontSizes: {
    large: '32px',
    medium: '26px',
    normal: '22px',
    small: '18px',
    xsmall: '14px',
  },
  colors: {
    primary: '#1a1a1a',
    primaryLight: '#1a1a1a7a',
    text: '#1a1a1a',
    textOnPrimary: '#ffffff',
    border: '#333333',
    headings: '#1a1a1a',
    backgroundLight: '#f7f7f7',
    backgroundLightDarker: '#cacaca',
    links: '#004766',
  },
}

const extension: ExtendedThemeType = {
  constants,
  global: {
    colors: {
      brand: constants.colors.primary,
      brandLight: constants.colors.primaryLight,
      text: constants.colors.text,
    },
    font: {
      size: constants.textFontSizes.normal,
    },
    input: {
      font: {
        size: constants.textFontSizes.small,
      },
    },
    breakpoints: {
      xsmall: {
        value: 700,
      },
      small: {
        value: 900,
      },
      medium: {
        value: 1400,
      },
      large: {},
    },
  },
  heading: {
    level: {
      1: {
        medium: {
          size: constants.headingFontSizes[1],
        },
      },
      2: {
        medium: {
          size: constants.headingFontSizes[2],
        },
      },
      3: {
        medium: {
          size: constants.headingFontSizes[3],
        },
      },
    },
    responsiveBreakpoint: undefined,
  },
  button: {
    padding: { vertical: '15px', horizontal: '30px' },
    border: {
      radius: '4px',
    },
    primary: {
      color: constants.colors.primary,
      extend: css`
        & {
          color: #ffffff;
          font-weight: 800;
        }
      `,
    },
    secondary: {
      extend: css`
        & {
          font-weight: 500;
        }
      `,
    },
  },
  formField: {
    checkBox: {
      pad: 'small',
    },
    label: {
      weight: 700,
      size: constants.textFontSizes.small,
      margin: '0px 0px 8px 0px',
    },
    border: false,
  },
  fileInput: {
    message: {
      size: constants.textFontSizes.small,
    },
  },
  select: {
    control: {
      extend: css`
        & {
          border-style: none;
        }
      `,
    },
  },
  textArea: {
    extend: () => {
      return css`
        * {
          padding: 14px 36px;
          border-width: 1px;
          border-style: solid;
          border-color: #8b7d7d;
          border-radius: 24px;
        }
      `
    },
  },
  textInput: {
    container: {
      extend: () => {
        return css`
          * {
            padding: 14px 36px;
            border-width: 1px;
            border-style: solid;
            border-color: #8b7d7d;
            border-radius: 24px;
          }
        `
      },
    },
  },
  checkBox: {
    color: constants.colors.primary,
  },
  table: {
    header: {
      extend: css`
        & {
          border: none;
        }
      `,
    },
  },
  tip: {
    content: {
      background: '#FFFFFF',
    },
  },
  accordion: {
    icons: {
      color: constants.colors.primaryLight,
    },
    border: false,
    panel: {
      border: false,
    },
  },
  anchor: {
    color: constants.colors.links,
    textDecoration: 'underline',
  },
}

export const lightTheme = deepMerge(grommet, extension)
export const darkTheme = deepMerge(dark, extension)
