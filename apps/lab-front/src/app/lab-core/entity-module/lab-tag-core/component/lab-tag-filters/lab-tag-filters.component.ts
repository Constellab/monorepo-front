import { Component, EventEmitter, OnInit, Output, ViewChild, inject } from '@angular/core';
import { LabTagKeyModel } from '../../../../model/entities/lab-tag.entity';
import { FlAddTagEvent } from '@monorepo/front-core-lib/fl-tag';
import { FlAddTagInputComponent } from '@monorepo/front-core-lib/fl-tag';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { FlTagDatasource } from '@monorepo/front-core-lib/fl-tag';

import { LabTagService } from '../../../../entity-service/lab-tag.service';
import { NgControl } from '@angular/forms';
import { LabRouterService } from '../../../../service/lab-router.service';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatExpansionPanelDescription,
} from '@angular/material/expansion';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatIconAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

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
  ],
})
export class LabTagFiltersComponent extends FlFormFieldDirective<FlTag[]> implements OnInit {
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
    this.selectedTags.addItem({ key: tag.key, value: tag.value });
    this.setAndEmitValue(this.selectedTags.array);
  }

  onKeyClick(key: LabTagKeyModel): void {
    // when a key is clicked, set the key in the add tag input
    this.addTagInputComponent.setKey(key.key);
  }

  callChangeEvent(value: FlTag[]): void {
    this.selectionChange.emit(value);
  }

  onDisableChange(): void {}

  writeValue(obj: FlTag[]): void {
    this.selectedTags.array = obj ?? [];
  }
}
