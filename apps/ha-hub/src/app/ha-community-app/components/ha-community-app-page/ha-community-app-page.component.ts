import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { HaCommentButtonComponent } from '../../../ha-core/entity-module/ha-util-component-core/component/ha-comment-button/ha-comment-button.component';
import { HaLikeButtonComponent } from '../../../ha-core/entity-module/ha-util-component-core/component/ha-like-button/ha-like-button.component';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { Ha404Component } from '../../../ha-public/module/ha404/ha404.component';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { HaCommunityAppState } from '../../state/ha-community-app.state';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { filter, mergeMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';

@Component({
  selector: 'ha-community-app-page',
  imports: [
    FlUserModule,
    HaCommentButtonComponent,
    HaLikeButtonComponent,
    FlTextIconModule,
    MatIcon,
    Ha404Component,
    FlLoaderModule,
    TranslatePipe,
    RouterOutlet,
    RouterLink,
    MatTooltip,
    NgClass,
  ],
  templateUrl: './ha-community-app-page.component.html',
  styleUrl: './ha-community-app-page.component.scss',
  providers: [HaCommunityAppState],
})
export class HaCommunityAppPageComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  private communityAppState: HaCommunityAppState = inject(HaCommunityAppState);
  private router: Router = inject(Router);

  currentUser: HaUser;
  currentChildrenPath: string;
  entityType = HaEntityType.APP;

  communityApp = this.communityAppState.app;
  notFound = this.communityAppState.isErrored;
  isLoading = this.communityAppState.isLoading;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => this.communityAppState.init(params.id));

    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.currentUser = user;
    });

    if (this.activatedRoute.firstChild.snapshot.url.length > 0)
      this.currentChildrenPath = this.activatedRoute.firstChild.snapshot.url[0].path;
    else this.currentChildrenPath = '';

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => route.firstChild),
        mergeMap((firstChild) => firstChild.url)
      )
      .subscribe((firstChildUrls) => {
        if (firstChildUrls.length > 0) this.currentChildrenPath = firstChildUrls[0].path;
        else this.currentChildrenPath = '';
      });
  }
}
