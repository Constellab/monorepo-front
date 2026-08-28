import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ClHelpService } from '@monorepo/core-lib';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { LiScenario, LiScenarioService, LiScenarioSimpleForm } from '@monorepo/lab-lib/li-core';
import { LiFolderSelectComponent } from '@monorepo/lab-lib/li-folder';
import { LiSelectScenarioTemplateComponent } from '@monorepo/lab-lib/li-scenario-template';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface LiScenarioFormDialogInput extends FlFormDialogInput<LiScenarioSimpleForm> {
  scenarioId?: string;
  disabledFolder?: boolean;
}

/**
 * Dialog form to create or update a scenario
 */
@Component({
  selector: 'li-scenario-form-dialog',
  templateUrl: './li-scenario-form-dialog.component.html',
  styleUrls: ['./li-scenario-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
    LiSelectScenarioTemplateComponent,
    FlInputFileModule,
    LiFolderSelectComponent,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiScenarioFormDialogComponent
  extends FlFormDialogAbstractDirective<LiScenarioSimpleForm, LiScenario>
  implements OnInit
{
  private scenarioService = inject(LiScenarioService);

  dialogInput: LiScenarioFormDialogInput = inject(MAT_DIALOG_DATA);

  sameTitleCount$: Observable<number>;

  // only provided in update mode
  private originalName: string | undefined;

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
      formGroup.get('folder')?.disable();
    }

    return formGroup;
  }

  create(formValue: LiScenarioSimpleForm): Observable<LiScenario> {
    return this.scenarioService.create(formValue);
  }

  update(formValue: LiScenarioSimpleForm): Observable<LiScenario> {
    const scenarioId = this.dialogInput.scenarioId;
    if (scenarioId == null) {
      throw new Error('Cannot update a scenario without a scenarioId');
    }
    return this.scenarioService.update(scenarioId, formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'li.new_scenario' : 'li.update_scenario';
  }

  getCreateSuccessMessage(): string {
    return 'li.scenario_created';
  }

  getUpdateSuccessMessage(): string {
    return 'li.scenario_updated';
  }

  onTitleChange(): void {
    const title = this.formGp.get('title')?.value;

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
