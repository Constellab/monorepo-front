import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TAB } from '@angular/cdk/keycodes';
import { UntypedFormControl } from '@angular/forms';
import { ClHelpService } from '@monorepo/core-lib';
import {
  FlTagKeySearchResult,
  FlTagSearchFilter,
  FlTagSearchResult,
  FlTagService,
  FlTagValueSearchResult,
} from '../../fl-tag.class';
import { BehaviorSubject, combineLatest, startWith, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FlDatasourcePaginated, FlDatasourceSortCriteria } from '@monorepo/front-core-lib/fl-core';

export interface FlAddTagEvent<T = any> {
  key: FlTagKeySearchResult<T>;
  value: FlTagValueSearchResult;
}

type FlTagMode = 'key' | 'value';

class FlTagInputSearchDatasourcePaginated extends FlDatasourcePaginated<
  FlTagSearchResult,
  FlTagSearchFilter
> {
  protected equals(a: FlTagSearchResult, b: FlTagSearchResult): boolean {
    return a.entity?.id === b.entity?.id && a.content === b.content;
  }
}

/**
 * Component that supports NgModel to search and add a tag
 */
@Component({
  selector: 'fl-add-tag-input',
  templateUrl: './fl-add-tag-input.component.html',
  styleUrls: ['./fl-add-tag-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FlAddTagInputComponent implements OnInit, OnDestroy {
  private tagService = inject(FlTagService);

  @Input() searchDebounceTime: number = 300;

  @Input() label: string = 'flTag.tags';

  /**
   * If true, allow to add a tag that is not in the list (new key or new value)
   */
  @Input() allowUnknownTag: boolean = true;

  @Input() helpText: string = 'flTag.input_helper_text';

  /**
   * True if you don't want to show the tag list (ex: for table columns tag filter)
   */
  @Input() disableFilteredOptions: boolean = false;

  @Input() searchCommunityTags: boolean = false;

  @Output() addTag: EventEmitter<FlAddTagEvent> = new EventEmitter();

  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  separatorKeysCodes: number[] = [TAB];
  inputCtrl = new UntypedFormControl();

  filteredOptions: FlTagInputSearchDatasourcePaginated;

  filteredCommunityOptions: FlTagInputSearchDatasourcePaginated;

  // provided when adding a new tag. It is set when the key has been defined but not the value
  // this is a temp storage
  currentTagKey: FlTagKeySearchResult;

  mode$: BehaviorSubject<FlTagMode> = new BehaviorSubject('key');

  private subscription: Subscription;

  ngOnInit(): void {
    this.filteredOptions = new FlTagInputSearchDatasourcePaginated(
      (page, size, filter) => this.tagService.searchTag(filter.filtersCriteria, page, size),
      10,
      { initFirstPage: false }
    );

    if (this.searchCommunityTags) {
      this.filteredCommunityOptions = new FlTagInputSearchDatasourcePaginated(
        (page, size, filter) => this.tagService.searchCommunityTag(filter.filtersCriteria, page, size),
        10,
        { initFirstPage: false }
      );
    }

    if (this.disableFilteredOptions) return;
    combineLatest([this.inputCtrl.valueChanges.pipe(startWith('')), this.mode$.asObservable()])
      .pipe(debounceTime(this.searchDebounceTime))
      .subscribe(([inputText, mode]) => this.loadPage(inputText, mode));

    this.inputCtrl.setValue('', { emitEvent: true });
  }

  private loadPage(inputText: string, mode: FlTagMode): void {
    const key = this.currentTagKey?.entity ? this.currentTagKey.entity.key : inputText;
    if (mode === 'value') {
      this.getDatasourceFirstPages({ key: key, value: inputText });
    } else {
      this.getDatasourceFirstPages({ key: key });
    }
  }

  switchMode(mode: FlTagMode): void {
    if (this.mode$.value === mode) return;

    this.mode$.next(mode);
    if (mode == 'key') {
      this.currentTagKey = null;
    }
    this.filteredOptions.clear();
    this.filteredCommunityOptions?.clear();

    // clear the input
    this.input.nativeElement.value = '';
    this.inputCtrl.setValue('', { emitEvent: true });
  }

  removeTempTag(): void {
    this.switchMode('key');
  }

  /**
   * Method to add the tag with enter, only if there is no autocomplete
   * Because if there is an autocomplete, this method is called after the add
   * @param event
   */
  onEnterDown(event: Event): void {
    ClHelpService.stopEventPropagation(event);
    setTimeout(() => {
      if (ClHelpService.isNullOrEmpty(this.input.nativeElement.value)) return;
      this.addUnknownValue();
    }, 0);
  }

  // call when adding a tag without selecting an option
  addUnknownValue(): void {
    if (!this.allowUnknownTag) return;
    const value = (this.input.nativeElement.value || '').trim();
    this.addChip(value);
  }

  optionSelected(event: MatAutocompleteSelectedEvent): void {
    this.addChip(event.option.value);
  }

  private addChip(value: string | FlTagSearchResult): void {
    if (!value) return;
    if (this.mode$.value === 'value') {
      let tagValue: FlTagSearchResult;
      if (typeof value === 'string') {
        tagValue = { type: 'value', content: value };
      } else {
        tagValue = value;
      }
      this.addTag.emit({
        key: this.currentTagKey,
        value: tagValue as FlTagValueSearchResult,
      });

      this.switchMode('key');
    } else {
      if (typeof value === 'string') {
        // create a new tag key
        this.currentTagKey = { type: 'key', content: value };
      } else {
        this.currentTagKey = value as FlTagKeySearchResult;
      }

      this.switchMode('value');

      // force reopening the panel after clear
      if (!this.disableFilteredOptions) setTimeout(() => this.autocompleteTrigger.openPanel(), 0);
    }
  }

  /**
   * Method that can be called from outside this component to force the select key mode
   * and focus the input
   * @param key
   */
  public setKey(key: FlTagKeySearchResult): void {
    // switch to key mode to set the key
    this.switchMode('key');
    this.addChip(key);
    this.focusInput();
  }

  private getDatasourceFirstPages(
    filtersCriteria?: FlTagSearchFilter,
    sortsCriteria?: FlDatasourceSortCriteria[]
  ): void {
    if (filtersCriteria.key == null) return;
    this.filteredOptions.getFirstPage(filtersCriteria, sortsCriteria);
    this.filteredCommunityOptions?.getFirstPage(filtersCriteria, sortsCriteria);
  }

  focusInput(): void {
    this.input.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.mode$?.complete();
  }
}
