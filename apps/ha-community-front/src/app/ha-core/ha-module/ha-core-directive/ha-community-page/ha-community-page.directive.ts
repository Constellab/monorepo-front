import { Directive, inject, OnDestroy } from '@angular/core';
import { FlTranslatableText, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { forkJoin, of, Subscription } from 'rxjs';

import { HaMetadataService } from '../../../ha-service/ha-metadata.service';

@Directive()
export class HaCommunityPageDirective implements OnDestroy {
  translateService: FlTranslateService = inject(FlTranslateService);
  metadataService: HaMetadataService = inject(HaMetadataService);

  subscription: Subscription;

  setMetaTags(
    pageTitle: FlTranslatableText,
    pageDescription: FlTranslatableText,
    image: string,
    url: string,
    ogType: string = 'website'
  ): void {
    this.subscription = forkJoin({
      title: this.translateService.translatableTextObs(pageTitle) ?? of(''),
      description: this.translateService.translatableTextObs(pageDescription) ?? of(''),
    }).subscribe((value) => {
      this.metadataService.setPageTitle(value.title, false);
      this.metadataService.addMetaTag('description', value.description);
      this.metadataService.setSocialMetaTags({
        title: value.title,
        description: value.description,
        image,
        url,
        ogType,
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
