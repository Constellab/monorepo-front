import {Component, EventEmitter, OnInit, Optional, Output, Self} from '@angular/core';
import {LabTagKeyModel} from '../../../../model/entities/lab-tag.entity';
import {
  FlAddTagEvent,
  FlDatasourcePaginated,
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
  FlTag,
  FlTagDatasource,
  FlTagValue
} from '@monorepo/front-core-lib';
import {LabTagService} from '../../../../entity-service/lab-tag.service';
import {NgControl} from '@angular/forms';

/**
 * Component to select tag to filter the list of entity
 * It supports NgModel
 */
@Component({
  selector: 'lab-tag-filters',
  templateUrl: './lab-tag-filters.component.html',
  styleUrls: ['./lab-tag-filters.component.scss'],
})
export class LabTagFiltersComponent extends FlFormFieldDirective<FlTag[]> implements OnInit {

  selectedTags: FlTagDatasource = new FlTagDatasource();

  tagKeys: FlDatasourcePaginated<LabTagKeyModel>;

  @Output() selectionChange: EventEmitter<FlTag[]> = new EventEmitter();

  constructor(@Optional() @Self() ngControl: NgControl,
              private tagService: LabTagService) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.tagKeys = new FlEntityPaginatedDatasource(
      (page, size) => this.tagService.searchKeys(null, page, size),
      10, true
    );
  }

  removeTag(tag: FlTag): void {
    this.selectedTags.removeItem(tag);
    this.setAndEmitValue(this.selectedTags.array);
  }

  addTag(tag: FlAddTagEvent): void {
    this.selectedTags.addItem({key: tag.key, value: tag.value});
    this.setAndEmitValue(this.selectedTags.array);
  }

  onKeyValueChange(key: string, value: FlTagValue): void {
    if (value == null) return;
    this.selectedTags.addItem({key: key, value: value});
    this.setAndEmitValue(this.selectedTags.array);
  }

  callChangeEvent(value: FlTag[]): void {
    this.selectionChange.emit(value);
  }

  onDisableChange(): void {
  }

  writeValue(obj: FlTag[]): void {
    this.selectedTags.array = obj ?? [];
  }


}
