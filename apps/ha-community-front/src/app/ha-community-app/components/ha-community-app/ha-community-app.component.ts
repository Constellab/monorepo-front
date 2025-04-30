import { Component, computed, inject, OnInit } from '@angular/core';
import { HaCommunityApp } from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { DomSanitizer } from '@angular/platform-browser';
import { HaCommunityAppState } from '../../state/ha-community-app.state';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { ClStringHelper } from '@monorepo/core-lib';
import { HaCommunityAppService } from '../../../ha-core/ha-service/ha-community-app.service';

@Component({
  selector: 'ha-community-app',
  imports: [FlSectionModule],
  templateUrl: './ha-community-app.component.html',
  styleUrl: './ha-community-app.component.scss',
})
export class HaCommunityAppComponent extends HaCommunityPageDirective implements OnInit {
  private communityAppState: HaCommunityAppState = inject(HaCommunityAppState);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);

  app = this.communityAppState.app;

  appTitle = computed(() => {
    const app: HaCommunityApp = this.communityAppState.app();
    if (!app) return null;
    return app.title;
  });

  appSafeUrl = computed(() => {
    const app: HaCommunityApp = this.communityAppState.app();
    if (!app) return null;
    // create a safe url for the iframe + hide the header
    return this.sanitizer.bypassSecurityTrustResourceUrl(app.appUrl + '?hide_header=true');
  });

  ngOnInit(): void {
    const appImage: string = this.app().picture
      ? this.communityAppService.getAppPictureUrl(this.app().picture)
      : null;

    super.setMetaTags(
      { text: 'ha.app.title', translateParam: { param: { title: this.appTitle() } } },
      { text: 'ha.app.description', translateParam: { param: { title: this.appTitle() } } },
      appImage,
      HaRouterService.getFullRoute(
        HaRouterService.getCommunityAppRoute(this.app().id, ClStringHelper.getCleanUrlPath(this.appTitle()))
      )
    );
  }
}
