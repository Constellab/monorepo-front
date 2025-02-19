import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { LabTagKeyModel } from '../../../../model/entities/lab-tag.entity';
import {
  FlAddTagEvent,
  FlAddTagInputComponent,
  FlTag,
  FlTagDatasource,
  FlTagModule,
} from '@monorepo/front-core-lib/fl-tag';
import {
  FlDatasourcePaginated,
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
} from '@monorepo/front-core-lib/fl-core';

import { LabTagService } from '../../../../entity-service/lab-tag.service';
import { NgControl } from '@angular/forms';
import { LabRouterService } from '../../../../service/lab-router.service';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatIconAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';

/**
 * Component to select tag to filter the list of entity
 * It supports NgModel
 */
@Component({
  selector: 'lab-tag-filters',
  templateUrl: './lab-tag-filters.component.html',
  styleUrls: ['./lab-tag-filters.component.scss'],
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
export class LabTagFiltersComponent extends FlFormFieldDirective<FlTag[]> implements OnInit, OnDestroy {
  private tagService = inject(LabTagService);

  @Output() selectionChange: EventEmitter<FlTag[]> = new EventEmitter();

  @ViewChild(FlAddTagInputComponent) addTagInputComponent: FlAddTagInputComponent;

  selectedTags: FlTagDatasource = new FlTagDatasource();

  tagKeys: FlDatasourcePaginated<LabTagKeyModel>;

  tagMonitoringRoute = LabRouterService.getMonitoringTagsRoute();

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

  onKeyClick(key: LabTagKeyModel): void {
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
