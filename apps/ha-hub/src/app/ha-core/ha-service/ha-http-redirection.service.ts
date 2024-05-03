import {Injectable} from '@angular/core';
import {HaMetadataService} from './ha-metadata.service';
import {Router} from '@angular/router';
import {HaMetadataNamesConfig} from '../ha-model/ha-config/ha-metadata-names.config';

@Injectable({
  providedIn: 'root'
})
export class HaHttpRedirectionService {

  constructor(
    private metadataService: HaMetadataService,
    private router: Router
  ) {
  }

  redirectTo(url: string): void {
    this.metadataService.addMetaTag(HaMetadataNamesConfig.REDIRECT_URL, url, false);
    this.router.navigate([url], {
      replaceUrl: true,
      preserveFragment: true
    });
  }
}
