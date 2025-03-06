import { Component, computed, inject } from '@angular/core';
import { HaCommunityApp } from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { DomSanitizer } from '@angular/platform-browser';
import { HaCommunityAppState } from '../../state/ha-community-app.state';

@Component({
  selector: 'ha-community-app',
  imports: [FlSectionModule],
  templateUrl: './ha-community-app.component.html',
  styleUrl: './ha-community-app.component.scss',
})
export class HaCommunityAppComponent {
  private communityAppState: HaCommunityAppState = inject(HaCommunityAppState);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

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
}
