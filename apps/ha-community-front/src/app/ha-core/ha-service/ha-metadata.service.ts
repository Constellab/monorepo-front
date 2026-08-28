import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

/**
 * The social meta tags of a page, shared by the twitter and open graph variants.
 */
export interface HaSocialMetaTagsOptions {
  title: string;
  description: string;
  image: string;
  url: string;

  // when true the description is resolved through the translate service
  hasTranslation?: boolean;

  // interpolation data for the translated description
  data?: any;

  // open graph type, only used by the open graph tags
  ogType?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HaMetadataService {
  private metaService = inject(Meta);
  private titleService = inject(Title);
  private translateService = inject(FlTranslateService);

  setPageTitle(title: string, hasTranslation: boolean = false, data?: any): void {
    if (hasTranslation) {
      this.translateService.get(title, data).subscribe((titleTrad: string) => {
        this.titleService.setTitle(titleTrad);
      });
    } else {
      this.titleService.setTitle(title);
    }
  }

  addMetaTag(name: string, content: string, hasTranslation: boolean = false, data?: any): void {
    const isProperty = name.startsWith('og:') || name.startsWith('article:') || name.startsWith('profile:');
    const tag: Record<string, string> = isProperty ? { property: name, content } : { name, content };

    if (hasTranslation) {
      this.translateService.get(content, data).subscribe((contentTrad: string) => {
        this.metaService.updateTag({ ...tag, content: contentTrad });
      });
    } else {
      this.metaService.updateTag(tag);
    }
  }

  setSocialMetaTags(options: HaSocialMetaTagsOptions): void {
    const { title, description, image, hasTranslation = false, data } = options;
    this.setTwitterMetaTags(title, description, image, hasTranslation, data);
    this.setOGMetaTags(options);
  }

  getMetaTag(name: string, isProperty: boolean = false): string | undefined {
    return isProperty
      ? this.metaService.getTag(`property="${name}"`)?.content
      : this.metaService.getTag(`name="${name}"`)?.content;
  }

  getFacebookShareUrl(): string {
    const url: string = this.getMetaTag('og:url', true) ?? '';
    const title: string = this.getMetaTag('og:title', true) ?? '';
    const description: string = this.getMetaTag('og:description', true) ?? '';
    const image: string = this.getMetaTag('og:image', true) ?? '';

    return (
      `https://www.facebook.com/sharer/sharer.php?u=${url}&title=${title}` +
      `&description=${description}&picture=${image}`
    );
  }

  getTwitterShareUrl(): string {
    const title: string = this.getMetaTag('twitter:title') ?? '';
    const card: string = this.getMetaTag('twitter:card') ?? '';
    const description: string = this.getMetaTag('twitter:description') ?? '';
    const image: string = this.getMetaTag('twitter:image') ?? '';
    const site: string = this.getMetaTag('twitter:site') ?? '';

    return (
      `https://twitter.com/intent/tweet?text=${title}&card=${card}` +
      `&description=${description}&image=${image}&site=${site}`
    );
  }

  getLinkedInShareUrl(): string {
    const url: string = this.getMetaTag('og:url', true) ?? '';
    const title: string = this.getMetaTag('og:title', true) ?? '';
    const description: string = this.getMetaTag('og:description', true) ?? '';
    const image: string = this.getMetaTag('og:image', true) ?? '';

    return (
      `https://www.linkedin.com/shareArticle?mini=true&url=${url}` +
      `&title=${title}&summary=${description}&source=${image}`
    );
  }

  private setTwitterMetaTags(
    title: string,
    description: string,
    image: string,
    hasTranslation: boolean = false,
    data?: any
  ): void {
    this.addMetaTag('twitter:card', 'summary_large_image');
    this.addMetaTag('twitter:title', title);
    this.addMetaTag('twitter:description', description, hasTranslation, data);
    if (image) this.addMetaTag('twitter:image', image);
    else this.metaService.removeTag(`name="twitter:image"`);
    this.addMetaTag('twitter:site', '@Gencovery');
  }

  private setOGMetaTags(options: HaSocialMetaTagsOptions): void {
    const { title, description, image, url, hasTranslation = false, data, ogType = 'website' } = options;
    this.metaService.updateTag({ property: 'og:type', content: ogType });
    this.metaService.updateTag({ property: 'og:title', content: title });
    if (hasTranslation) {
      this.metaService.updateTag({
        property: 'og:description',
        content: this.translateService.translate(description, data),
      });
    } else {
      this.metaService.updateTag({ property: 'og:description', content: description });
    }
    if (image) this.metaService.updateTag({ property: 'og:image', content: image });
    else this.metaService.removeTag(`property="og:image"`);
    this.metaService.updateTag({ property: 'og:url', content: url });
  }
}
