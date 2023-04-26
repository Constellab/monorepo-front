import { Injectable } from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class HaMetadataService {

  constructor(
    private metaService: Meta,
    private titleService: Title,
    private translateService: TranslateService
  ) { }

  setPageTitle(title: string, hasTranslation: boolean = true, data?: any): void {
    if (hasTranslation) {
      this.translateService.get(title, data).subscribe((titleTrad: string) => {
        this.titleService.setTitle(titleTrad);
      });
    } else {
      this.titleService.setTitle(title);
    }
  }

  addMetaTag(name: string, content: string, hasTranslation: boolean = true, data?: any): void {
    if (hasTranslation) {
      this.translateService.get(content, data).subscribe((contentTrad: string) => {
        this.metaService.updateTag({name: name, content: contentTrad});
      });
    } else {
      this.metaService.updateTag({name: name, content: content});
    }
  }
}
