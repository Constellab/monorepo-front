import { Component, EventEmitter, OnInit, Output, ViewChild, inject } from '@angular/core';
import { LabTagKeyModel } from '../../../../model/entities/lab-tag.entity';
import {
  FlAddTagEvent,
  FlAddTagInputComponent,
  FlDatasourcePaginated,
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
  FlTag,
  FlTagDatasource,
} from '@monorepo/front-core-lib';
import { LabTagService } from '../../../../entity-service/lab-tag.service';
import { NgControl } from '@angular/forms';
import { LabRouterService } from '../../../../service/lab-router.service';

/**
 * Component to select tag to filter the list of entity
 * It supports NgModel
 */
@Component({
  selector: 'lab-tag-filters',
  templateUrl: './lab-tag-filters.component.html',
  styleUrls: ['./lab-tag-filters.component.scss'],
  standalone: false,
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
