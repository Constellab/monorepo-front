import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  CoListEntityType,
  CoListFiltersComponent,
  CoPartnerListItemComponent,
} from '@monorepo/community-lib';
import { FlDatasourceSortCriteria } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { TranslatePipe } from '@ngx-translate/core';

import { HaListOfItemsComponent } from '../../../ha-core/ha-component/ha-list-of-items/ha-list-of-items.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import {
  HaPartnerDatasourceFilters,
  HaPartnerDatasourcePaginated,
} from '../../../ha-core/ha-model/ha-entities/ha-partner';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaPartnerLogoUrlPipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-partner-logo-url/ha-partner-logo-url.pipe';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaPartnerService } from '../../../ha-core/ha-service/ha-partner.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-partner-list-page',
  templateUrl: './ha-partner-list-page.component.html',
  styleUrls: ['./ha-partner-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    HaPageComponent,
    FlInfiniteScrollModule,
    CoListFiltersComponent,
    HaListOfItemsComponent,
    FlCorePipeModule,
    AsyncPipe,
    RouterLink,
    HaDetailRoutePipe,
    CoPartnerListItemComponent,
    HaPartnerLogoUrlPipe,
    TranslatePipe,
  ],
})
export class HaPartnerListPageComponent extends HaCommunityPageDirective implements OnInit {
  private partnerService = inject(HaPartnerService);
  private authenticatedUserService = inject(HaAuthenticatedUserService);

  user = toSignal(this.authenticatedUserService.getUser());

  currentUserPartner = toSignal(this.partnerService.getCurrentUserPartner());

  hideCreate = computed(() => {
    const currentPartner = this.currentUserPartner();
    return !!currentPartner;
  });

  listEntityType: CoListEntityType = CoListEntityType.PARTNER;

  partnerPaginated: HaPartnerDatasourcePaginated<HaPartnerDatasourceFilters>;

  nameFilter: string = '';
  sortsCriteriaKeys: string[] = ['createdAt', 'name'];
  sortsCriteria: FlDatasourceSortCriteria[] = [];

  ngOnInit(): void {
    this.partnerPaginated = this.partnerService.searchAllPartners();
    this.updatePartners();

    super.setMetaTags(
      'ha.partners.title',
      'ha.partners.description',
      '',
      HaRouterService.getFullRoute(HaRouterService.getPartnerListRoute())
    );
  }

  onNameFilterChange(nameFilter: string): void {
    this.nameFilter = nameFilter;
    this.updatePartners();
  }

  onSortsCriteriaChanged(sortsCriteria: FlDatasourceSortCriteria[]): void {
    this.sortsCriteria = sortsCriteria;
    this.updatePartners();
  }

  private updatePartners(): void {
    this.partnerPaginated.getFirstPage(
      {
        nameFilter: this.nameFilter,
      },
      this.sortsCriteria
    );
  }
}
