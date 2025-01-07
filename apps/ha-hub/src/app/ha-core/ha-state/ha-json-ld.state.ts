import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { DateTime } from 'luxon';
import { HaRouterService } from '../ha-service/ha-router.service';
import { CoUser } from '@monorepo/community-lib';

@Injectable()
export class HaJsonLdState {
  private jsonLdContent: WritableSignal<string> = signal<string>(null);

  public getJsonLdContent(): Signal<string> {
    return this.jsonLdContent;
  }

  public setArticleJsonLdContent(
    headline: string,
    image: string[],
    datePublished: DateTime,
    author: CoUser[]
  ): void {
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
    const jsonLdContent = `{
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "name": "${user.alias}",
        "identifier": "${user.userCode}" ${
          photo
            ? `,
        "image": "${photo}`
            : ''
        }
      }
    }`;
    this.setJsonLdContent(jsonLdContent);
  }

  public setProductJsonLdContent(name: string, price: number = 0): void {
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
    this.setJsonLdContent(null);
  }

  private setJsonLdContent(content: string): void {
    this.jsonLdContent.set(content);
  }
}
