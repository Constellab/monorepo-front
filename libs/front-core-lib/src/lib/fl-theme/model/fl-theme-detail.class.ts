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
export const flThemeDetailLight: FlThemeDetail = {
  primary: '#25b49c',
  accent: '#c5bbee',
  warn: '#ff93d0',
  background: '#F9F8F8',
  foreground: '#041210',

  primaryContrast: '#041210',
  accentContrast: '#392a75',
  warnContrast: '#790f4b',

  cardBackground: '#EAEAEA',
  hover: '#D2D2D2',
};

/**
 * Dark theme detail
 */
export const flThemeDetailDark: FlThemeDetail = {
  primary: '#25b49c',
  accent: '#c5bbee',
  warn: '#ff93d0',
  background: '#1B1919',
  foreground: '#E8E8E8',

  primaryContrast: '#041210',
  accentContrast: '#392a75',
  warnContrast: '#790f4b',

  cardBackground: '#2B2D2E',
  hover: '#3A3D3D',
};

/**
 * Object containing class name of the theme
 */
export const flThemeClass = {
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
        return flThemeClass.primaryText;
      case 'accent':
        return flThemeClass.accentText;
      case 'warn':
        return flThemeClass.warnText;
      default:
        return null;
    }
  }
}
