import { Component, OnInit, Signal } from '@angular/core';
import { HaThemeState } from '../../../ha-core/ha-state/ha-theme.state';
import { HaMetadataService } from '../../../ha-core/ha-service/ha-metadata.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { FlTranslateService } from '@monorepo/front-core-lib';

@Component({
  selector: 'ha-fair-open-access-page',
  templateUrl: './ha-fair-open-access-page.component.html',
  styleUrl: './ha-fair-open-access-page.component.scss',
})
export class HaFairOpenAccessPageComponent implements OnInit {
  isDarkTheme: Signal<boolean> = this.themeState.isDarkTheme;

  constructor(
    private themeState: HaThemeState,
    private metadataService: HaMetadataService,
    private translateService: FlTranslateService
  ) {}

  ngOnInit(): void {
    this.metadataService.setPageTitle('ha.foa.title', true);
    this.metadataService.setSocialMetaTags(
      this.translateService.translate('ha.foa.title'),
      'ha.foa.description',
      null,
      HaRouterService.getFullRoute(HaRouterService.getFairOpenAccessRoute()),
      true
    );
  }
}
