import { FlEntity } from '@monorepo/front-core-lib/fl-core';

/**
 * Entity that support flag feature
 */
export interface LiFlaggedEntity extends FlEntity {
  flagged: boolean;
}
