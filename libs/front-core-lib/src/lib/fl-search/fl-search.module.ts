import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlDrawerModule } from '../fl-drawer/fl-drawer.module';
import { FlSearchAdvancedFormComponent } from './component/fl-search-advanced-form/fl-search-advanced-form.component';
import { FlSearchHeaderComponent } from './component/fl-search-header/fl-search-header.component';
import { FlSearchResultComponent } from './component/fl-search-result/fl-search-result.component';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { flSearchI18n } from './i18n/fl-search.i18n';
import { FlFormInputsManagerModule } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlSearchSavedListComponent } from './component/fl-search-saved-list/fl-search-saved-list.component';
import { FlSearchDateIntervalComponent } from './component/fl-search-date-interval/fl-search-date-interval.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FlSearchDrawerToggleDirective } from './directive/fl-search-drawer-toggle/fl-search-drawer-toggle.directive';
import { FlSearchHeaderActionsComponent } from './component/fl-search-header-actions/fl-search-header-actions.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlSearchTableSortDirective } from './directive/fl-search-table-sort/fl-search-table-sort.directive';
import { FlSearchComponent } from './component/fl-search/fl-search.component';

@NgModule({
  declarations: [
    FlSearchComponent,
    FlSearchAdvancedFormComponent,
    FlSearchHeaderComponent,
    FlSearchResultComponent,
    FlSearchSavedListComponent,
    FlSearchDateIntervalComponent,
    FlSearchDrawerToggleDirective,
    FlSearchHeaderActionsComponent,
    FlSearchTableSortDirective,
  ],
  exports: [
    FlSearchComponent,
    FlSearchAdvancedFormComponent,
    FlSearchHeaderComponent,
    FlSearchResultComponent,
    FlSearchSavedListComponent,
    FlSearchDateIntervalComponent,
    FlSearchDrawerToggleDirective,
    FlSearchHeaderActionsComponent,
    FlSearchTableSortDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,

    FlInfiniteScrollModule,
    FlLoaderModule,
    FlDrawerModule,
    FlTranslateModule,
    FlFormInputsManagerModule,
  ],
})
export class FlSearchModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlSearchModule', flSearchI18n);
  }
}
