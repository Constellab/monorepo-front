import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TAB } from '@angular/cdk/keycodes';
import { UntypedFormControl } from '@angular/forms';
import { ClHelpService } from '@monorepo/core-lib';
import {
  FlTagKeyModel,
  FlTagSearchFilter,
  FlTagService,
  FlTagValue,
  FlTagValueModel,
} from '../../fl-tag.class';
import { FlDatasourcePaginated } from '../../../../model/datasource/fl-datasource-paginated.class';
import { FlEntityPaginatedDatasource } from '../../../../model/datasource/fl-entity-datasource.class';
import { BehaviorSubject, combineLatest, startWith, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export interface FlAddTagEvent {
  key: string;
  value: FlTagValue;
  defaultIsPropagable: boolean;
}

interface FlNewTagKey {
  key: string;
  defaultIsPropagable: boolean;
}

type FlTagMode = 'key' | 'value';

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

  @Output() addTag: EventEmitter<FlAddTagEvent> = new EventEmitter();

  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  separatorKeysCodes: number[] = [TAB];
  inputCtrl = new UntypedFormControl();

  filteredOptions: FlDatasourcePaginated<any, FlTagSearchFilter>;

  // provided when adding a new tag. It is set when the key has been defined but not the value
  // this is a temp storage
  currentTagKey: FlNewTagKey;

  mode$: BehaviorSubject<FlTagMode> = new BehaviorSubject('key');

  private subscription: Subscription;

  ngOnInit(): void {
    this.filteredOptions = new FlEntityPaginatedDatasource<any, FlTagSearchFilter>(
      (page, size, filter) => this.tagService.searchTag(filter.filtersCriteria, page, size),
      20,
      { initFirstPage: false }
    );

    combineLatest([this.inputCtrl.valueChanges.pipe(startWith('')), this.mode$.asObservable()])
      .pipe(debounceTime(this.searchDebounceTime))
      .subscribe(([inputText, mode]) => this.loadPage(inputText, mode));
  }

  private loadPage(inputText: string, mode: FlTagMode): void {
    if (mode === 'value') {
      this.filteredOptions.getFirstPage({ key: this.currentTagKey.key, value: inputText });
    } else {
      this.filteredOptions.getFirstPage({ key: inputText });
    }
  }

  switchMode(mode: FlTagMode): void {
    if (this.mode$.value === mode) return;

    this.mode$.next(mode);
    if (mode == 'key') {
      this.currentTagKey = null;
    }
    this.filteredOptions.clear();

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

  private addChip(value: any): void {
    if (!value) return;
    if (this.mode$.value === 'value') {
      let tagValue: FlTagValue;
      if (typeof value === 'string') {
        tagValue = value;
      } else {
        tagValue = (value as FlTagValueModel).value;
      }
      this.addTag.emit({
        key: this.currentTagKey.key,
        value: tagValue,
        defaultIsPropagable: this.currentTagKey.defaultIsPropagable,
      });

      this.switchMode('key');
    } else {
      if (typeof value === 'string') {
        // create a new tag key
        this.currentTagKey = { key: value, defaultIsPropagable: false };
      } else {
        const key: FlTagKeyModel = value as FlTagKeyModel;
        // find the selected tag and save it
        this.currentTagKey = { key: key.key, defaultIsPropagable: key.isPropagable };
      }

      this.switchMode('value');
      // force reopening the panel after clear
      setTimeout(() => this.autocompleteTrigger.openPanel(), 0);
    }
  }

  /**
   * Method that can be called from outside this component to force the select key mode
   * and focus the input
   * @param key
   */
  public setKey(key: string): void {
    // switch to key mode to set the key
    this.switchMode('key');
    this.addChip(key);
    this.focusInput();
  }

  focusInput(): void {
    this.input.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.mode$?.complete();
  }
}
