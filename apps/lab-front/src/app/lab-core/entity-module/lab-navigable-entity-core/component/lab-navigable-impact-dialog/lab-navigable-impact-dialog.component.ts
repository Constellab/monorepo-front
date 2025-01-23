import { Component, inject, OnInit } from '@angular/core';
import { LabNavigableEntityGrouped } from '../../../../model/entities/lab-navigable-entity.entity';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogModule,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { LabScenario } from '../../../../model/entities/lab-scenario.entity';
import { LabNote } from '../../../../model/entities/lab-note.entity';
import { LabNavigableImpactConfig } from '../../lab-navigable-entity.service';
import { LabNavigableEntityGroupsComponent } from '../lab-navigable-entity-groups/lab-navigable-entity-groups.component';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

export interface LabNavigableImpactDialogInput {
  impactedEntities: LabNavigableEntityGrouped[];
  config: LabNavigableImpactConfig;
}

/**
 * Dialog to show the impact of an action on the entities
 * It will show the entities that will be impacted and ask for confirmation
 */
@Component({
  selector: 'lab-navigable-impact-dialog',
  templateUrl: './lab-navigable-impact-dialog.component.html',
  styleUrl: './lab-navigable-impact-dialog.component.scss',
  imports: [
    FlDialogModule,
    MatDialogContent,
    LabNavigableEntityGroupsComponent,
    FlTextIconModule,
    MatIcon,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    AsyncPipe,
    TranslatePipe,
    FlTranslateModule,
  ],
})
export class LabNavigableImpactDialogComponent implements OnInit {
  data: LabNavigableImpactDialogInput = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);
  private dialogService = inject(FlDialogService);

  containsValidatedScenarios: boolean = false;
  containsValidatedNotes: boolean = false;

  ngOnInit(): void {
    // check if there are some validated scenario
    const scenariosGroup: LabNavigableEntityGrouped<LabScenario> = this.data.impactedEntities.find(
      (group) => group.type === 'SCENARIO'
    );
    if (scenariosGroup) {
      this.containsValidatedScenarios = scenariosGroup.entities.some((entity) => entity.isValidated);
    }

    // check if there are some validated note
    const notesGroup: LabNavigableEntityGrouped<LabNote> = this.data.impactedEntities.find(
      (group) => group.type === 'NOTE'
    );
    if (notesGroup) {
      this.containsValidatedNotes = notesGroup.entities.some((entity) => entity.isValidated);
    }
  }

  callAction(): void {
    if (this.containsValidatedScenarios || this.containsValidatedNotes) return;

    const input: FlConfirmDialogInput = {
      title: this.data.config.title,
      content: 'biox.force_action_confirm',
      observable: this.data.config.callAction(),
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.callActionSuccess(result));
  }

  private callActionSuccess(result: FlConfirmDialogResult): void {
    this.dialogRef.close(result);
  }
}
