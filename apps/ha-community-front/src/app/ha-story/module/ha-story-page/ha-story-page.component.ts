import { NgClass } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeBlockHeaderLevel, TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { first } from 'rxjs';

import { HaCommentsSectionComponent } from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-section/ha-comments-section.component';
import { HaEntityPageInfosComponent } from '../../../ha-core/ha-component/ha-entity-page-infos/ha-entity-page-infos.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { HaEntityCommentState } from '../../../ha-core/ha-state/ha-entity-comment.state';
import { HaStoryState } from '../../ha-story-core/state/ha-story.state';
import { HaStoryTextEditorConfig } from '../ha-story-edit-page/ha-story-text-editor.config';

@Component({
  selector: 'ha-story-page',
  templateUrl: './ha-story-page.component.html',
  styleUrls: ['./ha-story-page.component.scss'],
  imports: [
    FlTextIconModule,
    FlUserModule,
    FlDateModule,
    FlKeyValueModule,
    TeTextEditorModule,
    ReactiveFormsModule,
    FlLoaderModule,
    HaPageComponent,
    HaCommentsSectionComponent,
    HaEntityPageInfosComponent,
    TranslatePipe,
    RouterLink,
    NgClass,
    FlCoreComponentModule,
    MatButton,
    MatIcon,
  ],
  providers: [HaStoryState, HaEntityCommentState],
})
export class HaStoryPageComponent extends HaCommunityPageDirective implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private storyService: HaStoryService = inject(HaStoryService);
  private entityCommentState: HaEntityCommentState = inject(HaEntityCommentState);
  titles = computed(() => {
    if (!this.story()?.content) return [];
    return this.story().content?.getHeadersData([TeBlockHeaderLevel.HEADER_1, TeBlockHeaderLevel.HEADER_2]);
  });
  tempTitle: string;

  textEditorConfig: HaStoryTextEditorConfig;
  entityType = HaEntityType.STORY;
  isAuthor = computed(() => {
    if (!this.currentUser() || !this.story()) return false;
    return this.currentUser().id === this.story().createdBy.id;
  });
  formControl: FormControl<TeRichText> = new FormControl();
  private storyState: HaStoryState = inject(HaStoryState);
  isLoading = this.storyState.getIsLoading();
  notFound = this.storyState.getNotFound();
  currentUser = this.storyState.getCurrentUser();
  storyFiles = this.storyState.getStoryFiles();
  storyFileDocPrefix = this.storyState.getStoryFileUrlPrefix();
  canEdit = this.storyState.canEdit;
  story = computed(() => {
    const story = this.storyState.getStory()();
    if (!story) return story;
    this.formControl.patchValue(story.content);
    this.formControl.disable();
    return story;
  });
  contributors = computed(() => {
    const coAuthors = this.storyState.coAuthors();
    if (!this.story() || !coAuthors) return [];
    return [this.story().createdBy, ...coAuthors];
  });

  ngOnInit(): void {
    this.activatedRoute.params.pipe(first()).subscribe((params) => {
      this.textEditorConfig = new HaStoryTextEditorConfig(this.storyService, params.id);
      this.tempTitle = ClStringHelper.fromKebabCaseToSentence(params.title);
      this.storyState.init(params.id);
      this.entityCommentState.init(this.entityType, params.id);
    });
  }

  openStoryEditDialog(): void {}
}
