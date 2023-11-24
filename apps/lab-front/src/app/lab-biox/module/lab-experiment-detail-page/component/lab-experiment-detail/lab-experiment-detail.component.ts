import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {LabExperiment} from '../../../../../lab-core/model/entities/lab-experiment.entity';
import {LabExperimentDetailPageState} from '../../state/lab-experiment-detail-page.state';
import {
  FlDebouncer,
  FlDialogService,
  FlQuillJson,
  FlTextEditorBasicConfig,
  FlTextEditorConfig
} from '@monorepo/front-core-lib';
import {LabExperimentService} from '../../../../../lab-core/entity-service/lab-experiment.service';
import {LabProject} from '../../../../../lab-core/model/entities/lab-project.class';
import {
  LabManageEntityTagsDialogComponent,
  LabManageEntityTagsDialogInput
} from '../../../../../lab-core/entity-module/lab-tag-core/component/lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component';
import {LabTagDatasource} from '../../../../../lab-core/model/entities/lab-tag.entity';

/**
 * Component inside LabExperimentDetailPage to show experiment information but not workflow
 */
@Component({
  selector: 'lab-experiment-detail',
  templateUrl: './lab-experiment-detail.component.html',
  styleUrls: ['./lab-experiment-detail.component.scss'],
})
export class LabExperimentDetailComponent implements OnInit, OnDestroy {

  experiment$: Observable<LabExperiment>;
  description: FlQuillJson;
  tags$: LabTagDatasource;

  textEditorConfig: FlTextEditorConfig = new FlTextEditorBasicConfig();

  private descriptionDebouncer: FlDebouncer<FlQuillJson>;

  constructor(private experimentState: LabExperimentDetailPageState,
              private experimentService: LabExperimentService,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.experiment$ = this.experimentState.getExperiment$();
    this.experimentState.getDescription$().subscribe(
      description => this.description = description
    );
    this.tags$ = this.experimentState.getTags$();

    // create a debouncer to save the description after x second of idle
    this.descriptionDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.descriptionDebouncer.getDebouncedValue().subscribe(
      value => this.saveDescription(value)
    );
  }

  onDescriptionChanged(value: FlQuillJson): void {
    this.descriptionDebouncer.setValue(value);
  }

  saveDescription(description: FlQuillJson): void {
    this.experimentService.updateDescription(this.experimentState.currentExperiment.id, description).subscribe(
      () => this.saveDescriptionSuccess(this.description),
    );
  }

  private saveDescriptionSuccess(description: FlQuillJson): void {
    this.experimentState.updateDescription(description);
  }

  openTagsFormDialog(): void {
    const data: LabManageEntityTagsDialogInput = {
      entityType: 'EXPERIMENT',
      entityId: this.experimentState.currentExperiment.id,
      tags: this.experimentState.getTags$(),
    };

    this.dialogService.openSmallDialog(LabManageEntityTagsDialogComponent, {data: data});
  }

  updateProject(project: LabProject): void {
    this.experimentService.updateProject(this.experimentState.currentExperiment.id, project?.id ?? null).subscribe(
      experiment => this.experimentState.updateExperiment(experiment)
    );
  }

  ngOnDestroy(): void {
    this.descriptionDebouncer.markForComplete();
  }


}
