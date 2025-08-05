import { Component, inject,OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { LiShareLink, LiShareLinkEntityType, LiShareLinkService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export interface LiShareLinkFormDialogInput extends FlFormDialogInput<LiShareLink> {
  createTitle?: string;
  entityId?: string;
  entityType?: LiShareLinkEntityType;
}

/**
 * Dialog to create or update a share link
 * In create mode, it creates a PUBLIC share link
 * In update mode, it updates the share link (PUBLIC or SPACE)
 */
@Component({
  selector: 'li-share-link-form-dialog',
  templateUrl: './li-share-link-form-dialog.component.html',
  styleUrls: ['./li-share-link-form-dialog.component.scss'],
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
export class LiShareLinkFormDialogComponent
  extends FlFormDialogAbstractDirective<Partial<LiShareLink>, LiShareLink>
  implements OnInit
{
  dialogInput: LiShareLinkFormDialogInput = inject(MAT_DIALOG_DATA);

  private shareLinkService = inject(LiShareLinkService);

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

  create(formValue: Partial<LiShareLink>): Observable<LiShareLink> {
    return this.shareLinkService.createPublicShareLink(formValue);
  }

  update(formValue: Partial<LiShareLink>): Observable<LiShareLink> {
    return this.shareLinkService.update(formValue.id, formValue.validUntil);
  }

  get title(): string {
    if (this.isCreateMode()) {
      return this.dialogInput.createTitle;
    }

    return this.dialogInput.object.linkType === 'PUBLIC'
      ? 'li.update_share_link'
      : 'li.update_space_share_link';
  }

  getCreateSuccessMessage(): string {
    return 'li.share_entity_success';
  }

  getUpdateSuccessMessage(): string {
    return 'li.share_link_updated';
  }

  get isPublicLink(): boolean {
    return this.isCreateMode() || this.dialogInput.object.linkType === 'PUBLIC';
  }
}
