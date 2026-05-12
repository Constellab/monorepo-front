import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlStatus, FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, switchMap } from 'rxjs';

import { LiCreateFormDTO, LiForm } from '../../model/li-form.entity';
import { LiFormTemplateVersionStatus } from '../../model/li-form.enum';
import { LiFormTemplate } from '../../model/li-form-template.entity';
import { LiFormTemplateVersionSummary } from '../../model/li-form-template-version.entity';
import { liGetFormTemplateVersionStatus } from '../../model/li-form-template-version-status.helper';
import { LiFormService } from '../../service/li-form.service';
import { LiFormTemplateService } from '../../service/li-form-template.service';
import { LiSelectFormTemplateComponent } from '../li-select-form-template/li-select-form-template.component';

interface LiCreateFormFormValue {
  name: string;
  template: LiFormTemplate;
  versionId: string | null;
}

export type LiCreateFormDialogInput = FlFormDialogInput<LiCreateFormFormValue>;

@Component({
  selector: 'li-create-form-dialog',
  templateUrl: './li-create-form-dialog.component.html',
  styleUrl: './li-create-form-dialog.component.scss',
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatCheckbox,
    MatDivider,
    MatSelect,
    MatOption,
    FlCoreDirectiveModule,
    FlFormModule,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    FlStatusModule,
    TranslatePipe,
    LiSelectFormTemplateComponent,
  ],
})
export class LiCreateFormDialogComponent
  extends FlFormDialogAbstractDirective<LiCreateFormFormValue, LiForm>
  implements OnInit
{
  private formService = inject(LiFormService);
  private formTemplateService = inject(LiFormTemplateService);

  dialogInput: LiCreateFormDialogInput = inject(MAT_DIALOG_DATA);

  showVersionPicker = signal(false);
  versions = signal<LiFormTemplateVersionSummary[]>([]);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
    this.prefill();
  }

  private prefill(): void {
    const obj = this.dialogInput.object;
    if (!obj) return;

    if (obj.template) {
      this.formGp.patchValue({ template: obj.template });
      this.onTemplateChanged(obj.template);
    }
    if (obj.versionId) {
      // Wait for versions to load, then select and show picker
      this.formTemplateService.getVersions(obj.template.id).subscribe((versions) => {
        this.versions.set(versions.filter((v) => v.status !== 'DRAFT'));
        this.showVersionPicker.set(true);
        this.versionIdControl.setValidators(Validators.required);
        this.versionIdControl.setValue(obj.versionId);
        this.versionIdControl.updateValueAndValidity();
      });
    }
    if (obj.name) {
      this.formGp.patchValue({ name: obj.name });
    }
  }

  get title(): string {
    return 'li.form_create';
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      name: [null],
      template: [null, Validators.required],
      versionId: [null],
    });
  }

  onTemplateChanged(template: LiFormTemplate): void {
    this.versions.set([]);
    this.versionIdControl.reset(null);
    this.showVersionPicker.set(false);
    this.versionIdControl.clearValidators();
    this.versionIdControl.updateValueAndValidity();

    if (template) {
      this.formTemplateService.getVersions(template.id).subscribe((versions) => {
        this.versions.set(versions.filter((v) => v.status !== 'DRAFT'));
      });
    }
  }

  toggleVersionPicker(checked: boolean): void {
    this.showVersionPicker.set(checked);
    if (checked) {
      this.versionIdControl.setValidators(Validators.required);
    } else {
      this.versionIdControl.reset(null);
      this.versionIdControl.clearValidators();
    }
    this.versionIdControl.updateValueAndValidity();
  }

  getVersionStatus(version: LiFormTemplateVersionSummary): FlStatus<LiFormTemplateVersionStatus> {
    return liGetFormTemplateVersionStatus(version.status);
  }

  create(formValue: LiCreateFormFormValue): Observable<LiForm> {
    if (formValue.versionId) {
      return this.formService.create({
        template_version_id: formValue.versionId,
        name: formValue.name || null,
      });
    }

    return this.formTemplateService.getVersions(formValue.template.id).pipe(
      switchMap((versions) => {
        const published = versions.find((v) => v.status === 'PUBLISHED');
        const versionId = published?.id ?? versions[0]?.id;
        const dto: LiCreateFormDTO = {
          template_version_id: versionId,
          name: formValue.name || null,
        };
        return this.formService.create(dto);
      })
    );
  }

  update(): Observable<LiForm> {
    return null;
  }

  getCreateSuccessMessage(): string {
    return 'li.form_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }

  get templateControl(): FormControl {
    return this.formGp.get('template') as FormControl;
  }

  get versionIdControl(): FormControl {
    return this.formGp.get('versionId') as FormControl;
  }
}
