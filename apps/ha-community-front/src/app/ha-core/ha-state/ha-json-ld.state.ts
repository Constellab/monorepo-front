import { DOCUMENT,inject, Injectable } from '@angular/core';
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
    const jsonLdContent = `{
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${headline}",
      "image": [
        "${image.join('", "')}"
      ],
      "datePublished": "${datePublished}",
      "author": [
        ${author
    .map(
      (a) => `{
            "@type": "Person",
            "name": "${a.alias}",
            "url": "${HaRouterService.getFullRoute(HaRouterService.getUserProfileRoute(a.id))}"
          }`
    )
    .join(', ')}
      ]
    }`;
    this.setJsonLdContent(jsonLdContent);
  }

  public setProfilePageJsonLdContent(user: CoUser, photo: string): void {
    this.clearJsonLdContent();
    const jsonLdContent = `{
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "name": "${user.alias}",
        "identifier": "${user.userCode}" ${
  photo
    ? `,
        "image": "${photo}"`
    : ''
}
      }
    }`;
    this.setJsonLdContent(jsonLdContent);
  }

  public setProductJsonLdContent(name: string, price: number = 0): void {
    this.clearJsonLdContent();
    const jsonLdContent = `{
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "${name}",
      "offers": {
        "@type": "Offer",
        "price": "${price}",
        "priceCurrency": "USD"
      }
    }`;
    this.setJsonLdContent(jsonLdContent);
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
