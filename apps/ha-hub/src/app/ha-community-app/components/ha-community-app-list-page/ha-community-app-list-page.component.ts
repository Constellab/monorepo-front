import { Component, inject, OnInit } from '@angular/core';
import { HaCommunityAppService } from '../../../ha-core/ha-service/ha-community-app.service';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { Router, RouterLink } from '@angular/router';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { HaCommunityApp } from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import {
  HaCommunityAppCreateDialogComponent,
  HaCreateCommunityAppInput,
} from '../ha-community-app-create-dialog/ha-community-app-create-dialog.component';
import { HaIsAuthenticatedDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-is-authenticated/ha-is-authenticated.directive';
import { HaSidenavButtonDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-sidenav-button/ha-sidenav-button.directive';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { AsyncPipe } from '@angular/common';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { CoCommunityAppListItemComponent } from '@monorepo/community-lib';
import { HaAppPicturePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-app-picture/ha-app-picture.pipe';

@Component({
  selector: 'ha-community-app-list-page',
  imports: [
    HaIsAuthenticatedDirective,
    HaSidenavButtonDirective,
    MatIcon,
    MatButton,
    TranslatePipe,
    FlInfiniteScrollModule,
    FlCorePipeModule,
    AsyncPipe,
    HaDetailRoutePipe,
    RouterLink,
    CoCommunityAppListItemComponent,
    HaAppPicturePipe,
  ],
  templateUrl: './ha-community-app-list-page.component.html',
  styleUrl: './ha-community-app-list-page.component.scss',
})
export class HaCommunityAppListPageComponent implements OnInit {
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);
  private dialogService: FlDialogService = inject(FlDialogService);
  private router: Router = inject(Router);

  communityAppsPaginated: FlDatasourcePaginated<HaCommunityApp>;

  ngOnInit(): void {
    this.communityAppsPaginated = this.communityAppService.getAllPaginated();
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

  private updateCommunityApps(): void {
    this.communityAppsPaginated.getFirstPage();
  }
}
