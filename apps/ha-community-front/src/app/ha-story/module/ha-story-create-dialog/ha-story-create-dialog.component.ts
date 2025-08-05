import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CoStoryCategory } from '@monorepo/community-lib';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { HaCreateStoryDto, HaStory } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';

export type HaCreateStoryDtoInput = FlFormDialogInput<HaCreateStoryDto>;

@Component({
  selector: 'ha-story-create-dialog',
  templateUrl: './ha-story-create-dialog.component.html',
  styleUrls: ['./ha-story-create-dialog.component.scss'],
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
      category: [CoStoryCategory.ARTICLE],
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
