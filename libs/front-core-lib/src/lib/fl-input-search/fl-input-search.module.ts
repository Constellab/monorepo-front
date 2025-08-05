import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';

import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlInputSearchComponent } from './component/fl-input-search/fl-input-search.component';
import { FlInputSearchOptionDirective } from './directive/fl-input-search-option.directive';
import { FlInputSearchPrefixDirective } from './directive/fl-input-search-prefix.directive';

@NgModule({
  declarations: [FlInputSearchComponent, FlInputSearchOptionDirective, FlInputSearchPrefixDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,

    FlInfiniteScrollModule,
    FlLoaderModule,
  ],
  exports: [FlInputSearchComponent, FlInputSearchOptionDirective, FlInputSearchPrefixDirective],
})
export class FlInputSearchModule {}
