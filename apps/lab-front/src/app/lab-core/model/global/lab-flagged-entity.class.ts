import { FlEntity } from '@monorepo/front-core-lib/fl-core';

/**
 * Entity that support flag feature
 */
export interface LabFlaggedEntity extends FlEntity {
  flagged: boolean;
}
