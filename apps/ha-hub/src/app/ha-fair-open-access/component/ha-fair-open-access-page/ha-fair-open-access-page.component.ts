import { Component, OnInit, Signal, inject } from '@angular/core';
import { HaThemeState } from '../../../ha-core/ha-state/ha-theme.state';
import { HaMetadataService } from '../../../ha-core/ha-service/ha-metadata.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { FlTranslateService } from '@monorepo/front-core-lib';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-fair-open-access-page',
  templateUrl: './ha-fair-open-access-page.component.html',
  styleUrl: './ha-fair-open-access-page.component.scss',
  imports: [TranslatePipe],
})
export class HaFairOpenAccessPageComponent implements OnInit {
  private themeState = inject(HaThemeState);
  private metadataService = inject(HaMetadataService);
  private translateService = inject(FlTranslateService);

  isDarkTheme: Signal<boolean> = this.themeState.isDarkTheme;

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
