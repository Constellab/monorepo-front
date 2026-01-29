import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FlPlatformService } from '@monorepo/front-core-lib/fl-core';

import { HaMetadataNamesConfig } from '../ha-model/ha-config/ha-metadata-names.config';
import { HaMetadataService } from './ha-metadata.service';

@Injectable({
  providedIn: 'root',
})
export class HaHttpRedirectionService {
  private metadataService = inject(HaMetadataService);
  private router = inject(Router);
  private platformService = inject(FlPlatformService);

  redirectTo(url: string): void {
    this.metadataService.addMetaTag(HaMetadataNamesConfig.REDIRECT_URL, url, false);
    if (!this.platformService.isBrowserPlatform()) {
      return;
    }
    this.router.navigate([url], {
      replaceUrl: true,
      preserveFragment: true,
    });
  }
}
