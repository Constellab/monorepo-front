import { Component, inject, OnInit } from '@angular/core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { LabShareLink, LabShareLinkEntityType } from '../../../../model/entities/lab-share.entity';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LabShareLinkService } from '../../../../entity-service/lab-share-link.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabShareLinkFormDialogInput extends FlFormDialogInput<LabShareLink> {
  createTitle?: string;
  entityId?: string;
  entityType?: LabShareLinkEntityType;
}

/**
 * Dialog to create or update a share link
 * In create mode, it creates a PUBLIC share link
 * In update mode, it updates the share link (PUBLIC or SPACE)
 */
@Component({
  selector: 'lab-share-link-form-dialog',
  templateUrl: './lab-share-link-form-dialog.component.html',
  styleUrls: ['./lab-share-link-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
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
    return this.shareLinkService.createPublicShareLink(formValue);
  }

  update(formValue: Partial<LabShareLink>): Observable<LabShareLink> {
    return this.shareLinkService.update(formValue.id, formValue.validUntil);
  }

  get title(): string {
    if (this.isCreateMode()) {
      return this.dialogInput.createTitle;
    }

    return this.dialogInput.object.linkType === 'PUBLIC'
      ? 'biox.update_share_link'
      : 'biox.update_space_share_link';
  }

  getCreateSuccessMessage(): string {
    return 'biox.share_entity_success';
  }

  getUpdateSuccessMessage(): string {
    return 'biox.share_link_updated';
  }

  get isPublicLink(): boolean {
    return this.isCreateMode() || this.dialogInput.object.linkType === 'PUBLIC';
  }
}
