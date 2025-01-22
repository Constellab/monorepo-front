import { NgModule, inject } from '@angular/core';
import {
  FlCardModule,
  FlCorePipeModule,
  FlDateModule,
  FlDialogModule,
  FlIconModule,
  FlSearchModule,
  FlStatusModule,
  FlTextIconModule,
  FlTranslateModule,
  FlTranslateService,
} from '@monorepo/front-core-lib';
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
