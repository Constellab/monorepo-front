import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { HaTagKey } from '../../../ha-core/ha-model/ha-entities/ha-tag-key.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HaTagService } from '../../../ha-core/ha-service/ha-tag.service';
import { TranslatePipe } from '@ngx-translate/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { MatInput } from '@angular/material/input';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { MatButton } from '@angular/material/button';
import { CoTagKeyEditAdditionalInfoSpec } from '@monorepo/community-lib';

export interface HaAddAdditionalInfoSpecDialogInputData extends CoTagKeyEditAdditionalInfoSpec {
  tagKeyId: string;
}

export type HaAddAdditionalInfoSpecDialogInput = FlFormDialogInput<HaAddAdditionalInfoSpecDialogInputData>;

@Component({
  selector: 'ha-edit-additional-info-spec-dialog',
  imports: [
    FlDialogModule,
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    FlCorePipeModule,
    MatInput,
    MatLabel,
    MatError,
    FlLoaderModule,
    MatButton,
  ],
  templateUrl: './ha-edit-additional-info-spec-dialog.component.html',
  styleUrl: './ha-edit-additional-info-spec-dialog.component.scss',
})
export class HaEditAdditionalInfoSpecDialogComponent
  extends FlFormDialogAbstractDirective<CoTagKeyEditAdditionalInfoSpec, HaTagKey>
  implements OnInit
{
  private tagService = inject(HaTagService);
  dialogInput: HaAddAdditionalInfoSpecDialogInput = inject(MAT_DIALOG_DATA);
  tagKeyId: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.tagKeyId = this.dialogInput.object.tagKeyId;
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      name: [null, Validators.required],
      optional: [true],
    });
  }

  create(formValue: CoTagKeyEditAdditionalInfoSpec): Observable<HaTagKey> {
    return this.tagService.createAdditionalInfoSpec(this.tagKeyId, formValue);
  }
  update(formValue: CoTagKeyEditAdditionalInfoSpec): Observable<HaTagKey> {
    return this.tagService.updateAdditionalInfoSpec(this.tagKeyId, formValue);
  }
  getCreateSuccessMessage(): string {
    return 'tag-additional-param-spec-created';
  }
  getUpdateSuccessMessage(): string {
    return 'tag-additional-param-spec-updated';
  }
}
