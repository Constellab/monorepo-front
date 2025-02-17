import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HaBrick } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';
import { HaBrickPageState } from '../../../state/ha-brick-page.state';
import { DOCUMENT } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { MatIcon } from '@angular/material/icon';
import { HaSidenavButtonDirective } from '../../../../ha-core/ha-module/ha-core-directive/ha-sidenav-button/ha-sidenav-button.directive';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { HaPublicSidenavComponent } from '../ha-public-sidenav/ha-public-sidenav.component';
import { Ha404Component } from '../../ha404/ha404.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-public-list-bricks-page',
  templateUrl: './ha-public-brick-page.component.html',
  styleUrls: ['./ha-public-brick-page.component.scss'],
  providers: [HaBrickPageState],
  imports: [
    FlLoaderModule,
    FlSectionModule,
    MatIcon,
    HaSidenavButtonDirective,
    RouterLink,
    FlTextIconModule,
    HaPublicSidenavComponent,
    RouterOutlet,
    Ha404Component,
    TranslatePipe,
  ],
})
export class HaPublicBrickPageComponent implements OnInit, OnDestroy {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private brickPageState: HaBrickPageState = inject(HaBrickPageState);
  private router: Router = inject(Router);
  private document: Document = inject(DOCUMENT);

  brickListRoute: string = HaRouterService.getBrickListRoute();

  brick: Signal<HaBrick> = this.brickPageState.brick;
  brickNotFound: Signal<boolean> = this.brickPageState.isBrickError;
  isLoading: Signal<boolean> = this.brickPageState.isBrickLoading;

  isLatestVersion: boolean = true;
  currentVersion: string;
  paramsSubscription: Subscription;

  ngOnInit(): void {
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.currentVersion = params.version;

      if (params.version != 'latest') {
        // this.metadataService.addMetaTag('robots', 'noindex');
        this.isLatestVersion = false;
        this.setLatestBrickCanonicalUrl();
      } else {
        this.isLatestVersion = true;
      }

      this.brickPageState.init(params.brickName, params.version);
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (!this.isLatestVersion) {
        this.setLatestBrickCanonicalUrl();
      }
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }

  private setLatestBrickCanonicalUrl(): void {
    const url = HaRouterService.getFullRoute(this.router.url.replace(`/${this.currentVersion}`, '/latest'));
    let linkCanonical = this.document.querySelector('link[rel="canonical"]');
    if (linkCanonical == null) {
      linkCanonical = this.document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
    }
    linkCanonical.setAttribute('href', url);
    this.document.head.appendChild(linkCanonical);
  }
}
