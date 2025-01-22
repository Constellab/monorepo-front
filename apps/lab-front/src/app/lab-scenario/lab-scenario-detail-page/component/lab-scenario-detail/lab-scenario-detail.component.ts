import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LabScenario } from '../../../../lab-core/model/entities/lab-scenario.entity';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { LabScenarioService } from '../../../../lab-core/entity-service/lab-scenario.service';
import { LabFolder } from '../../../../lab-core/model/entities/lab-folder.class';
import { LabTagDatasource } from '../../../../lab-core/model/entities/lab-tag.entity';
import { TeBasicConfig, TeRichText } from '@monorepo/text-editor';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlArticleModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-article/fl-article.module';
import { LabTagListComponent } from '../../../../lab-core/entity-module/lab-tag-core/component/lab-tag-list/lab-tag-list.component';
import { LabFolderInlineSelectComponent } from '../../../../lab-core/entity-module/lab-folder-core/component/lab-folder-inline-select/lab-folder-inline-select.component';
import { FlTextIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { FlKeyValueModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { LabObjectValidationInfoComponent } from '../../../../lab-core/entity-module/lab-entity-core/component/lab-object-validation-info/lab-object-validation-info.component';
import { LabObjectSyncInfoComponent } from '../../../../lab-core/entity-module/lab-entity-core/component/lab-object-sync-info/lab-object-sync-info.component';
import { FlUserModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { TeTextEditorModule } from '../../../../../../../../libs/text-editor/src/lib/te-text-editor.module';
import { FlCardModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { LabScenarioLinkedNotesComponent } from '../lab-scenario-linked-notes/lab-scenario-linked-notes.component';
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
