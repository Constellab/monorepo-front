import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { LabShareLink, LabShareLinkType } from '../../../../model/entities/lab-share.entity';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { LabShareLinkService } from '../../../../entity-service/lab-share-link.service';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatSuffix, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabShareLinkFormDialogInput extends FlFormDialogInput<LabShareLink> {
  createTitle?: string;
  entityId?: string;
  entityType?: LabShareLinkType;
}

@Component({
  selector: 'lab-share-link-form-dialog',
  templateUrl: './lab-share-link-form-dialog.component.html',
  styleUrls: ['./lab-share-link-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatHint,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    TranslatePipe,
  ],
})
export class LabShareLinkFormDialogComponent
  extends FlFormDialogAbstractDirective<Partial<LabShareLink>, LabShareLink>
  implements OnInit
{
  dialogInput: LabShareLinkFormDialogInput = inject(MAT_DIALOG_DATA);

  private shareLinkService = inject(LabShareLinkService);

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      entityId: [this.dialogInput.entityId, Validators.required],
      entityType: [this.dialogInput.entityType, Validators.required],
      validUntil: [null],
    });
  }

  create(formValue: Partial<LabShareLink>): Observable<LabShareLink> {
    return this.shareLinkService.create(formValue);
  }

  update(formValue: Partial<LabShareLink>): Observable<LabShareLink> {
    return this.shareLinkService.update(formValue);
  }

  get title(): string {
    return this.isCreateMode() ? this.dialogInput.createTitle : 'biox.update_share_link';
  }

  getCreateSuccessMessage(): string {
    return 'biox.share_entity_success';
  }

  getUpdateSuccessMessage(): string {
    return 'biox.share_link_updated';
  }
}
