import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Optional,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { NgControl, UntypedFormControl } from '@angular/forms';
import { ENTER, TAB } from '@angular/cdk/keycodes';
import { ClHelpService } from '@monorepo/core-lib';
import { FlFormFieldDirective } from '../../../../abstract-directive/form/fl-form-field.directive';
import { FlTag, FlTagHelper, FlTagValue } from '../../fl-tag.class';

type FlTagInput = FlTag[] | Record<string, FlTagValue>;

@Component({
    selector: 'fl-tag-input',
    templateUrl: './fl-tag-input.component.html',
    styleUrls: ['./fl-tag-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FlTagInputComponent extends FlFormFieldDirective<FlTag[], FlTagInput> {
  @Input() searchDebounceTime: number = 300;

  @Input() label: string = 'flTag.tags';

  @Input() maxLength: number = FlTagHelper.MAX_LENGTH;

  /**
   * Different mode for the input
   * When record,  return a record of tags
   * When array, return a FlTag[]
   */
  @Input() mode: 'record' | 'array' = 'array';

  @Output() tagChange: EventEmitter<FlTagInput> = new EventEmitter();

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  separatorKeysCodes: number[] = [ENTER, TAB];
  inputCtrl = new UntypedFormControl();

  // provided when adding a new tag. It is set when the key has been defined but not the value
  // this is a temp storage
  newTag: string;

  constructor(
    @Optional() @Self() ngControl: NgControl,
    private cdr: ChangeDetectorRef
  ) {
    super(ngControl);
  }

  callChangeEvent(value: FlTagInput): void {
    this.tagChange.next(value);
  }

  onDisableChange(disable: boolean): void {
    if (disable) {
      this.inputCtrl.disable();
    } else {
      this.inputCtrl.enable();
    }
  }

  writeValue(obj: FlTag[]): void {
    if (obj == null) {
      this.value = [];
    } else {
      this.value = this.convertOuterToInner(obj);
    }

    this.cdr.markForCheck();
  }

  // true when the user is selecting the tag value
  get isValueSelection(): boolean {
    return this.newTag != null;
  }

  remove(tag: FlTag): void {
    const index = this.value.findIndex((t) => t.key === tag.key);

    if (index >= 0) {
      this.value.splice(index, 1);
      this.emitCurrentValue();
    }
  }

  removeTempTag(): void {
    this.newTag = null;
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

  private addChip(value: string): void {
    if (!value) return;
    if (this.isValueSelection) {
      if (this.value == null) this.value = [];
      this.setAndEmitValue(FlTagHelper.addOrReplaceTag(this.value, { key: this.newTag, value: value }));
      this.emitCurrentValue();

      // clear the new tag key (to switch to key selection)
      this.newTag = null;
    } else {
      // find the selected tag and save it
      this.newTag = value;
    }

    // clear the input
    this.input.nativeElement.value = '';
    this.inputCtrl.setValue(null);
  }

  protected convertOuterToInner(outerValue: FlTagInput): FlTag[] {
    if (outerValue == null) return [];
    if (Array.isArray(outerValue)) return outerValue;

    const tags: FlTag[] = [];
    for (const key of Object.keys(outerValue)) {
      tags.push({ key: key, value: outerValue[key] });
    }
    return tags;
  }

  // convert into correct format based on component mode
  protected convertInnerToOuter(innerValue: FlTag[]): FlTagInput {
    if (this.mode === 'array') {
      return innerValue;
    } else {
      const tags: Record<string, FlTagValue> = {};
      for (const tag of innerValue) {
        tags[tag.key] = tag.value;
      }
      return tags;
    }
  }
}
