import { SelectionModel } from '@angular/cdk/collections';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewChild,
  WritableSignal} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
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

export enum CoListEntityType {
  BRICK = 'brick',
  AGENT = 'agent',
  STORY = 'story',
  APP = 'app',
  TAG = 'tag',
  PARTNER = 'partner',
}

@Component({
  selector: 'co-list-filters',
  templateUrl: './co-list-filters.component.html',
  styleUrls: ['./co-list-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
    MatCheckbox,
  ],
})
export class CoListFiltersComponent implements OnInit, OnDestroy {
  private coConfigService = inject(CoConfig);

  user = input<CoUser | null>(null);
  sortsCriteriaKeys = input<string[]>(['createdAt', 'title']);
  hideMyEntitiesFilter = input(false);
  hideSpaceFilter = input(false);
  hideTitleFilter = input(false);
  listEntityType = input.required<CoListEntityType>();
  titleFilterChanged = output<string>();
  spacesFilterChanged = output<string[]>();
  myEntitiesChanged = output<boolean>();
  sortsCriteriaChanged = output<FlDatasourceSortCriteria[]>();

  myEntitiesText: WritableSignal<string> = signal('coCommunityLib.my_entities');
  filterTitleText: WritableSignal<string> = signal('coCommunityLib.filter_by_title');
  titleText: WritableSignal<string> = signal('coCommunityLib.title');

  titleFormControl: FormControl<string> = new FormControl('', { nonNullable: true });
  titleSubscription: Subscription;
  spacesFilterIsOpen = false;
  titleFilterIsOpen = false;
  sortsIsOpen = false;
  spacesSelectionModel = new SelectionModel<CoSpace>(true, [], false, (a, b) => a.id === b.id);
  userSpace$ = this.coConfigService.getSpacesOfCurrentUser();
  currentSortCriteria: FlDatasourceSortCriteria;

  @ViewChild('titleInput')
  titleInputRef: ElementRef<HTMLInputElement>;

  constructor() {
    effect(() => {
      const listEntityType = this.listEntityType();
      switch (listEntityType) {
        case CoListEntityType.BRICK:
          this.myEntitiesText.set('coCommunityLib.my_bricks');
          this.filterTitleText.set('coCommunityLib.filter_by_name');
          this.titleText.set('coCommunityLib.name');
          break;
        case CoListEntityType.AGENT:
          this.myEntitiesText.set('coCommunityLib.my_agents');
          break;
        case CoListEntityType.STORY:
          this.myEntitiesText.set('coCommunityLib.my_stories');
          break;
        case CoListEntityType.APP:
          this.myEntitiesText.set('coCommunityLib.my_apps');
          break;
        case CoListEntityType.TAG:
          this.myEntitiesText.set('coCommunityLib.my_tags');
          this.filterTitleText.set('coCommunityLib.filter_by_label');
          this.titleText.set('coCommunityLib.label');
          break;
        case CoListEntityType.PARTNER:
          this.myEntitiesText.set('coCommunityLib.my_partner_page');
          this.filterTitleText.set('coCommunityLib.filter_by_name');
          this.titleText.set('coCommunityLib.name');
          break;
      }
    });
  }

  ngOnInit(): void {
    this.titleSubscription = this.titleFormControl.valueChanges.pipe(debounceTime(250)).subscribe((value) => {
      this.titleFilterChanged.emit(value);
    });

    if (this.sortsCriteriaKeys() && this.sortsCriteriaKeys().length > 0) {
      this.currentSortCriteria = { key: this.sortsCriteriaKeys()[0], direction: 'DESC' };
    }
  }

  getSpacePhoto(photo: string): string | null {
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

  selectSortCriteria(sortCriteriaKey: string): void {
    if (
      this.currentSortCriteria &&
      this.currentSortCriteria?.key === sortCriteriaKey &&
      this.currentSortCriteria?.direction === 'DESC'
    ) {
      this.currentSortCriteria = { key: sortCriteriaKey, direction: 'ASC' };
    } else {
      this.currentSortCriteria = { key: sortCriteriaKey, direction: 'DESC' };
    }
    this.sortsCriteriaChanged.emit([this.currentSortCriteria]);
  }

  onMyEntitiesChange(checked: boolean): void {
    this.myEntitiesChanged.emit(checked);
  }

  onTitleIsOpenChange(): void {
    this.titleFilterIsOpen = !this.titleFilterIsOpen;
    if (this.titleFilterIsOpen) {
      setTimeout(() => {
        this.titleInputRef?.nativeElement?.focus();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.titleSubscription?.unsubscribe();
  }
}
