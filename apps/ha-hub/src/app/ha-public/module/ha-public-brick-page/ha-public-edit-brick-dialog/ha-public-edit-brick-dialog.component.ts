import { Component, OnInit } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlFormDialogAbstractDirective,
  FlUploadImageDialogConfig,
} from '@monorepo/front-core-lib';
import { HaBrick, HaEditBrickDTO } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HaBrickService } from '../../../../ha-core/ha-service/ha-brick.service';
import { HaSpace } from '../../../../ha-core/ha-model/ha-entities/ha-space.class';
import { HaSpaceService } from '../../../../ha-core/ha-service/ha-space.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ha-ha-public-edit-brick-dialog',
  templateUrl: './ha-public-edit-brick-dialog.component.html',
  styleUrls: ['./ha-public-edit-brick-dialog.component.scss'],
})
export class HaPublicEditBrickDialogComponent
  extends FlFormDialogAbstractDirective<Partial<HaEditBrickDTO>>
  implements OnInit
{
  isLoading: boolean = false;
  repoError: boolean;
  spaces: HaSpace[];
  isPhotoLoading = false;

  imageConfig: FlUploadImageDialogConfig;
  deleteImageConfig: FlConfirmDialogInput;

  constructor(
    private spaceService: HaSpaceService,
    private brickService: HaBrickService
  ) {
    super();
  }

  ngOnInit(): void {
    this.init();
    this.formGp.value.id = this.dialogInput.object.id;
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
      visibility: [null],
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
        this.update(this.formGp.value as HaEditBrickDTO).subscribe({
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
