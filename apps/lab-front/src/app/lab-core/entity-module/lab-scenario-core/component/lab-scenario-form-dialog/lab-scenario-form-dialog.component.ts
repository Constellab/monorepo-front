import { Component, inject, OnInit } from '@angular/core';
import { LabScenario, LabScenarioSimpleForm } from '../../../../model/entities/lab-scenario.entity';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { Observable, of } from 'rxjs';
import { LabScenarioService } from '../../../../entity-service/lab-scenario.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, map } from 'rxjs/operators';
import { ClHelpService } from '@monorepo/core-lib';

export interface LabScenarioFormDialogInput extends FlFormDialogInput<LabScenarioSimpleForm> {
  scenarioId?: string;
  disabledFolder?: boolean;
}

/**
 * Dialog form to create or update a scenario
 */
@Component({
  selector: 'lab-scenario-form-dialog',
  templateUrl: './lab-scenario-form-dialog.component.html',
  styleUrls: ['./lab-scenario-form-dialog.component.scss'],
})
export class LabScenarioFormDialogComponent
  extends FlFormDialogAbstractDirective<LabScenarioSimpleForm, LabScenario>
  implements OnInit
{
  dialogInput: LabScenarioFormDialogInput = inject(MAT_DIALOG_DATA);

  sameTitleCount$: Observable<number>;

  // only provided in update mode
  private originalName: string;

  constructor(private scenarioService: LabScenarioService) {
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
      scenarioTemplate: [null],
      scenarioTemplateJsonFile: [null],
    });

    if (this.isUpdateMode() && this.dialogInput.disabledFolder) {
      formGroup.get('folder').disable();
    }

    return formGroup;
  }

  create(formValue: LabScenarioSimpleForm): Observable<LabScenario> {
    return this.scenarioService.create(formValue);
  }

  update(formValue: LabScenarioSimpleForm): Observable<LabScenario> {
    return this.scenarioService.update(this.dialogInput.scenarioId, formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'biox.new_scenario' : 'biox.update_scenario';
  }

  getCreateSuccessMessage(): string {
    return 'biox.scenario_created';
  }

  getUpdateSuccessMessage(): string {
    return 'biox.scenario_updated';
  }

  onTitleChange(): void {
    const title = this.formGp.get('title').value;

    if (ClHelpService.isNullOrEmpty(title) || title === this.originalName) {
      this.sameTitleCount$ = of(0);
    } else {
      this.sameTitleCount$ = this.scenarioService.countByTitle(title).pipe(
        map((result) => result.count),
        catchError(() => of(0))
      );
    }
  }
}
