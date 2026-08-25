import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatTooltip } from '@angular/material/tooltip';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import {
  FlConfirmDialogInput,
  FlDialogModule,
  FlFormDialogAbstractDirective,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlImageModule, FlUploadImageDialogConfig } from '@monorepo/front-core-lib/fl-image';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  HaCommunityApp,
  HaCommunityAppEdit,
} from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { HaAppPicturePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-app-picture/ha-app-picture.pipe';
import { HaCommunityAppService } from '../../../ha-core/ha-service/ha-community-app.service';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';

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
    MatIcon,
    MatTooltip,
  ],
  templateUrl: './ha-community-app-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
    return new FormBuilder().group(
      {
        picture: [null],
        title: [null, Validators.required],
        appUrl: [null, [Validators.pattern('^\\s*https?://.+\\s*$')]],
        contactMail: [null, Validators.email],
        description: [null],
        spaceId: [null],
        id: [null],
      },
      {
        validators: this.atLeastOneContactValidator,
      }
    );
  }

  private atLeastOneContactValidator(group: UntypedFormGroup): { [key: string]: boolean } | null {
    const appUrl = group.get('appUrl')?.value;
    const contactMail = group.get('contactMail')?.value;

    const hasAppUrl = appUrl && appUrl.trim().length > 0;
    const hasContactMail = contactMail && contactMail.trim().length > 0;

    return !hasAppUrl && !hasContactMail ? { atLeastOneContactRequired: true } : null;
  }

  create(formValue: HaCommunityAppEdit): Observable<HaCommunityApp> {
    formValue.appUrl = formValue.appUrl?.trim();
    return this.communityAppService.create(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'create_community_app_success';
  }

  getUpdateSuccessMessage(): string {
    return 'edit_community_app_success';
  }

  update(formValue: HaCommunityAppEdit): Observable<HaCommunityApp> {
    formValue.appUrl = formValue.appUrl?.trim();
    return this.communityAppService.update(formValue);
  }
}
