import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LabExperiment } from '../../../../../lab-core/model/entities/lab-experiment.entity';
import { LabExperimentDetailPageState } from '../../state/lab-experiment-detail-page.state';
import { LabExperimentService } from '../../../../../lab-core/entity-service/lab-experiment.service';
import { LabFolder } from '../../../../../lab-core/model/entities/lab-folder.class';
import { LabTagDatasource } from '../../../../../lab-core/model/entities/lab-tag.entity';
import { TeBasicConfig, TeRichTextContent } from '@monorepo/text-editor';
import { FormControl } from '@angular/forms';
import { ClSubscriptionHandler } from '@monorepo/core-lib';

/**
 * Component inside LabExperimentDetailPage to show experiment information but not workflow
 */
@Component({
  selector: 'lab-experiment-detail',
  templateUrl: './lab-experiment-detail.component.html',
  styleUrls: ['./lab-experiment-detail.component.scss']
})
export class LabExperimentDetailComponent implements OnInit, OnDestroy {

  experiment$: Observable<LabExperiment>;
  tags$: LabTagDatasource;

  textEditorConfig: TeBasicConfig = new TeBasicConfig();

  descriptionFormControl: FormControl<TeRichTextContent> = new FormControl({ value: null });

  saveDescriptionFunc: (content: TeRichTextContent) => Observable<LabExperiment>;

  private subscription = new ClSubscriptionHandler();

  constructor(private experimentState: LabExperimentDetailPageState,
              private experimentService: LabExperimentService) {
  }

  ngOnInit(): void {
    this.experiment$ = this.experimentState.getExperiment$();
    this.subscription.add(this.experimentState.getDescription$().subscribe(
      description => this.descriptionFormControl.patchValue(description, { emitEvent: false })
    ));
    this.tags$ = this.experimentState.getTags$();


    this.saveDescriptionFunc = (content: TeRichTextContent) =>
      this.experimentService.updateDescription(this.experimentState.currentExperiment.id, content).pipe(
        tap(exp => this.experimentState.updateDescription(exp.description))
      );

    this.subscription.add(this.experimentState.getExperiment$().subscribe(
      experiment => {
        if (experiment.isValidated) {
          this.descriptionFormControl.disable({ emitEvent: false });
        } else {
          this.descriptionFormControl.enable({ emitEvent: false });
        }
      }
    ));
  }

  updateFolder(folder: LabFolder): void {
    this.experimentService.updateFolder(this.experimentState.currentExperiment.id, folder?.id ?? null).subscribe({
      next: experiment => this.experimentState.updateExperiment(experiment),
      // call refresh experiment to set the folder back
      error: () => this.experimentState.refreshExperiment()
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
