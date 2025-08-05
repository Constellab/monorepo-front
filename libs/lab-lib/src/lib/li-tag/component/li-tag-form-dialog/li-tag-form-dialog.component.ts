import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTag, FlTagHelper } from '@monorepo/front-core-lib/fl-tag';
import { LiCreateTagResponse, LiTagService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * Dialog to create of update a tag
 */
@Component({
  selector: 'li-tag-form-dialog',
  templateUrl: './li-tag-form-dialog.component.html',
  styleUrls: ['./li-tag-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiTagFormDialogComponent
  extends FlFormDialogAbstractDirective<FlTag, LiCreateTagResponse>
  implements OnInit
{
  private tagService = inject(LiTagService);

  maxLength = FlTagHelper.MAX_LENGTH;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    const defaultKey = this.dialogInput.object?.key ?? null;
    return new FormBuilder().group({
      key: [
        {
          value: defaultKey,
          disabled: defaultKey != null,
        },
        Validators.required,
      ],
      value: [null, Validators.required],
    });
  }

  create(formValue: FlTag): Observable<LiCreateTagResponse> {
    return this.tagService.createTag(formValue.key, formValue.value);
  }

  getCreateSuccessMessage(): string {
    return 'li.tag_created';
  }

  getUpdateSuccessMessage(): string {
    return 'li.tag_updated';
  }

  update(formValue: FlTag): Observable<LiCreateTagResponse> {
    return this.tagService.updateTag(
      this.dialogInput.object.key,
      this.dialogInput.object.value,
      formValue.value
    );
  }

  get title(): string {
    return this.isCreateMode() ? 'li.tag_create' : 'li.tag_update';
  }
}
