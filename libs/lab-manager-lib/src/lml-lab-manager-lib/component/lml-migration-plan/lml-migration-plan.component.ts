import { Component, input } from '@angular/core';

import { LmlLabManagerMigrationPlanDTO } from '../../model/lml-migration.class';

/**
 * Component to display the migration plan
 * Shows the list of migrations if any, otherwise shows nothing
 */
@Component({
  selector: 'lml-migration-plan',
  templateUrl: './lml-migration-plan.component.html',
  styleUrls: ['./lml-migration-plan.component.scss'],
  standalone: false,
})
export class LmlMigrationPlanComponent {
  migrationPlan = input.required<LmlLabManagerMigrationPlanDTO>();
}
