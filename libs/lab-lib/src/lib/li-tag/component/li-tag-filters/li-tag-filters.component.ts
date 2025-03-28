import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import {
  FlAddTagEvent,
  FlAddTagInputComponent,
  FlTag,
  FlTagDatasource,
  FlTagModule,
} from '@monorepo/front-core-lib/fl-tag';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import {
  FlDatasourcePaginated,
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
} from '@monorepo/front-core-lib/fl-core';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiRouterService, LiTagKeyModel, LiTagService } from '@monorepo/lab-lib/li-core';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatIconAnchor } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { NgControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
    MatExpansionPanelDescription,
    MatIconAnchor,
    RouterLink,
    MatTooltip,
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

  tagMonitoringRoute = LiRouterService.getMonitoringTagsRoute();

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
    this.selectedTags.addItem({ key: tag.key.content, value: tag.value.content });
    this.setAndEmitValue(this.selectedTags.array);
  }

  onKeyClick(key: LiTagKeyModel): void {
    // when a key is clicked, set the key in the add tag input
    this.addTagInputComponent.setKey({ type: 'key', content: key.key, entity: key });
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
