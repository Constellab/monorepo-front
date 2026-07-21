import { ChangeDetectionStrategy,Component, computed, inject, input, output, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';

import { Ha404Component } from '../../../ha-404/ha-404/ha-404.component';
import { HaHomeSectionShineComponent } from '../../../ha-home/ha-home-section-shine/ha-home-section-shine.component';
import { HaEntityType } from '../../ha-model/ha-entities/ha-entity-type';
import { HaAuthenticatedUserService } from '../../ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../../ha-service/ha-router.service';
import { HaCurrentPageState } from '../../ha-state/ha-current-page.state';
import { HaFooterComponent } from '../ha-footer/ha-footer/ha-footer.component';
import { HaPageHeaderComponent } from '../ha-header/ha-page-header/ha-page-header.component';

@Component({
  selector: 'ha-page',
  templateUrl: './ha-page.component.html',
  styleUrls: ['./ha-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  pageTitle = input<string | null>(null);
  showPageDescription = input<boolean>(true);
  isLoading = input<boolean>(false);
  notFound = input<boolean>(false);
  hideCreateSection = input<boolean>(false);
  showHeaderCreateButton = input<boolean>(false);

  openCreateDialogOutput = output<void>();

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
      case HaEntityType.ICON:
        return 'icon_list';
      case HaEntityType.TAG:
        return 'tag_list';
      case HaEntityType.PARTNER:
        return 'partner_list';
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
    this.openCreateDialogOutput.emit();
    this.currentPageState.openCreateDialog();
  }
}
