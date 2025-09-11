import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CoCommunityAppListItemComponent, CoCommunityLibModule } from '@monorepo/community-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';

import { HaListOfItemsComponent } from '../../../ha-core/ha-component/ha-list-of-items/ha-list-of-items.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import {
  HaCommunityApp,
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
import {
  HaCommunityAppCreateDialogComponent,
  HaCreateCommunityAppInput,
} from '../ha-community-app-create-dialog/ha-community-app-create-dialog.component';

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
  ],
  templateUrl: './ha-community-app-list-page.component.html',
  styleUrl: './ha-community-app-list-page.component.scss',
})
export class HaCommunityAppListPageComponent extends HaCommunityPageDirective implements OnInit {
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);
  private dialogService: FlDialogService = inject(FlDialogService);
  private authenticatedUserService = inject(HaAuthenticatedUserService);

  spacesFilter: string[] = [];
  communityAppsPaginated: HaCommunityAppDatasourcePaginated<HaCommunityAppDatasourceFilters>;
  titleFormControl: FormControl<string> = new FormControl('');
  user: HaUser;

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

  openCreateCommunityAppDialog(): void {
    const input: HaCreateCommunityAppInput = {
      mode: 'create',
    };

    this.dialogService
      .openMediumDialog(HaCommunityAppCreateDialogComponent, { data: input })
      .afterClosed()
      .subscribe((communityApp: HaCommunityApp) => {
        if (communityApp) {
          this.updateCommunityApps();
        }
      });
  }

  search(event: any): void {
    event.preventDefault();
    this.updateCommunityApps();
  }

  isSelected(spaceId: string): boolean {
    return this.spacesFilter.find((id) => id == spaceId) != null;
  }

  selectSpace(spaceId: string): void {
    if (this.isSelected(spaceId)) {
      this.spacesFilter = this.spacesFilter.filter((id) => id != spaceId);
    } else {
      this.spacesFilter.push(spaceId);
    }
    this.updateCommunityApps();
  }

  private updateCommunityApps(): void {
    this.communityAppsPaginated.getFirstPage({
      spacesFilter: this.spacesFilter,
      titleFilter: this.titleFormControl.value,
    });
  }
}
