import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HaStoryService} from '../../../ha-core/ha-service/ha-story.service';
import {HaStory, HaStoryCategory, HaStoryContentFormDTO} from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {
  FlConfirmDialogInput,
  FlDebouncer,
  FlDialogService,
  FlFormDialogInput,
  FlReshapeImageDialogComponent
} from '@monorepo/front-core-lib';
import {HaStoryTextEditorConfig} from './ha-story-text-editor.config';
import {mergeMap, Observable, of, startWith} from 'rxjs';
import {HaTopic, HaTopicDto} from '../../../ha-core/ha-model/ha-entities/ha-topic.class';
import {HaTopicService} from '../../../ha-core/ha-service/ha-topic.service';
import {map} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {HaStoryCoAuthorDialogComponent} from '../ha-story-co-author-dialog/ha-story-co-author-dialog.component';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ClRichText, ClStringHelper} from '@monorepo/core-lib';
import {HaStoryFileDialogComponent, HaStoryFileFormData} from '../ha-story-file-dialog/ha-story-file-dialog.component';
import {TeRichText, TeRichTextContent} from '@monorepo/text-editor';

@Component({
  selector: 'ha-story-edit-page',
  templateUrl: './ha-story-edit-page.component.html',
  styleUrls: ['./ha-story-edit-page.component.scss']
})
export class HaStoryEditPageComponent implements OnInit, OnDestroy {


  story: HaStory;
  formGp: FormGroup<HaStoryContentFormDTO>;
  textEditorConfig: HaStoryTextEditorConfig;

  contentEditorIsFocused: boolean = false;
  private contentDebouncer: FlDebouncer<TeRichTextContent>;

  contentHasError: boolean = false;

  contentError: string;


  topicControl: FormControl<string | HaTopic> = new FormControl<string | HaTopic>('');

  topics: HaTopicDto[];

  filteredTopics: Observable<HaTopicDto[]>;

  canSaveTopic: boolean = false;

  inputTopic: string = '';

  isAuthor: boolean;

  storyCategories: string[] = Object.keys(HaStoryCategory);

  syncWithBack: boolean = false;

  contentModified: boolean = false;


  @ViewChild('topicInput') topicInput: ElementRef<HTMLInputElement>;
  @ViewChild('input') inputPhoto: ElementRef<HTMLInputElement>;

  constructor(
    private storyService: HaStoryService,
    private activatedRoute: ActivatedRoute,
    private dialogService: FlDialogService,
    private topicService: HaTopicService,
    private authenticatedUserService: HaAuthenticatedUserService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.buildForm();

    this.activatedRoute.params.subscribe(params => {
      this.getStory(params.id);
    });

    //create a debouncer to save the description after x second of idle
    this.contentDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.contentDebouncer.getDebouncedValue().subscribe(
      value => {
        if (this.story && this.story.contentEdition !== value) {
          this.saveContent(value);
        }
      }
    );

    this.topicService.getAll().subscribe(topics => {
      this.topics = topics;
      this.filteredTopics = this.topicControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          if (value == null || value == '') return [];
          const name = typeof value === 'string' ? value : value.name;
          this.canSaveTopic = name && name.trim() !== '';
          return name ? this._filter(name).slice(0, 3).filter((topic => !this.story.topics.find(t => t.id === topic.id))) :
            this.topics.slice(0, 3).filter((topic => !this.story.topics.find(t => t.id === topic.id)));
        }),
      );
    });
  }

  onTitleChange(event: string): void {
    if(event !== this.story.title && event.length > 0){
      this.saveTitle(event);
    } else {
      const titleElement = document.getElementById('storyTitle');
      titleElement.innerText = this.story.title;
    }
  }

  onStoryCategoryChange(newCategory: HaStoryCategory): void {
    if(newCategory){
      this.storyService.updateCategory(this.story.id, newCategory).subscribe((story) => {
        this.story.category = story.category;
      });
    }
  }
  saveTitle(newTitle: string): void {
    this.storyService.updateTitle(this.story.id, newTitle).subscribe((story) => {
      this.story.title = story.title;
    });
  }

  saveTopic(): void {
    const topic: HaTopicDto = typeof this.topicControl.value === 'string' ?
      new HaTopicDto(this.topicControl.value) : new HaTopicDto(this.topicControl.value.name, this.topicControl.value.id);

    if (topic.id == null) {
      const input: FlConfirmDialogInput = {
        title: 'new_topic',
        content: 'new_topic_content',
        translateTitleAndContent: true,
        observable: this.addTopicToStory(topic)
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
    this.formGp.controls.contentEdition.value = content;
    this.syncWithBack = false;
    this.contentDebouncer.setValue(content);
  }

  ngOnDestroy(): void {
    this.contentDebouncer.complete();

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

  private saveContent(value: TeRichTextContent): void {
    this.storyService.updateContent(this.story.id, value).subscribe((story) => {
      this.story = story;
      this.syncWithBack = true;
      this.contentModified = !TeRichText.areSimilar(this.story.contentEdition, this.story.content);
    });
  }

  publish(): void {
    if (TeRichText.getFiguresBlocks(this.formGp.get('contentEdition').value).length > 0 || this.story.mainPicture != null) {
      this.contentHasError = false;
      const input: FlConfirmDialogInput = {
        title: 'publish_story',
        content: 'publish_story_dialog_content',
        successMessage: 'story_published',
        observable: this.publishStory(),
        translateMessage: true,
        translateTitleAndContent: true
      };
      this.dialogService.openConfirmDialog(input).afterClosed().subscribe((res) => {
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
    if (new ClRichText(this.formGp.get('contentEdition').value).getFirstFigureLink().length > 0 || this.story.mainPicture != null) {
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

  private publishStory(): Observable<HaStory> {
    return this.storyService.publishStory(this.story.id);
  }

  removeTopic(topic: HaTopic): void {
    this.storyService.removeTopicFromStory(topic.id, this.story.id).subscribe(() => {
      this.story.topics = this.story.topics.filter(t => t.id !== topic.id);
      this.topics = this.topics.filter(t => t.id !== topic.id);
      this.topicControl.enable();
    });
  }

  getContentFormControl(): FormControl<TeRichTextContent> {
    return this.formGp.controls.contentEdition as any;
  }

  private checkUserIsAuthorOrCoAuthor(story: HaStory): void {
    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      if (user.id !== story.getAuthor().id && !story.getCoAuthors().find(coAuthor => coAuthor.id === user.id)) {
        this.router.navigate(['/stories', story.id]);
      }
    });
  }

  private _filter(name: string): HaTopicDto[] {
    const filterValue = name.toLowerCase();
    return this.topics.filter(topic => topic.name.toLowerCase().includes(filterValue));
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
    const input: FlFormDialogInput<HaStory> = {
      mode: 'update',
      object: this.story
    };

    this.dialogService.openSmallDialog(HaStoryCoAuthorDialogComponent, {data: input}).afterClosed().subscribe((res) => {
      if (res && res.choice && res.result) {
        this.story = res.result;
      }
    });
  }

  openStoryFileDialog(): void{
    const input: FlFormDialogInput<HaStoryFileFormData> = {
      mode: 'update',
      object: {
        story: this.story
      }
    }

    this.dialogService.openMediumDialog(HaStoryFileDialogComponent, {data: input}).afterClosed().subscribe((res) => {
      if (res && res.choice && res.result) {
        this.story = res.result;
      }
    });
  }

  checkTopicControl(): boolean{
    return this.topicControl.value != null && this.topicControl.value != '' &&
      typeof this.topicControl.value == 'string' && this.topicControl.value.trim() != '';
  }

  getStoryImageLink(imageName: string): string {
    return ClStringHelper.isHttpLink(imageName) ? imageName : this.storyService.getImageUrl(imageName);
  }

  isMainImageInContent(): boolean {
    return TeRichText.isLinkInFigures(this.story.contentEdition, this.story.mainPicture);
  }

  activeInput(): void {
    this.inputPhoto.nativeElement.click();
  }

  onFileSelected(file: File | File[]): void {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.story.mainPicture = event.target.result;
      };
      reader.readAsDataURL(file as File);
    }
    this.dialogService.openMediumDialog(FlReshapeImageDialogComponent, {
      data: {
        file: file,
        width: 174,
        height: 168
      }
    }).afterClosed().subscribe((res) => {
      if (res && res.choice && res.result) {
        this.storyService.updateMainImage(this.story.id, res.result).subscribe((story) => {
          this.story = story;
        });
      }
    });
  }

  deleteImage(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_story_main_image',
      content: 'delete_story_main_image_content',
      observable: this.storyService.deleteMainImage(this.story.id),
      translateTitleAndContent: true

    }
    this.dialogService.openConfirmDialog(input).afterClosed().subscribe((res) => {
      if (res.choice && res.result) {
        this.story = res.result;
      }
    });
  }

  openDeleteStoryConfirmDialog(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_story',
      content: 'delete_story_content',
      observable: this.storyService.delete(this.story.id),
      translateTitleAndContent: true,
      successMessage: 'story_deleted',
      translateMessage: true
    };
    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(() => {
      this.router.navigate(['/stories']);
    });
  }

  private getStory(id: string): void {
    this.storyService.getById(id).subscribe(story => {
      if(story == null) this.router.navigate(['/stories']);
      this.checkUserIsAuthorOrCoAuthor(story);
      this.story = story;
      this.contentModified = !TeRichText.areSimilar(this.story.contentEdition, this.story.content);
      this.syncWithBack = true;
      this.textEditorConfig = new HaStoryTextEditorConfig(this.storyService, this.story.id);
      if (this.story.topics.length >= 5) this.topicControl.disable();
      this.formGp.patchValue(this.story);
      this.isAuthor$().subscribe((isAuthor) => {
        this.isAuthor = isAuthor;
      });
    });
  }
}
