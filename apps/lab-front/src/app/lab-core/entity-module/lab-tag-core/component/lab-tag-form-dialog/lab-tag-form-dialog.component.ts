import { Component, OnInit, inject } from '@angular/core';
import { FlFormDialogAbstractDirective, FlTag, FlTagHelper } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { LabCreateTagResponse } from '../../../../model/entities/lab-tag.entity';
import { LabTagService } from '../../../../entity-service/lab-tag.service';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog to create of update a tag
 */
@Component({
  selector: 'lab-tag-form-dialog',
  templateUrl: './lab-tag-form-dialog.component.html',
  styleUrls: ['./lab-tag-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
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
export class LabTagFormDialogComponent
  extends FlFormDialogAbstractDirective<FlTag, LabCreateTagResponse>
  implements OnInit
{
  private tagService = inject(LabTagService);

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

  create(formValue: FlTag): Observable<LabCreateTagResponse> {
    return this.tagService.createTag(formValue.key, formValue.value);
  }

  getCreateSuccessMessage(): string {
    return 'tag_created';
  }

  getUpdateSuccessMessage(): string {
    return 'tag_updated';
  }

  update(formValue: FlTag): Observable<LabCreateTagResponse> {
    return this.tagService.updateTag(
      this.dialogInput.object.key,
      this.dialogInput.object.value,
      formValue.value
    );
  }

  get title(): string {
    return this.isCreateMode() ? 'tag_create' : 'tag_update';
  }
}
