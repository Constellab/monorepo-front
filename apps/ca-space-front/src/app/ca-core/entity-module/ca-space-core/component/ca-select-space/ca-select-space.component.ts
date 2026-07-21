import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import { FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { Observable } from 'rxjs';

import { CaSpace, CaSpaceDatasource } from '../../../../model/entities/space/ca-space.class';
import { CaCurrentSpaceService } from '../../../../service-api/ca-current-space.service';
import { CaSpaceService } from '../../../../service-api/ca-space.service';
import { CaSpaceInlineComponent } from '../ca-space-inline/ca-space-inline.component';
import { CaSpacePhotoComponent } from '../ca-space-photo/ca-space-photo.component';

@Component({
  selector: 'ca-select-space',
  templateUrl: './ca-select-space.component.html',
  styleUrls: ['./ca-select-space.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: CaSelectSpaceComponent }],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlInputSearchModule, CaSpacePhotoComponent, MatIcon, FlIconModule, CaSpaceInlineComponent],
})
export class CaSelectSpaceComponent extends FlFormFieldDirective<CaSpace> implements OnInit {
  private spaceService = inject(CaSpaceService);
  private currentSpaceService = inject(CaCurrentSpaceService);

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<CaSpace> = new EventEmitter();

  selectedSpace: CaSpace | Observable<CaSpace>;

  spaceDatasource: CaSpaceDatasource<FlInputSearchFilter>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.spaceDatasource = new FlEntityPaginatedDatasource(
      (page, size, data) => this.spaceService.searchByNames(data.filtersCriteria.searchText, page, size),
      20,
      { initFirstPage: false }
    );
  }

  callChangeEvent(value: CaSpace): void {
    this.valueChange.emit(value);
    this.selectedSpace = value;
  }

  onDisableChange(): void {}

  writeValue(obj: CaSpace): void {
    if (obj == null || obj.id == null) {
      this.selectedSpace = null;
      this.value = null;
      return;
    }

    // if the user is not complete
    if (obj.name == null) {
      this.selectedSpace = this.spaceService.getById(obj.id);
    } else {
      // if the user is complete
      this.selectedSpace = obj;
    }
    this.value = obj;
  }

  async onFocused(selectedSpace?: CaSpace): Promise<void> {
    // by default add the current user and selected user
    const users: CaSpace[] = [];
    if (selectedSpace) {
      users.push(selectedSpace);
    }

    const currentUser = await this.currentSpaceService.getCurrentSpacePromise();
    if (selectedSpace == null || selectedSpace.id !== currentUser.id) {
      users.push(currentUser);
    }

    this.spaceDatasource.setPageData(users);
  }
}
