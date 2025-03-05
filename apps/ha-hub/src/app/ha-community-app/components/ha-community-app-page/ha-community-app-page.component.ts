import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HaCommunityApp } from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { HaCommentButtonComponent } from '../../../ha-core/entity-module/ha-util-component-core/component/ha-comment-button/ha-comment-button.component';
import { HaLikeButtonComponent } from '../../../ha-core/entity-module/ha-util-component-core/component/ha-like-button/ha-like-button.component';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaLikeType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type.enum';
import { HaAuthService } from '../../../ha-core/ha-service/ha-auth.service';
import { HaLikeService } from '../../../ha-core/ha-service/ha-like.service';
import { Ha404Component } from '../../../ha-public/module/ha404/ha404.component';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { HaCommunityAppState } from '../../state/ha-community-app.state';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { filter, mergeMap } from 'rxjs';
import { map } from 'rxjs/operators';

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
  private authService: HaAuthService = inject(HaAuthService);
  private likeService: HaLikeService = inject(HaLikeService);
  private communityAppState: HaCommunityAppState = inject(HaCommunityAppState);
  private router: Router = inject(Router);

  profileRoute: string = HaRouterService.getProfileRoute();
  currentUser: HaUser;
  currentChildrenPath: string;

  isLiked = this.communityAppState.isLiked;
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

  toggleLikeAppButton(): void {
    if (this.isLiked()) {
      this.unlikeStory();
    } else {
      this.likeStory();
    }
  }

  private unlikeStory(): void {
    if (!this.communityApp()) return;
    this.likeService
      .unlike(HaLikeType.APP_LIKE, this.communityApp().id, HaCommunityApp)
      .subscribe((app: HaCommunityApp) => {
        if (app != null) {
          this.communityAppState.set(app);
          this.communityAppState.setIsLiked(false);
        }
      });
  }

  private likeStory(): void {
    if (!this.communityApp()) return;
    if (!this.authService.hasAuthorizationCookie()) {
      // navigate to login page
      this.router.navigate(['/login']);
      return;
    }
    this.likeService
      .like(HaLikeType.APP_LIKE, this.communityApp().id, HaCommunityApp)
      .subscribe((app: HaCommunityApp) => {
        if (app != null) {
          this.communityAppState.set(app);
          this.communityAppState.setIsLiked(true);
        }
      });
  }
}
