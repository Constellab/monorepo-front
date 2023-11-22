import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {TAB} from '@angular/cdk/keycodes';
import {UntypedFormControl} from '@angular/forms';
import {ClHelpService, clRxjsElasticSearch} from '@monorepo/core-lib';
import {map, mergeMap, startWith, tap} from 'rxjs/operators';
import {FlTag, FlTagEntity, FlTagService} from '../../fl-tag.class';
import {Observable} from 'rxjs';


/**
 * Component that supports NgModel to search and add a tag
 */
@Component({
  selector: 'fl-add-tag-input',
  templateUrl: './fl-add-tag-input.component.html',
  styleUrls: ['./fl-add-tag-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlAddTagInputComponent implements OnInit {

  @Input() searchDebounceTime: number = 300;

  @Input() label: string = 'flTag.tags';

  @Output() addTag: EventEmitter<FlTag> = new EventEmitter();

  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  separatorKeysCodes: number[] = [TAB];
  inputCtrl = new UntypedFormControl();

  filteredOptions: Observable<string[]>;

  allTags: FlTagEntity[] = [];

  // provided when adding a new tag. It is set when the key has been defined but not the value
  // this is a temp storage
  currentTagKey: FlTagEntity;

  constructor(private tagService: FlTagService) {
  }

  ngOnInit(): void {
    this.switchMode('key');
  }

  /**
   * Use to switch option modes
   * @param mode
   * @private
   */
  private switchMode(mode: 'key' | 'value'): void {
    if (mode === 'key') {
      const inputObs = this.inputCtrl.valueChanges.pipe(
        clRxjsElasticSearch(this.searchDebounceTime, 0),
        startWith(''),
      );

      this.filteredOptions = inputObs.pipe(
        mergeMap((inputText) => this.searchTags(inputText))
      );
    } else {
      const inputObs = this.inputCtrl.valueChanges.pipe(
        clRxjsElasticSearch(100, 0),
        startWith(''),
      );

      this.filteredOptions = inputObs.pipe(
        map((inputText) => this.filterArray(this.currentTagKey.values, inputText))
      );
    }
  }

  // function to filter an array
  private filterArray(array: string[], text: string | null): string[] {
    if (text) {
      const filterValue = text.toLowerCase();
      return array.filter(fruit => fruit.toLowerCase().includes(filterValue));
    } else {
      return array.slice();
    }
  }


  private searchTags(inputText: string): Observable<string[]> {
    return this.tagService.searchTag(inputText).pipe(
      tap(tags => this.allTags = tags),
      map(tags => tags.map(tag => tag.key))
    );
  }


  // true when the user is selecting the tag value
  get isValueSelection(): boolean {
    return this.currentTagKey != null;
  }


  removeTempTag(): void {
    this.currentTagKey = null;
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
    const value = (this.input.nativeElement.value || '').trim();
    this.addChip(value);
  }

  optionSelected(event: MatAutocompleteSelectedEvent): void {
    this.addChip(event.option.viewValue);
  }

  private addChip(value: string): void {
    if (!value) return;
    if (this.isValueSelection) {
      this.addTag.emit({key: this.currentTagKey.key, value: value, is_propagable: this.currentTagKey.is_propagable});

      // clear the new tag key (to switch to key selection)
      this.currentTagKey = null;
      this.switchMode('key');
    } else {
      // find the selected tag and save it
      this.currentTagKey = this.allTags.find(t => t.key === value) ?? {key: value, values: [], is_propagable: true};
      this.switchMode('value');

      // force reopening the panel after clear
      setTimeout(() => this.autocompleteTrigger.openPanel(), 0);
    }

    // clear the input
    this.input.nativeElement.value = '';
    this.inputCtrl.setValue(null);
  }


}
