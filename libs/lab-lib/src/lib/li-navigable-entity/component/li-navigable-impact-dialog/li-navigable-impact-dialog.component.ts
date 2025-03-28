import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogModule,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LiNavigableEntityGrouped, LiNote, LiScenario } from '@monorepo/lab-lib/li-core';
import { LiNavigableEntityGroupsComponent } from '../li-navigable-entity-groups/li-navigable-entity-groups.component';
import { LiNavigableImpactConfig } from '../../li-navigable-entity.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

export interface LiNavigableImpactDialogInput {
  impactedEntities: LiNavigableEntityGrouped[];
  config: LiNavigableImpactConfig;
}

/**
 * Dialog to show the impact of an action on the entities
 * It will show the entities that will be impacted and ask for confirmation
 */
@Component({
  selector: 'li-navigable-impact-dialog',
  templateUrl: './li-navigable-impact-dialog.component.html',
  styleUrl: './li-navigable-impact-dialog.component.scss',
  imports: [
    FlDialogModule,
    MatDialogContent,
    LiNavigableEntityGroupsComponent,
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
export class LiNavigableImpactDialogComponent implements OnInit {
  data: LiNavigableImpactDialogInput = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);
  private dialogService = inject(FlDialogService);

  containsValidatedScenarios: boolean = false;
  containsValidatedNotes: boolean = false;

  ngOnInit(): void {
    // check if there are some validated scenario
    const scenariosGroup: LiNavigableEntityGrouped<LiScenario> = this.data.impactedEntities.find(
      (group) => group.type === 'SCENARIO'
    );
    if (scenariosGroup) {
      this.containsValidatedScenarios = scenariosGroup.entities.some((entity) => entity.isValidated);
    }

    // check if there are some validated note
    const notesGroup: LiNavigableEntityGrouped<LiNote> = this.data.impactedEntities.find(
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
