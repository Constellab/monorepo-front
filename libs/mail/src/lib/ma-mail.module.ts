import { inject, NgModule } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateModule, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { maMailI18n } from './ma-mail.i18n';
import { MaMailSearchComponent } from './components/ma-mail-search/ma-mail-search.component';
import { MaMailSearchFormComponent } from './components/ma-mail-search-form/ma-mail-search-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MaMailTableComponent } from './components/ma-mail-table/ma-mail-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MaMailErrorDialogComponent } from './components/ma-mail-error-dialog/ma-mail-error-dialog.component';
import { MaMailContentDialogComponent } from './components/ma-mail-content-dialog/ma-mail-content-dialog.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    MaMailSearchComponent,
    MaMailSearchFormComponent,
    MaMailTableComponent,
    MaMailErrorDialogComponent,
    MaMailContentDialogComponent,
  ],
  exports: [MaMailSearchComponent, MaMailTableComponent],
  imports: [
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatMenuModule,

    FlTranslateModule,
    FlDialogModule,
    FlSearchModule,
    FlCorePipeModule,
    FlCardModule,
    FlIconModule,
    FlTextIconModule,
    FlStatusModule,
    FlDateModule,
  ],
})
export class MaMailModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('MaMailModule', maMailI18n);
  }
}
