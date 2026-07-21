import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import {
  FlConfirmDialogInput,
  FlDialogModule,
  FlFormDialogAbstractDirective,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlImageModule, FlUploadImageDialogConfig } from '@monorepo/front-core-lib/fl-image';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  HaBrick,
  HaBrickVisibility,
  HaEditBrickDTO,
} from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { HaBrickImagePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-brick-image/ha-brick-image.pipe';
import { HaBrickService } from '../../../ha-core/ha-service/ha-brick.service';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';

@Component({
  selector: 'ha-edit-brick-dialog',
  templateUrl: './ha-edit-brick-dialog.component.html',
  styleUrls: ['./ha-edit-brick-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    FlImageModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatRadioGroup,
    MatRadioButton,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
    HaBrickImagePipe,
    MatIcon,
    MatTooltip,
  ],
})
export class HaEditBrickDialogComponent
  extends FlFormDialogAbstractDirective<Partial<HaEditBrickDTO>>
  implements OnInit
{
  private spaceService = inject(HaSpaceService);
  private brickService = inject(HaBrickService);

  isLoading = false;
  repoError: boolean;
  spaces: HaSpace[];
  isPhotoLoading = false;
  hasCredentialPassword = false;

  imageConfig: FlUploadImageDialogConfig;
  deleteImageConfig: FlConfirmDialogInput;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
    this.formGp.value.id = this.dialogInput.object.id;
    this.hasCredentialPassword = !!this.dialogInput.object.hasCredentialPassword;
    this.spaceService.getSpacesOfCurrentUser().subscribe((spaces: HaSpace[]) => {
      this.spaces = spaces;
    });

    this.imageConfig = {
      title: { text: 'upload_brick_picture', translateText: true },
      helpText: { text: 'image_square_help', translateText: true },
      imagePreviewWidth: 150,
      imagePreviewHeight: 150,
      compressOptions: {
        cropWidth: 300,
        cropHeight: 300,
        resizeWidthMax: 300,
      },
      uploadImage: (file: File) => {
        return this.brickService.editBrickImage(this.formGp.value.id, file).pipe(
          map((image: any) => {
            this.formGp.controls.imageLink.patchValue(image.filename);
          })
        );
      },
      uploadImageSuccessMessage: { text: 'brick_picture_uploaded', translateText: true },
    };

    this.deleteImageConfig = {
      title: 'brick_delete_photo',
      content: 'brick_delete_photo_confirmation',
      observable: this.brickService.deleteBrickImage(this.formGp.value.imageLink).pipe(
        map(() => {
          this.formGp.controls.imageLink.patchValue(null);
        })
      ),
      successMessage: 'brick_photo_deleted',
    };
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      description: [null, [Validators.required, Validators.maxLength(255)]],
      gitRepo: [null],
      pipRepo: [null],
      credentialUsername: [null],
      credentialPassword: [null],
      space: [null],
      imageLink: [null],
    });
  }

  create(): Observable<HaBrick> {
    return null;
  }

  submit(): void {
    if (!this.formGp.value.gitRepo && !this.formGp.value.pipRepo) {
      this.repoError = true;
      this.formGp.controls.pipRepo.setValidators(Validators.required);
      this.formGp.controls.gitRepo.setValidators(Validators.required);
    } else {
      this.repoError = false;
      this.formGp.controls.pipRepo.removeValidators(Validators.required);
      this.formGp.controls.gitRepo.removeValidators(Validators.required);

      if (this.formGp.valid) {
        const formValue: HaEditBrickDTO = {
          ...this.formGp.value,
          visibility: this.formGp.value.space ? HaBrickVisibility.PRIVATE : HaBrickVisibility.PUBLIC,
        };
        if (!this.formGp.value.credentialPassword) {
          delete formValue.credentialPassword;
        }
        this.update(formValue).subscribe({
          next: (newEntity) => this.onSaveSuccess(newEntity, this.getUpdateSuccessMessage()),
          error: () => (this.isLoading = false),
        });
      }
    }
  }

  update(formValue: HaEditBrickDTO): Observable<HaBrick> {
    return this.brickService.editBrick(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'brick_created';
  }

  getUpdateSuccessMessage(): string {
    return 'brick_updated';
  }

  onFileSelected(file: File | File[]): void {
    if (this.isPhotoLoading) return;
    this.isPhotoLoading = true;
    this.brickService.editBrickImage(this.formGp.value.id, file as File).subscribe((image) => {
      this.brickService.deleteBrickImage(this.formGp.value.imageLink).subscribe();
      this.formGp.controls.imageLink.patchValue(image.filename);
    });
  }
}
