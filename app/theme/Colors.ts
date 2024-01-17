/**
 * A collection of colors used in the theme.
 * @type {Object}
 */
const themeColors: Record<string, string> = {
  primary: '#141414',
  secondary: '#F1C336',
  gray: '#7B7B7B',
  error: '#E53E3E',
  pink: '#BA25EB',
  orange: '#F39C3C',
  lightBlue: '#3787FC',
  red: '#DD2C2C',
  darkBlue: '#374dfc',
  transparent: 'transparent',
  green: '#61c5c6d9',
  greenSelected: '#619DA0 '
};

/**
 * A collection of common colors used in the theme.
 * @type {Object}
 */
const commonColors: Record<string, string> = {
  white: '#FFFFFF',
  black: '#000000',
  transparentBlack: '#00000000',
  transparentWhite: '#FFFFFF00',
  red: '#D22B2B'
};

/**
 * A light theme object.
 * @returns {ThemeColors}
 */
const light: Record<string, string> = {
  ...themeColors,
  black: commonColors.black,
  white: commonColors.white,
  transparentWhite: commonColors.transparentWhite,
  transparentBlack: commonColors.transparentBlack,
  red: commonColors.red,
  pearlBush: '#ece5dd',
  pictonBlue: '#34b7f1',
  gossip: '#DCF8C6'
};

/**
 * A dark theme object.
 * @returns {ThemeColors}
 */
const dark: Record<string, string> = {
  ...themeColors,
  black: commonColors.white,
  white: commonColors.black,
  transparentWhite: commonColors.transparentBlack,
  transparentBlack: commonColors.transparentWhite
};

export enum ThemeModeEnum {
  'light' = 'light',
  'dark' = 'dark',
  'system' = 'system'
}

export type ThemeMode = ThemeModeEnum.light | ThemeModeEnum.dark;

export default { light, dark };
