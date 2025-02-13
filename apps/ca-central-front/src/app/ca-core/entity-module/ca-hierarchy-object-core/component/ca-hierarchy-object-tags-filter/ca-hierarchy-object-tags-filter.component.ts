import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FlTag, FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { FormsModule, NgControl } from '@angular/forms';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/**
 * Form component to filter the list of hierarchy object by tags
 * For now it supports only one tag
 */
@Component({
  selector: 'ca-hierarchy-object-tags-filter',
  imports: [FlTagModule, FlTranslateModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './ca-hierarchy-object-tags-filter.component.html',
  styleUrl: './ca-hierarchy-object-tags-filter.component.scss',
})
export class CaHierarchyObjectTagsFilterComponent extends FlFormFieldDirective<FlTag> {
  @Output() selectionChange: EventEmitter<FlTag> = new EventEmitter();

  inputValue: string = '';

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });
    super(ngControl);
  }

  callChangeEvent(value: FlTag): void {
    this.selectionChange.emit(value);
  }

  onDisableChange(): void {}

  writeValue(obj: FlTag): void {
    this.value = obj;
  }

  clearTag(): void {
    this.setAndEmitValue(null);
  }

  setTag(value: string): void {
    if (!value) return;
    let tag: FlTag;
    // if we set the tag value
    if (this.value != null && this.value.value == null) {
      tag = { key: this.value.key, value: value };
    } else {
      tag = { key: value, value: null };
    }

    this.setAndEmitValue(tag);
    this.inputValue = '';
  }
}
