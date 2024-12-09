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

  getMetaTag(name: string): string {
    return this.metaService.getTag(`name="${name}"`).content;
  }

  getFacebookShareUrl(): string {
    const url: string = this.getMetaTag('og:url');
    const title: string = this.getMetaTag('og:title');
    const description: string = this.getMetaTag('og:description');
    const image: string = this.getMetaTag('og:image');

    return `https://www.facebook.com/sharer/sharer.php?u=${url}&title=${title}&description=${description}&picture=${image}`;
  }

  getTwitterShareUrl(): string {
    const title: string = this.getMetaTag('twitter:title');
    const card: string = this.getMetaTag('twitter:card');
    const description: string = this.getMetaTag('twitter:description');
    const image: string = this.getMetaTag('twitter:image');
    const site: string = this.getMetaTag('twitter:site');

    return `https://twitter.com/intent/tweet?text=${title}&card=${card}&description=${description}&image=${image}&site=${site}`;
  }

  getLinkedInShareUrl(): string {
    const url: string = this.getMetaTag('og:url');
    const title: string = this.getMetaTag('og:title');
    const description: string = this.getMetaTag('og:description');
    const image: string = this.getMetaTag('og:image');

    return `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${description}&source=${image}`;
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
