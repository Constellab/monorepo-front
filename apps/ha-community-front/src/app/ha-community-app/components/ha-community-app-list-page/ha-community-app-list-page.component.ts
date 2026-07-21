import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CoCommunityAppListItemComponent,
  CoCommunityLibModule,
  CoListEntityType,
  CoListFiltersComponent,
} from '@monorepo/community-lib';
import { FlDatasourceSortCriteria } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';

import { HaListOfItemsComponent } from '../../../ha-core/ha-component/ha-list-of-items/ha-list-of-items.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import {
  HaCommunityAppDatasourceFilters,
  HaCommunityAppDatasourcePaginated,
} from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaAppPicturePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-app-picture/ha-app-picture.pipe';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaCommunityAppService } from '../../../ha-core/ha-service/ha-community-app.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-community-app-list-page',
  imports: [
    FlInfiniteScrollModule,
    FlCorePipeModule,
    AsyncPipe,
    HaDetailRoutePipe,
    RouterLink,
    CoCommunityAppListItemComponent,
    HaAppPicturePipe,
    FormsModule,
    ReactiveFormsModule,
    FlTextIconModule,
    CoCommunityLibModule,
    HaListOfItemsComponent,
    HaPageComponent,
    CoListFiltersComponent,
  ],
  templateUrl: './ha-community-app-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ha-community-app-list-page.component.scss',
})
export class HaCommunityAppListPageComponent extends HaCommunityPageDirective implements OnInit {
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);
  private authenticatedUserService = inject(HaAuthenticatedUserService);

  listEntityType = CoListEntityType.APP;
  spacesFilter: string[] = [];
  titleFilter: string = '';
  sortsCriteriaKeys: string[] = ['createdAt', 'title'];
  sortsCriteria: FlDatasourceSortCriteria[] = [];
  communityAppsPaginated: HaCommunityAppDatasourcePaginated<HaCommunityAppDatasourceFilters>;
  user: HaUser;
  filters: HaCommunityAppDatasourceFilters = { titleFilter: null, spacesFilter: null };

  ngOnInit(): void {
    this.authenticatedUserService.getUser().subscribe((user) => {
      this.user = user;
    });
    this.communityAppsPaginated = this.communityAppService.getAllPaginated();
    super.setMetaTags(
      'ha.apps.title',
      'ha.apps.description',
      null,
      HaRouterService.getFullRoute(HaRouterService.getCommunityAppListRoute())
    );
    this.updateCommunityApps();
  }

  onTitleFilterChanged(title: string): void {
    this.titleFilter = title;
    this.updateCommunityApps();
  }

  onSpacesFilterChanged(spaces: string[]): void {
    this.spacesFilter = spaces;
    this.updateCommunityApps();
  }

  onSortsCriteriaChanged(sortsCriteria: FlDatasourceSortCriteria[]): void {
    this.sortsCriteria = sortsCriteria;
    this.updateCommunityApps();
  }

  onMyEntitiesChanged(myEntities: boolean): void {
    if (myEntities && !this.spacesFilter.includes('my-apps')) this.spacesFilter.push('my-apps');
    else if (!myEntities && this.spacesFilter.includes('my-apps'))
      this.spacesFilter = this.spacesFilter.filter((id) => id != 'my-apps');
    this.updateCommunityApps();
  }

  private updateCommunityApps(): void {
    this.communityAppsPaginated.getFirstPage(
      {
        spacesFilter: this.spacesFilter,
        titleFilter: this.titleFilter,
      },
      this.sortsCriteria
    );
  }
}
