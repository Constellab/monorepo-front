import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { Ha404Component } from '../../../ha-public/module/ha404/ha404.component';
import { HaCommunityAppState } from '../../state/ha-community-app.state';

@Component({
  selector: 'ha-community-app-page',
  imports: [FlUserModule, FlTextIconModule, Ha404Component, FlLoaderModule, RouterOutlet],
  templateUrl: './ha-community-app-page.component.html',
  styleUrl: './ha-community-app-page.component.scss',
  providers: [HaCommunityAppState],
})
export class HaCommunityAppPageComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  private communityAppState: HaCommunityAppState = inject(HaCommunityAppState);

  currentUser: HaUser;
  entityType = HaEntityType.APP;

  communityApp = this.communityAppState.app;
  notFound = this.communityAppState.isErrored;
  isLoading = this.communityAppState.isLoading;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.communityAppState.init(params.id);
    });

    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.currentUser = user;
    });
  }
}
