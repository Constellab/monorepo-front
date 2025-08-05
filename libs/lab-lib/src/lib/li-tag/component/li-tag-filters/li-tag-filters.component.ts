import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import {
  FlDatasourcePaginated,
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
} from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import {
  FlAddTagEvent,
  FlAddTagInputComponent,
  FlTag,
  FlTagDatasource,
  FlTagModule,
} from '@monorepo/front-core-lib/fl-tag';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiTagKeyModel, LiTagService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to select tag to filter the list of entity
 * It supports NgModel
 */
@Component({
  selector: 'li-tag-filters',
  templateUrl: './li-tag-filters.component.html',
  styleUrls: ['./li-tag-filters.component.scss'],
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    FlTextIconModule,
    MatIcon,
    FlTagModule,
    FlInfiniteScrollModule,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
    FlIconModule,
  ],
})
export class LiTagFiltersComponent extends FlFormFieldDirective<FlTag[]> implements OnInit, OnDestroy {
  private tagService = inject(LiTagService);

  @Output() selectionChange: EventEmitter<FlTag[]> = new EventEmitter();

  @ViewChild(FlAddTagInputComponent) addTagInputComponent: FlAddTagInputComponent;

  selectedTags: FlTagDatasource = new FlTagDatasource();

  tagKeys: FlDatasourcePaginated<LiTagKeyModel>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });
    super(ngControl);
  }

  ngOnInit(): void {
    this.tagKeys = new FlEntityPaginatedDatasource(
      (page, size) => this.tagService.searchKeys(null, page, size),
      10
    );
  }

  removeTag(tag: FlTag): void {
    this.selectedTags.removeItem(tag);
    this.setAndEmitValue(this.selectedTags.array);
  }

  addTag(tag: FlAddTagEvent): void {
    const flTag: FlTag = {
      key: tag.key.entity ? tag.key.entity.key : tag.key.content,
      value: tag.value.entity ? tag.value.entity.value : tag.value.content,
      isCommunityTagKey: tag.key.entity?.isCommunityTag,
      label: tag.key.entity?.label,
    };
    this.selectedTags.addItem(flTag);
    this.setAndEmitValue(this.selectedTags.array);
  }

  onKeyClick(key: LiTagKeyModel): void {
    // when a key is clicked, set the key in the add tag input
    this.addTagInputComponent.setKey({ type: 'key', content: key.label ?? key.key, entity: key });
  }

  callChangeEvent(value: FlTag[]): void {
    this.selectionChange.emit(value);
  }

  onDisableChange(): void {}

  writeValue(obj: FlTag[]): void {
    this.selectedTags.array = obj ?? [];
  }

  ngOnDestroy(): void {
    this.selectedTags.disconnect();
  }
}
