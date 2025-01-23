import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { HaCreateStoryDto, HaStory } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CoStoryCategory } from '@monorepo/community-lib';
import { FlDialogModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { HaIsAdminDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-is-admin/ha-is-admin.directive';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

export type HaCreateStoryDtoInput = FlFormDialogInput<HaCreateStoryDto>;

@Component({
  selector: 'ha-story-create-dialog',
  templateUrl: './ha-story-create-dialog.component.html',
  styleUrls: ['./ha-story-create-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    HaIsAdminDirective,
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
export class HaStoryCreateDialogComponent
  extends FlFormDialogAbstractDirective<HaCreateStoryDto, HaStory>
  implements OnInit
{
  private storyService = inject(HaStoryService);

  dialogInput: HaCreateStoryDtoInput = inject(MAT_DIALOG_DATA);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      title: [null, Validators.required],
      category: [CoStoryCategory.ARTICLE, Validators.required],
    });
  }

  create(formValue: HaCreateStoryDto): Observable<HaStory> {
    return this.storyService.create(formValue);
  }

  update(): Observable<HaStory> {
    throw new Error('Method not implemented.');
  }

  getCreateSuccessMessage(): string {
    return 'story_created';
  }

  getUpdateSuccessMessage(): string {
    throw new Error('Method not implemented.');
  }
}
