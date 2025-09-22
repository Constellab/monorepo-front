import { SelectionModel } from '@angular/cdk/collections';
import { AsyncPipe } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatSuffix } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlDatasourceSortCriteria } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { CoSpace } from '../../model/co-space.class';
import { CoUser } from '../../model/co-user.class';
import { CoConfig } from '../../service/co-service-config.config';
import { CoVisibilityBadgeComponent } from '../co-visibility-badge/co-visibility-badge.component';

@Component({
  selector: 'co-list-filters',
  templateUrl: './co-list-filters.component.html',
  styleUrls: ['./co-list-filters.component.scss'],
  imports: [
    MatIconModule,
    AsyncPipe,
    CoVisibilityBadgeComponent,
    FlCoreDirectiveModule,
    TranslatePipe,
    MatFormField,
    MatIconButton,
    MatInput,
    MatSuffix,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
})
export class CoListFiltersComponent implements OnInit, OnDestroy {
  user = input<CoUser>(null);
  sortsCriteriaKeys = input<string[]>(['createdAt', 'title']);
  hideSpaceFilter = input(false);
  hideTitleFilter = input(false);
  titleFilterChanged = output<string>();
  spacesFilterChanged = output<string[]>();
  sortsCriteriaChanged = output<FlDatasourceSortCriteria[]>();
  titleFormControl: FormControl<string> = new FormControl('');
  titleSubscription: Subscription;
  spacesFilterIsOpen = false;
  titleFilterIsOpen = false;
  sortsIsOpen = false;
  spacesSelectionModel = new SelectionModel<CoSpace>(true, [], false, (a, b) => a.id === b.id);
  private coConfigService = inject(CoConfig);
  userSpace$ = this.coConfigService.getSpacesOfCurrentUser();
  currentSortCriteria: FlDatasourceSortCriteria;

  ngOnInit(): void {
    this.titleSubscription = this.titleFormControl.valueChanges.pipe(debounceTime(250)).subscribe((value) => {
      this.titleFilterChanged.emit(value);
    });

    if (this.sortsCriteriaKeys() && this.sortsCriteriaKeys().length > 0) {
      this.currentSortCriteria = {key: this.sortsCriteriaKeys()[0], direction: 'DESC'};
    }
  }

  getSpacePhoto(photo: string): string {
    if (!photo) return null;
    return this.coConfigService.getSpacePhotoUrl(photo);
  }

  selectSpace(space: CoSpace): void {
    this.spacesSelectionModel.toggle(space);
    this.spacesFilterChanged.emit(this.spacesSelectionModel.selected.map((s) => s.id));
  }

  searchByTitle(): void {
    this.titleFilterChanged.emit(this.titleFormControl.value);
  }

  selectSortCriteria(sortCriteriaKey: string): void{
    if (this.currentSortCriteria &&
      this.currentSortCriteria?.key == sortCriteriaKey &&
      this.currentSortCriteria?.direction == 'DESC') {
      this.currentSortCriteria = {key: sortCriteriaKey, direction: 'ASC'};
    } else {
      this.currentSortCriteria = {key: sortCriteriaKey, direction: 'DESC'};
    }
    this.sortsCriteriaChanged.emit([this.currentSortCriteria]);
  }

  ngOnDestroy(): void {
    this.titleSubscription?.unsubscribe();
  }
}
