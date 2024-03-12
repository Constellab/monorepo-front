import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput, FlSnackBarService} from '@monorepo/front-core-lib';
import {
  HaIcon,
  HaIconCreateDto,
  HaIconCreateFormData,
  HnIconType
} from '../../../ha-core/ha-model/ha-entities/ha-icon.class';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HaIconService} from '../../../ha-core/ha-service/ha-icon.service';
import {Validators} from '@angular/forms';

export type HaCreateIconDtoInput = FlFormDialogInput<HaIconCreateFormData>;

@Component({
  selector: 'ha-icon-create-dialog',
  templateUrl: './ha-icon-create-dialog.component.html',
  styleUrls: ['./ha-icon-create-dialog.component.scss']
})
export class HaIconCreateDialogComponent extends FlFormDialogAbstractDirective<HaIconCreateFormData, HaIcon> implements OnInit {

  input_file_trigered = false;
  icon: HaIconCreateDto

  constructor(snackBarService: FlSnackBarService,
              dialogRef: MatDialogRef<HaIconCreateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) dialogInput: HaCreateIconDtoInput,
              private iconService: HaIconService) {
    super(dialogInput, snackBarService, dialogRef);
    if (this.dialogInput.mode === 'update') {
      this.icon = this.dialogInput.object;
    }
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): FormGroup<HaIconCreateFormData> {
    return new FormBuilder().group({
      technicalName: [null, [Validators.required, Validators.max(30), Validators.pattern(/^[a-z0-9_]+$/)]],
      name: [null, [Validators.required, Validators.max(30)]],
      subNames: [null, [Validators.required, Validators.pattern(/^[^\t\n\r"'`]+$/)]],
      type: [HnIconType.COMMUNITY_ICON, Validators.required],
      file: [null, Validators.required]
    });
  }

  create(formValue: HaIconCreateFormData): Observable<HaIcon> {
    return this.iconService.create({
      subNames: formValue.subNames,
      name: formValue.name,
      type: formValue.type,
      technicalName: formValue.technicalName
    },
    formValue.file);
  }

  getCreateSuccessMessage(): string {
    return "icon_created";
  }

  getUpdateSuccessMessage(): string {
    return "icon_updated";
  }

  update(formValue: HaIconCreateFormData): Observable<HaIcon> {
    return this.iconService.update({
      subNames: formValue.subNames,
      name: formValue.name,
      type: formValue.type,
      technicalName: formValue.technicalName,
      id: this.icon.id
    }, formValue.file?.size > 0 ? formValue.file : null);
  }

  onFileSelected(): void {
    const file: File = this.formGp.get('file').value;
    if (!file) return;
    this.input_file_trigered = true;
    if (file.size > 50000) {
      this.snackBarService.openErrorMessage('file_icon_too_large');
      setTimeout(() => {
        this.formGp.get('file').patchValue(null);
      }, 0);
    }
  }
}
