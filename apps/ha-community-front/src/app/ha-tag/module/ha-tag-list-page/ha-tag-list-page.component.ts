import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CoCommunityTagListItemComponent,
  CoListEntityType,
  CoListFiltersComponent,
} from '@monorepo/community-lib';
import { FlDatasourceSortCriteria } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';

import { HaListOfItemsComponent } from '../../../ha-core/ha-component/ha-list-of-items/ha-list-of-items.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import {
  HaTagKeyDatasourceFilters,
  HaTagKeyDatasourcePaginated,
} from '../../../ha-core/ha-model/ha-entities/ha-tag-key.class';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaTagService } from '../../../ha-core/ha-service/ha-tag.service';

@Component({
  selector: 'ha-tag-list-page',
  imports: [
    FlInfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    FlCorePipeModule,
    HaPageComponent,
    CoListFiltersComponent,
    HaListOfItemsComponent,
    AsyncPipe,
    RouterLink,
    HaDetailRoutePipe,
    CoCommunityTagListItemComponent,
  ],
  templateUrl: './ha-tag-list-page.component.html',
  styleUrl: './ha-tag-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class HaTagListPageComponent extends HaCommunityPageDirective implements OnInit {
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private tagService = inject(HaTagService);

  listEntityType = CoListEntityType.TAG;
  tagsPaginated: HaTagKeyDatasourcePaginated<HaTagKeyDatasourceFilters>;
  spaceIdsFilter: string[] = [];
  labelFilter: string = '';
  sortsCriteria: FlDatasourceSortCriteria[] = [];
  user = toSignal(this.authenticatedUserService.getUser());

  ngOnInit(): void {
    this.tagsPaginated = this.tagService.getAllWithFiltersPaginated();
    this.updateTags();

    super.setMetaTags(
      {
        text: 'ha.tag_list.title',
      },
      {
        text: 'ha.tag_list.description',
      },
      null,
      HaRouterService.getTagsListRoute()
    );
  }

  updateTags(): void {
    this.tagsPaginated.getFirstPage(
      {
        spacesFilter: this.spaceIdsFilter,
        labelFilter: this.labelFilter,
      },
      this.sortsCriteria
    );
  }

  onTitleFilterChanged(title: string): void {
    this.labelFilter = title;
    this.updateTags();
  }

  onSpacesFilterChanged(spaces: string[]): void {
    this.spaceIdsFilter = spaces;
    this.updateTags();
  }

  onSortsCriteriaChanged(sortsCriteria: FlDatasourceSortCriteria[]): void {
    this.sortsCriteria = sortsCriteria;
    this.updateTags();
  }

  onMyEntitiesChanged(myEntities: boolean): void {
    if (myEntities && !this.spaceIdsFilter.includes('my-tag-keys')) this.spaceIdsFilter.push('my-tag-keys');
    else if (!myEntities && this.spaceIdsFilter.includes('my-tag-keys'))
      this.spaceIdsFilter = this.spaceIdsFilter.filter((id) => id != 'my-tag-keys');
    this.updateTags();
  }

  protected readonly inject = inject;
}
