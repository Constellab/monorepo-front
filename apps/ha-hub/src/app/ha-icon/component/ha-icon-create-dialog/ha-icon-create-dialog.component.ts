import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { HaIconCreateFormData } from '../../../ha-core/ha-model/ha-entities/ha-icon.class';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { HaIconService } from '../../../ha-core/ha-service/ha-icon.service';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CoIcon, CoIconType } from '@monorepo/community-lib';
import { FlDialogModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { FlInputFileModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-input-file/fl-input-file.module';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

export type HaCreateIconDtoInput = FlFormDialogInput<HaIconCreateFormData>;

@Component({
  selector: 'ha-icon-create-dialog',
  templateUrl: './ha-icon-create-dialog.component.html',
  styleUrls: ['./ha-icon-create-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    FlInputFileModule,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class HaIconCreateDialogComponent
  extends FlFormDialogAbstractDirective<HaIconCreateFormData, CoIcon>
  implements OnInit
{
  private iconService = inject(HaIconService);

  dialogInput: HaCreateIconDtoInput = inject(MAT_DIALOG_DATA);

  input_file_trigered = false;
  icon: HaIconCreateFormData;

  constructor() {
    super();
    if (this.dialogInput.mode === 'update') {
      this.icon = this.dialogInput.object;
    }
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      technicalName: [null, [Validators.required, Validators.max(30), Validators.pattern(/^[a-z0-9_]+$/)]],
      name: [null, [Validators.required, Validators.max(30)]],
      subNames: [null, [Validators.required, Validators.pattern(/^[^\t\n\r"'`]+$/)]],
      type: [CoIconType.COMMUNITY_ICON, Validators.required],
      file: [null, Validators.required],
    });
  }

  create(formValue: HaIconCreateFormData): Observable<CoIcon> {
    return this.iconService.create(
      {
        subNames: formValue.subNames,
        name: formValue.name,
        type: formValue.type,
        technicalName: formValue.technicalName,
      },
      formValue.file
    );
  }

  getCreateSuccessMessage(): string {
    return 'icon_created';
  }

  getUpdateSuccessMessage(): string {
    return 'icon_updated';
  }

  update(formValue: HaIconCreateFormData): Observable<CoIcon> {
    return this.iconService.update(
      {
        subNames: formValue.subNames,
        name: formValue.name,
        type: formValue.type,
        technicalName: formValue.technicalName,
        id: this.icon.id,
      },
      formValue.file?.size > 0 ? formValue.file : null
    );
  }

  onFileSelected(): void {
    const file: File = this.formGp.get('file').value;
    if (!file) return;
    this.input_file_trigered = true;
    if (file.size > 50000) {
      this.snackBarService.openErrorMessage({
        text: 'file_icon_too_large',
        translateText: true,
      });
      setTimeout(() => {
        this.formGp.get('file').patchValue(null);
      }, 0);
    }
  }
}
