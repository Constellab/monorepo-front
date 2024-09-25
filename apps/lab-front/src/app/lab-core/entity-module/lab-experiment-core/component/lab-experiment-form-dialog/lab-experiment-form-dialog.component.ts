import { Component, inject, OnInit } from '@angular/core';
import { LabExperiment, LabExperimentSimpleForm } from '../../../../model/entities/lab-experiment.entity';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { Observable, of } from 'rxjs';
import { LabExperimentService } from '../../../../entity-service/lab-experiment.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, map } from 'rxjs/operators';
import { ClHelpService } from '@monorepo/core-lib';

export interface LabExperimentFormDialogInput extends FlFormDialogInput<LabExperimentSimpleForm> {
  experimentId?: string;
  disabledFolder?: boolean;
}

/**
 * Dialog form to create or update an experiment
 */
@Component({
  selector: 'lab-experiment-form-dialog',
  templateUrl: './lab-experiment-form-dialog.component.html',
  styleUrls: ['./lab-experiment-form-dialog.component.scss']
})
export class LabExperimentFormDialogComponent extends FlFormDialogAbstractDirective<LabExperimentSimpleForm, LabExperiment>
  implements OnInit {

  dialogInput: LabExperimentFormDialogInput = inject(MAT_DIALOG_DATA);

  sameTitleCount$: Observable<number>;

  // only provided in update mode
  private originalName: string;

  constructor(private experimentService: LabExperimentService) {
    super();
  }

  ngOnInit(): void {
    this.init();
    this.originalName = this.dialogInput.object?.title;
  }

  buildForm(): UntypedFormGroup {
    const formGroup = new FormBuilder().group({
      title: [null, Validators.required],
      folder: [null],
      protocolTemplate: [null],
      protocolTemplateJsonFile: [null],
    });

    if (this.isUpdateMode() && this.dialogInput.disabledFolder) {
      formGroup.get('folder').disable();
    }

    return formGroup;
  }

  create(formValue: LabExperimentSimpleForm): Observable<LabExperiment> {
    return this.experimentService.create(formValue);
  }

  update(formValue: LabExperimentSimpleForm): Observable<LabExperiment> {
    return this.experimentService.update(this.dialogInput.experimentId, formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'biox.new_experiment' : 'biox.update_experiment';
  }

  getCreateSuccessMessage(): string {
    return 'biox.experiment_created';
  }

  getUpdateSuccessMessage(): string {
    return 'biox.experiment_updated';
  }

  onTitleChange(): void {
    const title = this.formGp.get('title').value;

    if (ClHelpService.isNullOrEmpty(title) || title === this.originalName) {
      this.sameTitleCount$ = of(0);
    } else {
      this.sameTitleCount$ = this.experimentService.countByTitle(title).pipe(
        map(result => result.count),
        catchError(() => of(0))
      );
    }
  }


}
