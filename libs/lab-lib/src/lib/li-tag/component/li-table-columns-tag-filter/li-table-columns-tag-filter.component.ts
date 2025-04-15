import { Component, inject, input, OnDestroy, output, ViewChild } from '@angular/core';
import {
  FlAddTagEvent,
  FlAddTagInputComponent,
  FlTag,
  FlTagDatasource,
  FlTagModule,
} from '@monorepo/front-core-lib/fl-tag';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { NgControl } from '@angular/forms';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'li-table-columns-tag-filter',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatIcon,
    FlTextIconModule,
    FlIconModule,
    TranslatePipe,
    FlTagModule,
  ],
  templateUrl: './li-table-columns-tag-filter.component.html',
  styleUrl: './li-table-columns-tag-filter.component.scss',
})
export class LiTableColumnsTagFilterComponent extends FlFormFieldDirective<FlTag[]> implements OnDestroy {
  columnTagKeys = input<string[]>([]);

  selectionChange = output<FlTag[]>();

  @ViewChild(FlAddTagInputComponent) addTagInputComponent: FlAddTagInputComponent;

  selectedTags: FlTagDatasource = new FlTagDatasource();

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });
    super(ngControl);
  }

  addTag(tag: FlAddTagEvent): void {
    this.selectedTags.addItem({ key: tag.key.content, value: tag.value.content });
    this.setAndEmitValue(this.selectedTags.array);
  }

  removeTag(tag: FlTag): void {
    this.selectedTags.removeItem(tag);
    this.setAndEmitValue(this.selectedTags.array);
  }

  callChangeEvent(value: FlTag[]): void {
    this.selectionChange.emit(value);
  }

  onDisableChange(): void {}

  writeValue(obj: FlTag[]): void {
    this.selectedTags.array = obj ?? [];
  }

  onKeyClick(key: string): void {
    // when a key is clicked, set the key in the add tag input
    this.addTagInputComponent.setKey({ type: 'key', content: key });
  }

  ngOnDestroy(): void {
    this.selectedTags.disconnect();
  }
}
