import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlInfiniteScrollComponent } from './component/fl-infinite-scroll/fl-infinite-scroll.component';
import { FlInfiniteScrollDirective } from './directive/fl-infinite-scroll/fl-infinite-scroll.directive';
import { FlInfiniteLoadMoreResultComponent } from './component/fl-infinite-load-more-result/fl-infinite-load-more-result.component';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { MatIconModule } from '@angular/material/icon';
import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlInfiniteTableContainerComponent } from './component/fl-infinite-table-container/fl-infinite-table-container.component';
import { MatButtonModule } from '@angular/material/button';
import { CdkScrollable } from '@angular/cdk/overlay';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { flInfiniteScrollI18n } from './fl-infinite-scroll.i18n';

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

    translateService.addModuleTranslation('FlInfiniteScrollModule', flInfiniteScrollI18n);
  }
}
