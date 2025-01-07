import { HaMetadataService } from '../ha-service/ha-metadata.service';
import { FlTranslatableText, FlTranslateService } from '@monorepo/front-core-lib';
import { inject } from '@angular/core';

//TODO: Voir si ajouter le type d'objet pour les pages serait pertinnent
export class HaCommunityPage {
  translateService: FlTranslateService = inject(FlTranslateService);
  metadataService: HaMetadataService = inject(HaMetadataService);

  setMetaTags(
    pageTitle: FlTranslatableText,
    pageDescription: FlTranslatableText,
    image: string,
    url: string
  ): void {
    const title = this.translateService.translatableText(pageTitle);
    const description = this.translateService.translatableText(pageDescription);
    this.metadataService.setPageTitle(title);

    this.metadataService.addMetaTag('description', description);

    this.metadataService.setSocialMetaTags(title, description, image, url);
  }
}
