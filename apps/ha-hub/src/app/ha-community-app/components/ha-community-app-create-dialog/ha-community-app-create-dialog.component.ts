import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import {
  HaCommunityApp,
  HaCommunityAppEdit,
} from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import {
  FlConfirmDialogInput,
  FlDialogModule,
  FlFormDialogAbstractDirective,
} from '@monorepo/front-core-lib/fl-dialog';
import { HaCommunityAppService } from '../../../ha-core/ha-service/ha-community-app.service';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';
import { Observable } from 'rxjs';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { FlImageModule, FlUploadImageDialogConfig } from '@monorepo/front-core-lib/fl-image';
import { map } from 'rxjs/operators';
import { HaAppPicturePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-app-picture/ha-app-picture.pipe';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { AsyncPipe } from '@angular/common';

export type HaCreateCommunityAppInput = FlFormDialogInput<HaCommunityAppEdit>;

@Component({
  selector: 'ha-community-app-create-dialog',
  imports: [
    FlDialogModule,
    TranslatePipe,
    FormsModule,
    ReactiveFormsModule,
    FlCorePipeModule,
    MatInput,
    FlCoreDirectiveModule,
    MatFormFieldModule,
    MatButton,
    FlLoaderModule,
    TeTextEditorModule,
    FlImageModule,
    HaAppPicturePipe,
    MatRadioButton,
    MatRadioGroup,
    AsyncPipe,
  ],
  templateUrl: './ha-community-app-create-dialog.component.html',
  styleUrl: './ha-community-app-create-dialog.component.scss',
})
export class HaCommunityAppCreateDialogComponent
  extends FlFormDialogAbstractDirective<HaCommunityAppEdit, HaCommunityApp>
  implements OnInit
{
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);
  private spaceService = inject(HaSpaceService);

  spaces$: Observable<HaSpace[]>;
  imageConfig: FlUploadImageDialogConfig;
  deleteImageConfig: FlConfirmDialogInput;

  ngOnInit(): void {
    this.spaces$ = this.spaceService.getSpacesOfCurrentUser();
    this.init();

    this.imageConfig = {
      title: { text: 'upload_app_picture', translateText: true },
      helpText: { text: 'image_square_help', translateText: true },
      imagePreviewWidth: 115,
      imagePreviewHeight: 115,
      compressOptions: {
        cropWidth: 300,
        cropHeight: 300,
        resizeWidthMax: 300,
      },
      uploadImage: (file: File) => {
        return this.communityAppService.uploadAppPicture(file).pipe(
          map((file: any) => {
            this.formGp.controls.picture.patchValue(file.filename);
          })
        );
      },
      uploadImageSuccessMessage: {
        text: 'app_picture_uploaded',
        translateText: true,
      },
    };

    this.deleteImageConfig = {
      title: 'delete_app_picture',
      content: 'delete_app_picture_confirmation',
      observable: this.communityAppService
        .deleteFile(this.formGp.value.picture)
        .pipe(map(() => this.formGp.controls.picture.patchValue(null))),
      successMessage: 'app_picture_deleted',
    };
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      picture: [null],
      title: [null, Validators.required],
      appUrl: [null, [Validators.required, Validators.pattern('https?://.+')]],
      description: [null],
      spaceId: [null],
      id: [null],
    });
  }

  create(formValue: HaCommunityAppEdit): Observable<HaCommunityApp> {
    return this.communityAppService.create(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'create_community_app_success';
  }

  getUpdateSuccessMessage(): string {
    return 'edit_community_app_success';
  }

  update(formValue: HaCommunityAppEdit): Observable<HaCommunityApp> {
    return this.communityAppService.update(formValue);
  }
}
