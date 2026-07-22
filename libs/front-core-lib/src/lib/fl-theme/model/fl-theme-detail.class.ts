import { ThemePalette } from '@angular/material/core';

/**
 * Detail of a theme containing the colors
 */
export interface FlThemeDetail {
  primary: string;
  accent: string;
  warn: string;
  background: string;
  foreground: string;

  primaryContrast: string;
  accentContrast: string;
  warnContrast: string;

  cardBackground: string;
  hover: string;
}

/**
 * Light theme detail
 */
export const FL_THEME_DETAIL_LIGHT: FlThemeDetail = {
  primary: '#1d907d',
  accent: '#675a9d',
  warn: '#c35895',
  background: '#f7fdfc',
  foreground: '#041210',

  primaryContrast: '#ffffff',
  accentContrast: '#ffffff',
  warnContrast: '#ffffff',

  cardBackground: '#ffffff',
  hover: '#d2d2d2',
};

/**
 * Dark theme detail
 */
export const FL_THEME_DETAIL_DARK: FlThemeDetail = {
  primary: '#1d907d',
  accent: '#675a9d',
  warn: '#c35895',
  background: '#222222',
  foreground: '#f1f1f1',

  primaryContrast: '#ffffff',
  accentContrast: '#ffffff',
  warnContrast: '#ffffff',

  cardBackground: '#2b2d2e',
  hover: '#494949',
};

/**
 * Object containing class name of the theme
 */
export const FL_THEME_CLASS = {
  primaryText: 'g-primary-text',
  accentText: 'g-accent-text',
  warnText: 'g-warn-text',
  greyText: 'g-text-normal-color',

  primaryBackground: 'g-primary-background',
  accentBackground: 'g-accent-background',
  warnBackground: 'g-warn-background',
  greyBackground: 'g-grey-background',
};

export class FlThemeHelper {
  public static paletteToTextCssClass(color: ThemePalette): string | null {
    switch (color) {
      case 'primary':
        return FL_THEME_CLASS.primaryText;
      case 'accent':
        return FL_THEME_CLASS.accentText;
      case 'warn':
        return FL_THEME_CLASS.warnText;
      default:
        return null;
    }
  }
}
