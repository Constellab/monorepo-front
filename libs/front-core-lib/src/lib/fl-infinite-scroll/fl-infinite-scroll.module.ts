import { CdkScrollable } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlInfiniteLoadMoreResultComponent } from './component/fl-infinite-load-more-result/fl-infinite-load-more-result.component';
import { FlInfiniteScrollComponent } from './component/fl-infinite-scroll/fl-infinite-scroll.component';
import { FlInfiniteTableContainerComponent } from './component/fl-infinite-table-container/fl-infinite-table-container.component';
import { FlInfiniteScrollDirective } from './directive/fl-infinite-scroll/fl-infinite-scroll.directive';
import { FL_INFINITE_SCROLL_I18N } from './fl-infinite-scroll.i18n';

@NgModule({
  declarations: [
    FlInfiniteScrollDirective,
    FlInfiniteScrollComponent,
    FlInfiniteLoadMoreResultComponent,
    FlInfiniteTableContainerComponent,
  ],
  exports: [
    FlInfiniteScrollDirective,
    FlInfiniteScrollComponent,
    FlInfiniteLoadMoreResultComponent,
    FlInfiniteTableContainerComponent,
  ],
  imports: [CommonModule, FlTranslateModule, FlLoaderModule, MatButtonModule, MatIconModule, CdkScrollable],
})
export class FlInfiniteScrollModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlInfiniteScrollModule', FL_INFINITE_SCROLL_I18N);
  }
}
