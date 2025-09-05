import { AsyncPipe, NgClass } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChipGrid, MatChipInput, MatChipRemove, MatChipRow } from '@angular/material/chips';
import { MatOption } from '@angular/material/core';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlConfirmDialogInput, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlImageModule, FlUploadImageDialogConfig } from '@monorepo/front-core-lib/fl-image';
import { FlOverlayRef, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import {
  TeRichText,
  TeTextEditorHistoryPortalComponent,
  TeTextEditorHistoryPortalData,
  TeTextEditorModule,
} from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { mergeMap, Observable, of, startWith } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  HaCoAuthorDialogComponent,
  HaCoAuthorsDialogInput,
} from '../../../ha-core/entity-module/ha-co-author-core/component/ha-co-author-dialog/ha-co-author-dialog.component';
import { HaStory } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { HaTopic, HaTopicDto } from '../../../ha-core/ha-model/ha-entities/ha-topic.class';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaIsAuthenticatedDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-is-authenticated/ha-is-authenticated.directive';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { HaTopicService } from '../../../ha-core/ha-service/ha-topic.service';
import { Ha404Component } from '../../../ha404/ha404.component';
import { HaStoryTextEditorConfig } from './ha-story-text-editor.config';

// TODO @vfoex, composant a refactor, trop gros complexe (Refactor avec le auto save composant ?)
@Component({
  selector: 'ha-story-edit-page',
  templateUrl: './ha-story-edit-page.component.html',
  styleUrls: ['./ha-story-edit-page.component.scss'],
  imports: [
    MatIcon,
    FlTextIconModule,
    ReactiveFormsModule,
    FlFormModule,
    FlImageModule,
    MatFormField,
    MatOption,
    MatLabel,
    MatChipGrid,
    MatChipRow,
    MatChipRemove,
    MatInput,
    FlCoreDirectiveModule,
    MatAutocompleteTrigger,
    MatChipInput,
    MatAutocomplete,
    MatSuffix,
    MatTooltip,
    HaIsAuthenticatedDirective,
    MatButton,
    TeTextEditorModule,
    MatIconButton,
    MatError,
    NgClass,
    Ha404Component,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class HaStoryEditPageComponent implements OnInit {
  private storyService = inject(HaStoryService);
  private activatedRoute = inject(ActivatedRoute);
  private dialogService = inject(FlDialogService);
  private topicService = inject(HaTopicService);
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private portalService = inject(FlPortalService);
  private router = inject(Router);

  story: HaStory;
  formGp: FormGroup;
  textEditorConfig: HaStoryTextEditorConfig;

  historyOverlayRef: FlOverlayRef;

  contentEditorIsFocused: boolean = false;
  contentHasError: boolean = false;
  contentError: string;
  topicControl: FormControl<string | HaTopic> = new FormControl<string | HaTopic>('');
  topics: HaTopicDto[];
  filteredTopics: Observable<HaTopicDto[]>;
  canSaveTopic: boolean = false;
  inputTopic: string = '';
  isAuthor: boolean;
  syncWithBack: boolean = false;
  contentModified: boolean = false;
  notFound: boolean = false;
  imageConfig: FlUploadImageDialogConfig;
  deleteImageConfig: FlConfirmDialogInput;
  contentEditionFormControl: FormControl<TeRichText> = new FormControl({ value: null });
  @ViewChild('topicInput') topicInput: ElementRef<HTMLInputElement>;
  @ViewChild('input') inputPhoto: ElementRef<HTMLInputElement>;

  saveContentEdition = (value: TeRichText): Observable<HaStory> =>
    of(value).pipe(
      mergeMap((value) => this.storyService.updateContentEdition(this.story.id, value)),
      map((story) => {
        this.story = story;
        this.contentModified = !this.story.contentEdition.contentAreEquals(this.story.content);
        this.syncWithBack = true;
        return story;
      })
    );

  ngOnInit(): void {
    this.buildForm();

    this.activatedRoute.params.pipe().subscribe((params) => {
      this.imageConfig = {
        title: { text: 'upload_story_picture', translateText: true },
        helpText: { text: 'image_square_help', translateText: true },
        imagePreviewWidth: 115,
        imagePreviewHeight: 115,
        compressOptions: {
          cropWidth: 300,
          cropHeight: 300,
          resizeWidthMax: 300,
        },
        uploadImage: (file: File) => {
          return this.storyService.updateMainImage(params.id, file).pipe(
            map((story: HaStory) => {
              this.story = story;
            })
          );
        },
        uploadImageSuccessMessage: {
          text: 'story_picture_uploaded',
          translateText: true,
        },
      };

      this.deleteImageConfig = {
        title: 'story_delete_photo',
        content: 'story_delete_photo_confirmation',
        observable: this.storyService.deleteMainImage(params.id).pipe(
          map((story: HaStory) => {
            this.story = story;
          })
        ),
        successMessage: 'story_photo_deleted',
      };
      this.getStory(params.id);
    });

    this.topicService.getAll().subscribe((topics) => {
      this.topics = topics;
      this.filteredTopics = this.topicControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          if (value == null || value == '') return [];
          const name = typeof value === 'string' ? value : value.name;
          this.canSaveTopic = name && name.trim() !== '';
          return name
            ? this._filter(name)
              .slice(0, 3)
              .filter((topic) => !this.story.topics.find((t) => t.id === topic.id))
            : this.topics.slice(0, 3).filter((topic) => !this.story.topics.find((t) => t.id === topic.id));
        })
      );
    });
  }

  onTitleChange(event: string): void {
    if (event !== this.story.title && event.length > 0) {
      this.saveTitle(event);
    } else {
      const titleElement = document.getElementById('storyTitle');
      titleElement.innerText = this.story.title;
    }
  }

  saveTitle(newTitle: string): void {
    this.storyService.updateTitle(this.story.id, newTitle).subscribe((story) => {
      this.story.title = story.title;
    });
  }

  saveTopic(): void {
    const topic: HaTopicDto =
      typeof this.topicControl.value === 'string'
        ? new HaTopicDto(this.topicControl.value)
        : new HaTopicDto(this.topicControl.value.name, this.topicControl.value.id);

    if (topic.id == null) {
      const input: FlConfirmDialogInput = {
        title: 'new_topic',
        content: 'new_topic_content',
        observable: this.addTopicToStory(topic),
      };

      this.dialogService.openConfirmDialog(input).afterClosed().subscribe();
    } else {
      this.addTopicToStory(topic).subscribe();
    }
  }

  addTopicToStory(topic: HaTopicDto): Observable<HaTopic> {
    return this.storyService.addTopicToStory(topic, this.story.id).pipe(
      mergeMap((res: HaTopic) => {
        this.story.topics.push(res);
        this.topicControl.setValue(null);
        this.topicInput.nativeElement.value = '';
        this.inputTopic = '';
        if (this.story.topics.length >= 5) this.topicControl.disable();
        return of(res);
      })
    );
  }

  buildForm(): void {
    this.formGp = new FormBuilder().group({
      id: [null],
      contentEdition: [null],
      category: [null],
    });
  }

  displayFn(topic: HaTopic): string {
    return topic && topic.name ? topic.name : '';
  }

  publish(): void {
    if (
      this.contentEditionFormControl.value.getFiguresBlocks()?.length > 0 ||
      this.story.mainPicture != null
    ) {
      this.contentHasError = false;
      const input: FlConfirmDialogInput = {
        title: 'publish_story',
        content: 'publish_story_dialog_content',
        successMessage: 'story_published',
        observable: this.publishStory(),
      };
      this.dialogService
        .openConfirmDialog(input)
        .afterClosed()
        .subscribe((res) => {
          if (res.choice && res.result) {
            this.router.navigate(['/stories', res.result.id]);
            this.story = res.result;
          }
        });
    } else {
      this.contentHasError = true;
      this.contentError = 'story_content_no_picture_error';
    }
  }

  save(): void {
    if (
      this.contentEditionFormControl.value.getFirstFigureLink()?.length > 0 ||
      this.story.mainPicture != null
    ) {
      this.contentHasError = false;
      this.storyService.saveContent(this.story.id).subscribe((story) => {
        this.story = story;
        if (story) {
          this.router.navigate(['/stories', story.id]);
        }
      });
    } else {
      this.contentHasError = true;
      this.contentError = 'story_content_no_picture_error';
    }
  }

  removeTopic(topic: HaTopic): void {
    this.storyService.removeTopicFromStory(topic.id, this.story.id).subscribe(() => {
      this.story.topics = this.story.topics.filter((t) => t.id !== topic.id);
      this.topics = this.topics.filter((t) => t.id !== topic.id);
      this.topicControl.enable();
    });
  }

  onSelectTopic(event: MatAutocompleteSelectedEvent): void {
    this.addTopicToStory(event.option.value).subscribe();
  }

  isAuthor$(): Observable<boolean> {
    return this.authenticatedUserService.getUser().pipe(
      mergeMap((user: HaUser) => {
        if (user == null || this.story == null) return of(false);
        return of(user.id === this.story.getAuthor().id);
      })
    );
  }

  openCoAuthorDialog(): void {
    const input: HaCoAuthorsDialogInput = {
      id: this.story.id,
      service: this.storyService,
      inviteText: 'invite_story_coauthor_information',
      authorId: this.story.createdBy.id,
    };

    this.dialogService.openSmallDialog(HaCoAuthorDialogComponent, { data: input }).afterClosed().subscribe();
  }

  checkTopicControl(): boolean {
    return (
      this.topicControl.value != null &&
      this.topicControl.value != '' &&
      typeof this.topicControl.value == 'string' &&
      this.topicControl.value.trim() != ''
    );
  }

  getStoryImageLink(imageLinkOrId: string): string {
    return ClStringHelper.isHttpLink(imageLinkOrId)
      ? imageLinkOrId
      : this.storyService.getImageUrl(this.story.id, imageLinkOrId);
  }

  isMainImageInContent(): boolean {
    return this.story.contentEdition
      .getFiguresBlocks()
      .some((block) => block.data.filename === this.story.mainPicture);
  }

  openDeleteStoryConfirmDialog(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_story',
      content: 'delete_story_content',
      observable: this.storyService.delete(this.story.id),
      successMessage: 'story_deleted',
    };
    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res) => {
        if (res && res.choice) {
          this.router.navigate(['/stories']);
        }
      });
  }

  openHistoryPanel(): void {
    if (this.historyOverlayRef) {
      this.historyOverlayRef.dispose();
      this.historyOverlayRef = null;
    } else {
      this.historyOverlayRef = this.portalService.createPortal(
        TeTextEditorHistoryPortalComponent,
        this.portalService.getRightSidePortalConfig(false),
        {
          service: this.storyService,
          entityId: this.story.id,
          textEditorConfig: this.textEditorConfig,
          isEditable: true,
        } as TeTextEditorHistoryPortalData
      );
      this.historyOverlayRef.detachments().subscribe(() => {
        this.historyOverlayRef = null;
      });
    }
  }

  private publishStory(): Observable<HaStory> {
    return this.storyService.publishStory(this.story.id);
  }

  private checkUserIsAuthorOrCoAuthor(story: HaStory): void {
    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      if (
        user?.id !== story.getAuthor().id &&
        !story.getCoAuthors()?.some((coAuthor) => coAuthor.id === user?.id)
      ) {
        this.notFound = true;
      }
    });
  }

  private _filter(name: string): HaTopicDto[] {
    const filterValue = name.toLowerCase();
    return this.topics.filter((topic) => topic.name.toLowerCase().includes(filterValue));
  }

  private getStory(id: string): void {
    this.storyService.getById(id).subscribe({
      next: (story) => {
        if (story == null) {
          this.notFound = true;
          return;
        }
        this.checkUserIsAuthorOrCoAuthor(story);

        this.story = story;
        this.contentModified = this.story?.contentEdition.contentAreEquals(this.story?.content);
        this.syncWithBack = true;
        this.textEditorConfig = new HaStoryTextEditorConfig(this.storyService, this.story.id);
        if (this.story.topics.length >= 5) this.topicControl.disable();
        this.formGp.patchValue(this.story);
        this.contentEditionFormControl.patchValue(this.story.contentEdition ?? new TeRichText());
        this.isAuthor$().subscribe((isAuthor) => {
          this.isAuthor = isAuthor;
        });
      },
      error: () => {
        this.notFound = true;
      },
    });
  }
}
