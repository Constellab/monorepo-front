import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LabScenario } from '../../../../lab-core/model/entities/lab-scenario.entity';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { LabScenarioService } from '../../../../lab-core/entity-service/lab-scenario.service';
import { LabFolder } from '../../../../lab-core/model/entities/lab-folder.class';
import { LabTagDatasource } from '../../../../lab-core/model/entities/lab-tag.entity';
import { TeBasicConfig, TeRichText } from '@monorepo/text-editor';
import { FormControl } from '@angular/forms';
import { ClSubscriptionHandler } from '@monorepo/core-lib';

/**
 * Component inside LabScenarioDetailPage to show scenario information but not workflow
 */
@Component({
  selector: 'lab-scenario-detail',
  templateUrl: './lab-scenario-detail.component.html',
  styleUrls: ['./lab-scenario-detail.component.scss'],
  standalone: false,
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
