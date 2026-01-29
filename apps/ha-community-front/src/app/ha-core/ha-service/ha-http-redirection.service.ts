import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HaMetadataNamesConfig } from '../ha-model/ha-config/ha-metadata-names.config';
import { HaMetadataService } from './ha-metadata.service';

@Injectable({
  providedIn: 'root',
})
export class HaHttpRedirectionService {
  private metadataService = inject(HaMetadataService);
  private router = inject(Router);

  redirectTo(url: string): void {
    this.metadataService.addMetaTag(HaMetadataNamesConfig.REDIRECT_URL, url, false);
    this.router.navigate([url], {
      replaceUrl: true,
      preserveFragment: true,
    });
  }
}
