import { inject, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateModule, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { MaMailContentDialogComponent } from './components/ma-mail-content-dialog/ma-mail-content-dialog.component';
import { MaMailErrorDialogComponent } from './components/ma-mail-error-dialog/ma-mail-error-dialog.component';
import { MaMailSearchComponent } from './components/ma-mail-search/ma-mail-search.component';
import { MaMailSearchFormComponent } from './components/ma-mail-search-form/ma-mail-search-form.component';
import { MaMailTableComponent } from './components/ma-mail-table/ma-mail-table.component';
import { maMailI18n } from './ma-mail.i18n';

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
