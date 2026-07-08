import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';

import {
  FlAutocompleteMultipleComponent,
} from './fl-autocomplete-multiple/fl-autocomplete-multiple.component';

/**
 * Module for the {@link FlAutocompleteMultipleComponent}. It is an autocomplete that supported
 * multiple selected choices
 */
@NgModule({
  declarations: [FlAutocompleteMultipleComponent],
  imports: [
    CommonModule,

    FlCoreDirectiveModule,

    MatChipsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
  ],
  exports: [FlAutocompleteMultipleComponent],
})
export class FlAutocompleteMultipleModule {}
