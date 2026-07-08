import { CommonModule } from '@angular/common';
import { inject,NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlFormInputsManagerModule } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlDrawerModule } from '../fl-drawer/fl-drawer.module';
import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlSearchComponent } from './component/fl-search/fl-search.component';
import { FlSearchAdvancedFormComponent } from './component/fl-search-advanced-form/fl-search-advanced-form.component';
import { FlSearchDateIntervalComponent } from './component/fl-search-date-interval/fl-search-date-interval.component';
import { FlSearchHeaderComponent } from './component/fl-search-header/fl-search-header.component';
import { FlSearchHeaderActionsComponent } from './component/fl-search-header-actions/fl-search-header-actions.component';
import { FlSearchResultComponent } from './component/fl-search-result/fl-search-result.component';
import { FlSearchSavedListComponent } from './component/fl-search-saved-list/fl-search-saved-list.component';
import { FlSearchDrawerToggleDirective } from './directive/fl-search-drawer-toggle/fl-search-drawer-toggle.directive';
import { FlSearchTableSortDirective } from './directive/fl-search-table-sort/fl-search-table-sort.directive';
import { FL_SEARCH_I18N } from './i18n/fl-search.i18n';

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

    translateService.addModuleTranslation('FlSearchModule', FL_SEARCH_I18N);
  }
}
