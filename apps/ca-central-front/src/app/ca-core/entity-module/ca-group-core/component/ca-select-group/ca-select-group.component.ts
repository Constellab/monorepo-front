import { Component, EventEmitter, OnInit, Optional, Output, Self } from '@angular/core';
import {
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib';
import { CaGroup, CaGroupDatasource } from '../../../../model/entities/ca-group.entity';
import { Observable } from 'rxjs';
import { NgControl } from '@angular/forms';
import { CaGroupService } from '../../../../service-api/ca-group.service';
import { ClHelpService } from '@monorepo/core-lib';

@Component({
  selector: 'ca-select-group',
  templateUrl: './ca-select-group.component.html',
  styleUrls: ['./ca-select-group.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: CaSelectGroupComponent }],
})
export class CaSelectGroupComponent extends FlFormFieldDirective<CaGroup> implements OnInit {
  @Output() groupChange: EventEmitter<CaGroup> = new EventEmitter<CaGroup>();

  selectGroup: CaGroup | Observable<CaGroup>;

  datasource: CaGroupDatasource<FlInputSearchFilter>;

  constructor(
    @Optional() @Self() ngControl: NgControl,
    private groupService: CaGroupService
  ) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, data) => {
        if (ClHelpService.isNullOrEmpty(data.filtersCriteria.searchText)) {
          return this.groupService.getAllCurrentGroups(page, size);
        } else {
          return this.groupService.searchGroupInCurrentSpaceByLabel(
            data.filtersCriteria.searchText,
            page,
            size
          );
        }
      },
      20,
      false
    );
  }

  writeValue(obj: CaGroup): void {
    // consider null value: null, object without id
    if (obj == null || obj.id == null) {
      this.selectGroup = null;
      this.value = null;
      return;
    }

    if (!(obj instanceof CaGroup)) {
      this.selectGroup = this.groupService.getById((obj as any).id);
    } else {
      this.selectGroup = obj;
    }
    this.value = obj;
  }

  callChangeEvent(value: CaGroup): void {
    this.groupChange.next(value);
    this.selectGroup = value;
  }

  onDisableChange(): void {}
}
