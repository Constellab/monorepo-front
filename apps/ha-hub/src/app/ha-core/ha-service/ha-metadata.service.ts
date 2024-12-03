import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib';

@Injectable({
  providedIn: 'root',
})
export class HaMetadataService {
  constructor(
    private metaService: Meta,
    private titleService: Title,
    private translateService: FlTranslateService
  ) {}

  setPageTitle(title: string, hasTranslation: boolean = true, data?: any): void {
    if (hasTranslation) {
      this.translateService.get(title, data).subscribe((titleTrad: string) => {
        this.titleService.setTitle(titleTrad);
        this.metaService.updateTag({ name: 'og:title', content: titleTrad });
      });
    } else {
      this.titleService.setTitle(title);
      this.metaService.updateTag({ name: 'og:title', content: title });
    }
  }

  addMetaTag(name: string, content: string, hasTranslation: boolean = true, data?: any): void {
    if (hasTranslation) {
      this.translateService.get(content, data).subscribe((contentTrad: string) => {
        this.metaService.updateTag({ name: name, content: contentTrad });
      });
    } else {
      this.metaService.updateTag({ name: name, content: content });
    }
  }

  setSocialMetaTags(
    title: string,
    description: string,
    image: string,
    url: string,
    hasTranslation: boolean = true,
    data?: any
  ): void {
    this.setTwitterMetaTags(title, description, image, hasTranslation, data);
    this.setOGMetaTags(title, description, image, url, hasTranslation, data);
  }

  private setTwitterMetaTags(
    title: string,
    description: string,
    image: string,
    hasTranslation: boolean = true,
    data?: any
  ): void {
    this.addMetaTag('twitter:card', 'summary_large_image');
    this.addMetaTag('twitter:title', title);
    this.addMetaTag('twitter:description', description, hasTranslation, data);
    this.addMetaTag('twitter:image', image);
    this.addMetaTag('twitter:site', '@Gencovery');
  }

  private setOGMetaTags(
    title: string,
    description: string,
    image: string,
    url: string,
    hasTranslation: boolean = true,
    data?: any
  ): void {
    this.addMetaTag('og:title', title);
    this.addMetaTag('og:description', description, hasTranslation, data);
    this.addMetaTag('og:image', image);
    this.addMetaTag('og:url', url);
  }
}
