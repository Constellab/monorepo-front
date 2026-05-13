import { FlIcon } from '@monorepo/front-core-lib/fl-svg-icon';
import { FL_ICONS_DEFAULT } from '@monorepo/front-core-lib/fl-svg-icon';

export const HA_SVG_ICONS: FlIcon[] = [
  ...FL_ICONS_DEFAULT,

  { name: 'heart', filename: 'heart.svg' },
  { name: 'heart-fill', filename: 'heart-fill.svg' },

  // socials icons
  { name: 'github', filename: 'github-logo.svg' },
  { name: 'linkedin', filename: 'linkedin-logo.svg' },
  { name: 'medium', filename: 'medium-logo.svg' },
  { name: 'x', filename: 'x-logo.svg' },
  { name: 'facebook', filename: 'facebook-logo.svg' },
  { name: 'discord', filename: 'discord-logo.svg' },
];
