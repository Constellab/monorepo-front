import { DOCUMENT, inject, Injectable } from '@angular/core';
import { CoUser } from '@monorepo/community-lib';
import { DateTime } from 'luxon';

import { HaRouterService } from '../ha-service/ha-router.service';

@Injectable()
export class HaJsonLdState {
  private document: Document = inject(DOCUMENT);

  public setArticleJsonLdContent(
    headline: string,
    image: string[],
    datePublished: DateTime,
    author: CoUser[]
  ): void {
    this.clearJsonLdContent();
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      image,
      datePublished: String(datePublished),
      author: author.map((a) => ({
        '@type': 'Person',
        name: a.alias,
        url: HaRouterService.getFullRoute(HaRouterService.getUserProfileRoute(a.id)),
      })),
    };
    this.setJsonLdContent(JSON.stringify(jsonLd));
  }

  public setProfilePageJsonLdContent(user: CoUser, photo: string): void {
    this.clearJsonLdContent();

    const profileUrl = HaRouterService.getFullRoute(HaRouterService.getUserProfileRoute(user.id));

    const sameAs: string[] = [];
    if (user.githubLink) sameAs.push(user.githubLink);
    if (user.linkedinLink) sameAs.push(user.linkedinLink);
    if (user.xLink) sameAs.push(user.xLink);

    const person: Record<string, unknown> = {
      '@type': 'Person',
      name: user.alias,
      identifier: user.userCode,
      url: profileUrl,
    };
    if (photo) person.image = photo;
    if (sameAs.length > 0) person.sameAs = sameAs;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      url: profileUrl,
      mainEntity: person,
    };

    this.setJsonLdContent(JSON.stringify(jsonLd));
  }

  public setProductJsonLdContent(name: string, price: number = 0): void {
    this.clearJsonLdContent();
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      offers: {
        '@type': 'Offer',
        price: String(price),
        priceCurrency: 'USD',
      },
    };
    this.setJsonLdContent(JSON.stringify(jsonLd));
  }

  public clearJsonLdContent(): void {
    if (this.document.head.querySelector('script[type="application/ld+json"]') != null) {
      this.document.head.querySelector('script[type="application/ld+json"]').remove();
    }
  }

  private setJsonLdContent(content: string): void {
    const jsonLdScript = this.document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.text = content;
    this.document.head.appendChild(jsonLdScript);
  }
}
