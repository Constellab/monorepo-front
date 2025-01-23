import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { ThemePalette } from '@angular/material/core';

export type FlMenuDynamic = FlMenuDynamicButton | FlMenuDynamicLink | FlMenuDynamicDownloadLink;

export class FlMenuDynamicButton {
  type: 'button';
  text: FlTranslatableText;
  icon?: string;
  children?: FlMenuDynamic[];
  onClick?: (event: MouseEvent) => void;
  divider?: boolean; // if true, it adds a divider before the button
  disabled?: boolean;
  color?: ThemePalette;
}

export class FlMenuDynamicLink {
  type: 'link';
  text: FlTranslatableText;
  link: string;

  icon?: string;
  divider?: boolean; // if true, it adds a divider before the button
  color?: ThemePalette;
}

export class FlMenuDynamicDownloadLink {
  type: 'downloadLink';
  text: FlTranslatableText;
  href: string;

  icon?: string;
  divider?: boolean; // if true, it adds a divider before the button
  color?: ThemePalette;
}
