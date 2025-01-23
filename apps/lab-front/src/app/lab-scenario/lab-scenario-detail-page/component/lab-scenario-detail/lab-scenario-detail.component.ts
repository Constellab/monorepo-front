import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LabScenario } from '../../../../lab-core/model/entities/lab-scenario.entity';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { LabScenarioService } from '../../../../lab-core/entity-service/lab-scenario.service';
import { LabFolder } from '../../../../lab-core/model/entities/lab-folder.class';
import { LabTagDatasource } from '../../../../lab-core/model/entities/lab-tag.entity';
import { TeBasicConfig, TeRichText } from '@monorepo/text-editor';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlArticleModule } from '@monorepo/front-core-lib/fl-article';
import {
  LabTagListComponent,
} from '../../../../lab-core/entity-module/lab-tag-core/component/lab-tag-list/lab-tag-list.component';
import {
  LabFolderInlineSelectComponent,
} from '../../../../lab-core/entity-module/lab-folder-core/component/lab-folder-inline-select/lab-folder-inline-select.component';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import {
  LabObjectValidationInfoComponent,
} from '../../../../lab-core/entity-module/lab-entity-core/component/lab-object-validation-info/lab-object-validation-info.component';
import {
  LabObjectSyncInfoComponent,
} from '../../../../lab-core/entity-module/lab-entity-core/component/lab-object-sync-info/lab-object-sync-info.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeTextEditorModule } from '../../../../../../../../libs/text-editor/src/lib/te-text-editor.module';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import {
  LabScenarioLinkedNotesComponent,
} from '../lab-scenario-linked-notes/lab-scenario-linked-notes.component';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component inside LabScenarioDetailPage to show scenario information but not workflow
 */
@Component({
  selector: 'lab-scenario-detail',
  templateUrl: './lab-scenario-detail.component.html',
  styleUrls: ['./lab-scenario-detail.component.scss'],
  imports: [
    FlArticleModule,
    LabTagListComponent,
    LabFolderInlineSelectComponent,
    ReactiveFormsModule,
    FormsModule,
    FlTextIconModule,
    MatTooltip,
    MatIcon,
    FlIconModule,
    FlKeyValueModule,
    LabObjectValidationInfoComponent,
    LabObjectSyncInfoComponent,
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
  private scenarioService = inject(LabScenarioService);

  scenario$: Observable<LabScenario>;
  tags$: LabTagDatasource;

  textEditorConfig: TeBasicConfig = new TeBasicConfig();

  descriptionFormControl: FormControl<TeRichText> = new FormControl({ value: null });

  saveDescriptionFunc: (content: TeRichText) => Observable<LabScenario>;

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

  updateFolder(folder: LabFolder): void {
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
