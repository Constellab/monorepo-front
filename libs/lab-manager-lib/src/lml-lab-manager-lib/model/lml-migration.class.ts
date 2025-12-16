import { ClVersion } from '@monorepo/core-lib';
import { Type } from 'class-transformer';

/**
 * DTO representing a single migration's description
 */
export class LmlLabManagerMigrationDescriptionDTO {
  /**
   * The version this migration upgrades to (e.g., "2.0.0")
   */
  version: string;

  /**
   * Markdown-formatted description of what this migration does
   */
  description: string;
}

/**
 * DTO representing a complete migration plan
 */
export class LmlLabManagerMigrationPlanDTO {
  /**
   * The current source version
   */
  sourceVersion: string;

  /**
   * The target version to migrate to
   */
  targetVersion: string;

  /**
   * List of migrations that will be executed, in order
   */
  @Type(() => LmlLabManagerMigrationDescriptionDTO)
  migrations: LmlLabManagerMigrationDescriptionDTO[];

  updateIsAvailable(): boolean {
    if (!this.targetVersion || !this.sourceVersion) {
      return false;
    }
    try {
      return ClVersion.fromString(this.targetVersion).isHigher(ClVersion.fromString(this.sourceVersion));
    } catch (e) {
      console.error('Error parsing version', e);
      return false;
    }
  }

  hasMigrations(): boolean {
    return this.migrations && this.migrations.length > 0;
  }
}
