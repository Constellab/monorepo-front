import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { CoIcon, CoIconType } from '@monorepo/community-lib';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { HaIconCreateFormData } from '../../../ha-core/ha-model/ha-entities/ha-icon.class';
import { HaIconService } from '../../../ha-core/ha-service/ha-icon.service';

export type HaCreateIconDtoInput = FlFormDialogInput<HaIconCreateFormData>;

@Component({
  selector: 'ha-icon-create-dialog',
  templateUrl: './ha-icon-create-dialog.component.html',
  styleUrls: ['./ha-icon-create-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
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
