import { Component, inject, OnInit } from '@angular/core';
import { LabScenario, LabScenarioSimpleForm } from '../../../../model/entities/lab-scenario.entity';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { Observable, of } from 'rxjs';
import { LabScenarioService } from '../../../../entity-service/lab-scenario.service';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { catchError, map } from 'rxjs/operators';
import { ClHelpService } from '@monorepo/core-lib';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { LabSelectScenarioTemplateComponent } from '../../../lab-scenario-template-core/component/lab-select-scenario-template/lab-select-scenario-template.component';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { LabFolderSelectComponent } from '../../../lab-folder-core/component/lab-folder-select/lab-folder-select.component';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

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
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatHint,
    FlFormModule,
    LabSelectScenarioTemplateComponent,
    FlInputFileModule,
    LabFolderSelectComponent,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LabScenarioFormDialogComponent
  extends FlFormDialogAbstractDirective<LabScenarioSimpleForm, LabScenario>
  implements OnInit
{
  private scenarioService = inject(LabScenarioService);

  dialogInput: LabScenarioFormDialogInput = inject(MAT_DIALOG_DATA);

  sameTitleCount$: Observable<number>;

  // only provided in update mode
  private originalName: string;

  constructor() {
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
