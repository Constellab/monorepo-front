import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FlEntityPaginatedDatasource, FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { CaGroup, CaGroupDatasource } from '../../../../model/entities/ca-group.entity';
import { Observable } from 'rxjs';
import { NgControl } from '@angular/forms';
import { CaGroupService } from '../../../../service-api/ca-group.service';
import { ClHelpService } from '@monorepo/core-lib';
import { FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { CaGroupInlineComponent } from '../ca-group-inline/ca-group-inline.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-select-group',
  templateUrl: './ca-select-group.component.html',
  styleUrls: ['./ca-select-group.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: CaSelectGroupComponent }],
  imports: [FlInputSearchModule, MatIcon, FlIconModule, FlUserModule, CaGroupInlineComponent, TranslatePipe],
})
export class CaSelectGroupComponent extends FlFormFieldDirective<CaGroup> implements OnInit {
  private groupService = inject(CaGroupService);

  @Output() groupChange: EventEmitter<CaGroup> = new EventEmitter<CaGroup>();

  selectGroup: CaGroup | Observable<CaGroup>;

  datasource: CaGroupDatasource<FlInputSearchFilter>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

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
      { initFirstPage: false }
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
