import { Component, computed, inject, input, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';

import { HaHomeSectionShineComponent } from '../../../ha-home/ha-home-section-shine/ha-home-section-shine.component';
import { Ha404Component } from '../../../ha404/ha404.component';
import { HaEntityType } from '../../ha-model/ha-entities/ha-entity-type';
import { HaCurrentPageState } from '../../ha-state/ha-current-page.state';
import { HaFooterComponent } from '../ha-footer/ha-footer/ha-footer.component';
import { HaPageHeaderComponent } from '../ha-header/ha-page-header/ha-page-header.component';
import { HaAuthenticatedUserService } from '../../ha-service/ha-authenticated-user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { HaRouterService } from '../../ha-service/ha-router.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ha-page',
  templateUrl: './ha-page.component.html',
  styleUrls: ['./ha-page.component.scss'],
  imports: [
    TranslatePipe,
    HaFooterComponent,
    HaHomeSectionShineComponent,
    HaPageHeaderComponent,
    MatButton,
    FlLoaderModule,
    Ha404Component,
    RouterLink,
  ],
})
export class HaPageComponent {
  pageTitle = input<string>(null);
  showPageDescription = input<boolean>(true);
  isLoading = input<boolean>(false);
  notFound = input<boolean>(false);

  private currentPageState = inject(HaCurrentPageState);
  private authenticatedUserService = inject(HaAuthenticatedUserService);

  private pageString: Signal<string> = computed(() => {
    const currentEntityType = this.currentPageState.getCurrentEntityType()();
    switch (currentEntityType) {
      case HaEntityType.STORY:
        return 'story_list';
      case HaEntityType.BRICK:
        return 'brick_list';
      case HaEntityType.APP:
        return 'app_list';
      case HaEntityType.AGENT:
        return 'agent_list';
      default:
        return 'list_page';
    }
  });
  headerTitle: Signal<FlTranslatableText> = computed(() => {
    const headerTitle: FlTranslatableText = {
      text: this.pageTitle() ?? `${this.pageString()}.header.title`,
      translateText: !this.pageTitle(),
    };
    return headerTitle;
  });
  headerDescription = computed(() => {
    return this.showPageDescription() ? `${this.pageString()}.header.description` : null;
  });

  createSectionHint = computed(() => `${this.pageString()}.create_section.hint`);
  createSectionTitle = computed(() => `${this.pageString()}.create_section.title`);
  createSectionSubtitle = computed(() => `${this.pageString()}.create_section.subtitle`);
  createSectionSubmit = computed(() => `${this.pageString()}.create_section.submit`);
  currentUser = toSignal(this.authenticatedUserService.getUser());
  loginRoute = HaRouterService.getLoginRoute();

  openCreateDialog(): void {
    this.currentPageState.openCreateDialog();
  }
}
