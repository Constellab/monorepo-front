import { Component, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { HaBrick } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaMetadataService } from '../../../../ha-core/ha-service/ha-metadata.service';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';
import { HaBrickPageState } from '../../../state/ha-brick-page.state';
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'ha-public-list-bricks-page',
  templateUrl: './ha-public-brick-page.component.html',
  styleUrls: ['./ha-public-brick-page.component.scss'],
  providers: [HaBrickPageState],
})
export class HaPublicBrickPageComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private metadataService: HaMetadataService = inject(HaMetadataService);
  private brickPageState: HaBrickPageState = inject(HaBrickPageState);
  private router: Router = inject(Router);
  private document: Document = inject(DOCUMENT);

  brickListRoute: string = HaRouterService.getBrickListRoute();

  brick: Signal<HaBrick> = this.brickPageState.brick;
  brickNotFound: Signal<boolean> = this.brickPageState.isBrickError;
  isLoading: Signal<boolean> = this.brickPageState.isBrickLoading;

  isLatestVersion: boolean = true;
  currentVersion: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.version != 'latest') {
        this.metadataService.addMetaTag('robots', 'noindex');
        this.isLatestVersion = false;
        this.setLatestBrickCanonicalUrl();
      } else {
        this.isLatestVersion = true;
      }
      this.currentVersion = params.version;

      this.brickPageState.init(params.brickName, params.version);
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (!this.isLatestVersion) {
        this.setLatestBrickCanonicalUrl();
      }
    });
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
