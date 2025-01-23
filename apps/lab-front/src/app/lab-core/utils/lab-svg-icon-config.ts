// define the list of svg icon
import { FlIcon } from '@monorepo/front-core-lib/fl-svg-icon';
import { flIconsDefault } from '@monorepo/front-core-lib/fl-svg-icon';

export const labSvgIcons: FlIcon[] = [
  ...flIconsDefault,
  { name: 'database', filename: 'database-solid.svg' },
  { name: 'dna', filename: 'dna-solid.svg' },
  { name: 'ontology', filename: 'folder-diagram-solid.svg' },
  { name: 'code', filename: 'laptop-code-solid.svg' },
];
