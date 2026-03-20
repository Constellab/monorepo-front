import { AsyncPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlArticleModule } from '@monorepo/front-core-lib/fl-article';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import {
  LiFolder,
  LiScenario,
  LiScenarioService,
  LiSharedEntityOriginDialogData,
  LiTagDatasource,
} from '@monorepo/lab-lib/li-core';
import { LiObjectSyncInfoComponent, LiObjectValidationInfoComponent } from '@monorepo/lab-lib/li-entity';
import { LiFolderInlineSelectComponent } from '@monorepo/lab-lib/li-folder';
import { LiSharedEntityOriginDialogComponent } from '@monorepo/lab-lib/li-share';
import { LiTagListComponent } from '@monorepo/lab-lib/li-tag';
import { TeBasicConfig, TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, tap } from 'rxjs';

import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { LabScenarioLinkedNotesComponent } from '../lab-scenario-linked-notes/lab-scenario-linked-notes.component';

/**
 * Component inside LabScenarioDetailPage to show scenario information but not workflow
 */
@Component({
  selector: 'lab-scenario-detail',
  templateUrl: './lab-scenario-detail.component.html',
  styleUrls: ['./lab-scenario-detail.component.scss'],
  imports: [
    FlArticleModule,
    LiTagListComponent,
    LiFolderInlineSelectComponent,
    ReactiveFormsModule,
    FormsModule,
    FlTextIconModule,
    MatTooltip,
    MatIcon,
    FlIconModule,
    FlKeyValueModule,
    LiObjectValidationInfoComponent,
    LiObjectSyncInfoComponent,
    FlUserModule,
    TeTextEditorModule,
    FlCardModule,
    LabScenarioLinkedNotesComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LabScenarioDetailComponent implements OnInit, OnDestroy {
  private scenarioState = inject(LabScenarioDetailPageState);
  private scenarioService = inject(LiScenarioService);
  private dialogService = inject(FlDialogService);

  scenario$: Observable<LiScenario>;
  tags$: LiTagDatasource;

  textEditorConfig: TeBasicConfig = new TeBasicConfig();

  descriptionFormControl: FormControl<TeRichText> = new FormControl({ value: null });

  saveDescriptionFunc: (content: TeRichText) => Observable<LiScenario>;

  private subscription = new ClSubscriptionHandler();

  ngOnInit(): void {
    this.scenario$ = this.scenarioState.getScenario$();
    this.subscription.add(
      this.scenarioState
        .getDescription$()
        .subscribe((description) => this.descriptionFormControl.patchValue(description, { emitEvent: false }))
    );
    this.tags$ = this.scenarioState.getTags$();

    this.saveDescriptionFunc = (content: TeRichText) =>
      this.scenarioService
        .updateDescription(this.scenarioState.currentScenario.id, content)
        .pipe(tap((exp) => this.scenarioState.updateDescription(exp.description)));

    this.subscription.add(
      this.scenarioState.getScenario$().subscribe((scenario) => {
        if (scenario.isValidated) {
          this.descriptionFormControl.disable({ emitEvent: false });
        } else {
          this.descriptionFormControl.enable({ emitEvent: false });
        }
      })
    );
  }

  openShareOrigin(scenario: LiScenario): void {
    if (scenario.creationType === 'IMPORTED') {
      const data: LiSharedEntityOriginDialogData = { entityType: 'SCENARIO', entityId: scenario.id };
      this.dialogService.openMediumDialog(LiSharedEntityOriginDialogComponent, { data });
    }
  }

  updateFolder(folder: LiFolder): void {
    this.scenarioService.updateFolder(this.scenarioState.currentScenario.id, folder?.id ?? null).subscribe({
      next: (scenario) => this.scenarioState.updateScenario(scenario),
      // call refresh scenario to set the folder back
      error: () => this.scenarioState.refreshScenario(),
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
