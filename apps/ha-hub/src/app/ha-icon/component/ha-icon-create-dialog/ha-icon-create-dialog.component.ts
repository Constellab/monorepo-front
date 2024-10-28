import { Component, inject, OnInit } from '@angular/core';
import {
  FlFormDialogAbstractDirective,
  FlFormDialogInput,
} from '@monorepo/front-core-lib';
import { HaIconCreateFormData } from '../../../ha-core/ha-model/ha-entities/ha-icon.class';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HaIconService } from '../../../ha-core/ha-service/ha-icon.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CoIcon, CoIconType } from '@monorepo/community-lib';

export type HaCreateIconDtoInput = FlFormDialogInput<HaIconCreateFormData>;

@Component({
  selector: 'ha-icon-create-dialog',
  templateUrl: './ha-icon-create-dialog.component.html',
  styleUrls: ['./ha-icon-create-dialog.component.scss'],
})
export class HaIconCreateDialogComponent
  extends FlFormDialogAbstractDirective<HaIconCreateFormData, CoIcon>
  implements OnInit
{
  dialogInput: HaCreateIconDtoInput = inject(MAT_DIALOG_DATA);

  input_file_trigered = false;
  icon: HaIconCreateFormData;

  constructor(private iconService: HaIconService) {
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
      technicalName: [
        null,
        [
          Validators.required,
          Validators.max(30),
          Validators.pattern(/^[a-z0-9_]+$/),
        ],
      ],
      name: [null, [Validators.required, Validators.max(30)]],
      subNames: [
        null,
        [Validators.required, Validators.pattern(/^[^\t\n\r"'`]+$/)],
      ],
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
