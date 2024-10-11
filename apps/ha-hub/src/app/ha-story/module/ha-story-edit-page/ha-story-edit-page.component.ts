import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { HaStory } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FlConfirmDialogInput,
  FlDialogService,
  FlOverlayRef,
  FlPortalService,
  FlUploadImageDialogConfig
} from '@monorepo/front-core-lib';
import { HaStoryTextEditorConfig } from './ha-story-text-editor.config';
import { mergeMap, Observable, of, startWith } from 'rxjs';
import { HaTopic, HaTopicDto } from '../../../ha-core/ha-model/ha-entities/ha-topic.class';
import { HaTopicService } from '../../../ha-core/ha-service/ha-topic.service';
import { map } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ClStringHelper } from '@monorepo/core-lib';
import {
  TeRichText,
  TeRichTextContent,
  TeTextEditorHistoryPortalComponent,
  TeTextEditorHistoryPortalData
} from '@monorepo/text-editor';
import {
  HaCoAuthorDialogComponent,
  HaCoAuthorsDialogInput
} from '../../../ha-core/entity-module/ha-co-author-core/component/ha-co-author-dialog/ha-co-author-dialog.component';
import { CoStoryCategory } from '@monorepo/community-lib';

// TODO @vfoex, composant a refactor, trop gros complexe (Refactor avec le auto save composant ?)
@Component({
  selector: 'ha-story-edit-page',
  templateUrl: './ha-story-edit-page.component.html',
  styleUrls: ['./ha-story-edit-page.component.scss'],
})
export class HaStoryEditPageComponent implements OnInit {
  story: HaStory;
  formGp: FormGroup;
  textEditorConfig: HaStoryTextEditorConfig;

  historyOverlayRef: FlOverlayRef;

  contentEditorIsFocused: boolean = false;
  contentHasError: boolean = false;
  contentError: string;
  topicControl: FormControl<string | HaTopic> = new FormControl<
    string | HaTopic
  >('');
  topics: HaTopicDto[];
  filteredTopics: Observable<HaTopicDto[]>;
  canSaveTopic: boolean = false;
  inputTopic: string = '';
  isAuthor: boolean;
  storyCategories: string[] = Object.keys(CoStoryCategory);
  syncWithBack: boolean = false;
  contentModified: boolean = false;
  notFound: boolean = false;
  imageConfig: FlUploadImageDialogConfig;
  deleteImageConfig: FlConfirmDialogInput;
  contentEditionFormControl: FormControl<TeRichTextContent> =
    new FormControl<TeRichTextContent>(TeRichText.emptyContent());
  @ViewChild('topicInput') topicInput: ElementRef<HTMLInputElement>;
  @ViewChild('input') inputPhoto: ElementRef<HTMLInputElement>;

  testSave = (value: TeRichTextContent) => of(value).pipe(
    mergeMap((value) => this.storyService.updateContentEdition(this.story.id, value)),
    map((story) => {
      this.story = story;
      this.contentModified = !TeRichText.areSimilar(this.story.contentEdition, this.story.content);
      this.syncWithBack = true;
      return story;
    })
  )

  constructor(
    private storyService: HaStoryService,
    private activatedRoute: ActivatedRoute,
    private dialogService: FlDialogService,
    private topicService: HaTopicService,
    private authenticatedUserService: HaAuthenticatedUserService,
    private portalService: FlPortalService,
    private router: Router
  ) {}

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
                .filter(
                  (topic) => !this.story.topics.find((t) => t.id === topic.id)
                )
            : this.topics
                .slice(0, 3)
                .filter(
                  (topic) => !this.story.topics.find((t) => t.id === topic.id)
                );
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

  onStoryCategoryChange(newCategory: CoStoryCategory): void {
    if (newCategory) {
      this.storyService
        .updateCategory(this.story.id, newCategory)
        .subscribe((story) => {
          this.story.category = story.category;
        });
    }
  }

  saveTitle(newTitle: string): void {
    this.storyService
      .updateTitle(this.story.id, newTitle)
      .subscribe((story) => {
        this.story.title = story.title;
      });
  }

  saveTopic(): void {
    const topic: HaTopicDto =
      typeof this.topicControl.value === 'string'
        ? new HaTopicDto(this.topicControl.value)
        : new HaTopicDto(
            this.topicControl.value.name,
            this.topicControl.value.id
          );

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

  onContentUpdate(content: TeRichTextContent): void {
    this.contentEditionFormControl.patchValue(content);
    this.syncWithBack = false;
    if (this.historyOverlayRef) {
      this.historyOverlayRef.dispose();
      this.historyOverlayRef = null;
    }
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
      TeRichText.getFiguresBlocks(this.contentEditionFormControl.value).length >
        0 ||
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
      TeRichText.getFirstFigureLink(this.contentEditionFormControl.value)
        ?.length > 0 ||
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
    this.storyService
      .removeTopicFromStory(topic.id, this.story.id)
      .subscribe(() => {
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
    };

    this.dialogService
      .openSmallDialog(HaCoAuthorDialogComponent, { data: input })
      .afterClosed()
      .subscribe();
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
    return TeRichText.isLinkInFigures(
      this.story.contentEdition,
      this.story.mainPicture
    );
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
        user.id !== story.getAuthor().id &&
        !story.getCoAuthors().some((coAuthor) => coAuthor.id === user.id)
      ) {
        this.notFound = true;
      }
    });
  }

  private _filter(name: string): HaTopicDto[] {
    const filterValue = name.toLowerCase();
    return this.topics.filter((topic) =>
      topic.name.toLowerCase().includes(filterValue)
    );
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
        this.contentModified = !TeRichText.areSimilar(
          this.story?.contentEdition,
          this.story?.content
        );
        this.syncWithBack = true;
        this.textEditorConfig = new HaStoryTextEditorConfig(
          this.storyService,
          this.story.id
        );
        if (this.story.topics.length >= 5) this.topicControl.disable();
        this.formGp.patchValue(this.story);
        this.contentEditionFormControl.patchValue(this.story.contentEdition);
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
