import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatError, MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption, MatSelect } from '@angular/material/select';
import { CoTagKeyType } from '@monorepo/community-lib';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlDebouncer, FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { HaCoServiceConfig } from '../../../ha-core/ha-model/ha-config/ha-co-service.config';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { HaTagKey, HaTagKeyEditDTO } from '../../../ha-core/ha-model/ha-entities/ha-tag-key.class';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';
import { HaTagService } from '../../../ha-core/ha-service/ha-tag.service';

export type HaTagKeyEditDialogInput = FlFormDialogInput<HaTagKeyEditDTO>;

@Component({
  selector: 'ha-tag-key-edit-dialog',
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
    MatSelect,
    MatOption,
    MatRadioButton,
    MatRadioGroup,
    FlSectionModule,
    MatButton,
    MatError,
  ],
  templateUrl: './ha-tag-key-edit-dialog.component.html',
  styleUrl: './ha-tag-key-edit-dialog.component.scss',
})
export class HaTagKeyEditDialogComponent
  extends FlFormDialogAbstractDirective<HaTagKeyEditDTO, HaTagKey>
  implements OnInit, OnDestroy
{
  private tagService = inject(HaTagService);
  private spaceService = inject(HaSpaceService);
  private coServiceConfig = inject(HaCoServiceConfig);
  dialogInput: HaTagKeyEditDialogInput = inject(MAT_DIALOG_DATA);

  tagTypes: string[] = [CoTagKeyType.STRING]; // TODO: Add other tag types when the lab is ready
  visibilityFormControl: FormControl<'PUBLIC' | 'SPACE'>;
  spaces: HaSpace[];

  labelSubscription: Subscription;
  visibilitySubscription: Subscription;
  spaceSubscription: Subscription;

  technicalNamePrefix: string = '';

  technicalNameManuallySet = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
    if (this.dialogInput.mode === 'update') {
      this.technicalNameManuallySet = true;
      this.formGp.controls['technicalName'].disable();
    }
    const visibility = this.dialogInput?.object?.space ? 'SPACE' : 'PUBLIC';
    this.visibilityFormControl = new FormControl<'PUBLIC' | 'SPACE'>(visibility);
    this.spaceService.getSpacesOfCurrentUser().subscribe((spaces) => {
      this.spaces = spaces;
    });

    this.labelSubscription = this.formGp.controls['label'].valueChanges
      .pipe(debounceTime(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME))
      .subscribe((label) => this.onLabelChange(label));

    this.visibilitySubscription = this.visibilityFormControl.valueChanges.subscribe((visibility) =>
      this.onVisibilityChange(visibility)
    );

    this.spaceSubscription = this.formGp.controls['space'].valueChanges.subscribe((space) =>
      this.onSpaceChange(space)
    );

    this.updateTechnicalNamePrefix();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      technicalName: [null, Validators.required],
      label: [null, Validators.required],
      type: [CoTagKeyType.STRING, Validators.required],
      unit: [null],
      space: [null],
    });
  }

  create(formValue: HaTagKeyEditDTO): Observable<HaTagKey> {
    formValue.technicalName = this.technicalNamePrefix + formValue.technicalName;
    return this.tagService.create(formValue);
  }

  update(formValue: HaTagKeyEditDTO): Observable<HaTagKey> {
    formValue.technicalName = this.technicalNamePrefix + formValue.technicalName;
    return this.tagService.update(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'tag_key_created';
  }

  getUpdateSuccessMessage(): string {
    return 'tag_key_updated';
  }

  getSpacePhoto(photo: string): string {
    return this.coServiceConfig.getSpacePhotoUrl(photo);
  }

  onLabelChange(label: string): void {
    if (
      this.technicalNameManuallySet ||
      this.formGp.controls['label'].value == null ||
      this.formGp.controls['label'].value == ''
    )
      return;

    this.formGp.controls['technicalName'].patchValue(ClStringHelper.getCleanUrlPath(label).replace('-', '_'));
  }

  onVisibilityChange(visibility: 'PUBLIC' | 'SPACE'): void {
    if (visibility === 'PUBLIC') {
      this.formGp.controls['space'].patchValue('public');
    } else {
      this.formGp.controls['space'].patchValue(this.spaces[0].id);
    }
    this.updateTechnicalNamePrefix();
  }

  onSpaceChange(space: string): void {
    if (!space) return;
    if (
      this.technicalNameManuallySet ||
      this.formGp.controls['label'].value == null ||
      this.formGp.controls['label'].value == ''
    )
      return;

    this.updateTechnicalNamePrefix();
  }

  private updateTechnicalNamePrefix(): void {
    if (this.dialogInput.mode === 'update') return;
    let prefix = '';
    if (this.visibilityFormControl.value === 'PUBLIC') {
      prefix = 'pu_';
    } else {
      prefix = 'sp_' + this.formGp.controls['space'].value.split('-')[0] + '_';
    }
    this.technicalNamePrefix = prefix;
  }

  ngOnDestroy(): void {
    if (this.labelSubscription) {
      this.labelSubscription.unsubscribe();
    }

    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }

    if (this.spaceSubscription) {
      this.spaceSubscription.unsubscribe();
    }
  }
}
