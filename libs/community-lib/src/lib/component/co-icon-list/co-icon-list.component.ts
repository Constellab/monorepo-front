import { ChangeDetectionStrategy,Component, inject, Input, OnDestroy, OnInit, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FlInfiniteScrollMode } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { Observable, Subscription } from 'rxjs';

import { CoIcon, CoIconDatasourceFilters, CoIconDatasourcePaginated } from '../../model/co-icon.class';
import { CoIconService } from '../../service/co-icon.service';

@Component({
  selector: 'co-icon-list',
  templateUrl: './co-icon-list.component.html',
  styleUrl: './co-icon-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CoIconListComponent implements OnInit, OnDestroy {
  private iconService = inject(CoIconService);

  @Input()
  reloadList$?: Observable<boolean>;

  @Input()
  infiniteMode: FlInfiniteScrollMode = 'auto';

  iconSelected = output<[Event, CoIcon]>();

  icons: CoIconDatasourcePaginated<CoIconDatasourceFilters> = this.iconService.getAllPaginated();

  reloadListSubscription: Subscription;

  searchFormControl: FormControl<string> = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.loadIcons();
    if (this.reloadList$) {
      this.reloadListSubscription = this.reloadList$.subscribe((value: boolean) => {
        if (value) {
          this.loadIcons();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.reloadListSubscription?.unsubscribe();
  }

  search(): void {
    this.icons.getFirstPage({
      subNameFilter: this.searchFormControl.value,
    });
  }

  loadMoreResults(): void {
    this.icons.getNextPage();
  }

  onIconClick(event: Event, icon: CoIcon): void {
    this.iconSelected.emit([event, icon]);
  }

  private loadIcons(): void {
    this.searchFormControl.patchValue('');
    this.icons.getFirstPage({
      subNameFilter: '',
    });
  }
}
