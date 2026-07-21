import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatInput } from '@angular/material/input';
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
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HaEditPartnerDto, HaPartnerDetail } from '../../../ha-core/ha-model/ha-entities/ha-partner';
import { HaPartnerService } from '../../../ha-core/ha-service/ha-partner.service';

export type HaEditPartnerDialogInput = FlFormDialogInput<HaEditPartnerDto>;

@Component({
  selector: 'ha-partner-edit-dialog',
  templateUrl: './ha-partner-edit-dialog.component.html',
  styleUrls: ['./ha-partner-edit-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    FlCorePipeModule,
    MatError,
    FlLoaderModule,
    MatButton,
    FlImageModule,
    MatIcon,
    MatTooltip,
  ],
})
export class HaPartnerEditDialogComponent
  extends FlFormDialogAbstractDirective<HaEditPartnerDto, HaPartnerDetail>
  implements OnInit
{
  private partnerService = inject(HaPartnerService);

  dialogInput: HaEditPartnerDialogInput;
  imageConfig: FlUploadImageDialogConfig;
  deleteImageConfig: FlConfirmDialogInput;
  partnerId: string;
  basePartnerName: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();

    if (this.dialogInput.mode === 'update') {
      this.partnerId = this.dialogInput.object.id;
      this.basePartnerName = this.dialogInput.object.name;

      this.imageConfig = {
        title: { text: 'upload_partner_logo', translateText: true },
        helpText: { text: 'image_square_help', translateText: true },
        imagePreviewWidth: 115,
        imagePreviewHeight: 115,
        compressOptions: {
          cropWidth: 300,
          cropHeight: 300,
          resizeWidthMax: 300,
        },
        uploadImage: (file: File) => {
          return this.partnerService.uploadLogo(file, this.partnerId).pipe(
            map((file: any) => {
              this.formGp.controls.logo.patchValue(file.filename);
              this.dialogRef.close({ id: this.partnerId });
            })
          );
        },
        uploadImageSuccessMessage: {
          text: 'partner_logo_uploaded',
          translateText: true,
        },
      };

      this.deleteImageConfig = {
        title: 'delete_partner_logo',
        content: 'delete_partner_logo_confirmation',
        observable: this.partnerService.deleteLogo(this.partnerId, this.formGp.value.logo).pipe(
          map(() => {
            this.formGp.controls.logo.patchValue(null);
            this.dialogRef.close({ id: this.partnerId });
          })
        ),
        successMessage: 'partner_logo_deleted',
      };
    }
  }
  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      name: [null, Validators.required],
      logo: [null],
    });
  }
  create(formValue: HaEditPartnerDto): Observable<HaPartnerDetail> {
    return this.partnerService.createPartner(formValue);
  }
  update(formValue: HaEditPartnerDto): Observable<HaPartnerDetail> {
    return this.partnerService.updatePartner(this.partnerId, formValue);
  }
  getCreateSuccessMessage(): string {
    return 'partner_created';
  }
  getUpdateSuccessMessage(): string {
    return 'partner_updated';
  }

  getImageUrl(imageName: string): string {
    return this.partnerService.getImageUrl(this.partnerId, imageName);
  }
}
