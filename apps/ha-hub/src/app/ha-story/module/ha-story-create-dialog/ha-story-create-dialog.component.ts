import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { HaCreateStoryDto, HaStory } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoStoryCategory } from '@monorepo/community-lib';

export type HaCreateStoryDtoInput = FlFormDialogInput<HaCreateStoryDto>;

@Component({
  selector: 'ha-story-create-dialog',
  templateUrl: './ha-story-create-dialog.component.html',
  styleUrls: ['./ha-story-create-dialog.component.scss'],
  standalone: false,
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
