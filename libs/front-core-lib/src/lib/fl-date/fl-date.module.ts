import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlDateRangeComponent } from './component/fl-date-range/fl-date-range.component';
import { FlDatetimePickerComponent } from './component/fl-datetime-picker/fl-datetime-picker.component';
import { FlFromNowComponent } from './component/fl-from-now/fl-from-now.component';
import { FlLastSyncInfoComponent } from './component/fl-last-sync-info/fl-last-sync-info.component';
import { flDateI18n } from './i18n/fl-date.i18n';
import { FlDatePipe } from './pipe/fl-date/fl-date.pipe';
import { FlDurationPipe } from './pipe/fl-duration/fl-duration.pipe';
import { FlFromNowPipe } from './pipe/fl-from-now/fl-from-now.pipe';

/**
 * Module regrouping component and pipe for dates
 */
@NgModule({
  declarations: [
    FlDateRangeComponent,
    FlDatetimePickerComponent,
    FlDatePipe,
    FlFromNowPipe,
    FlFromNowComponent,
    FlDurationPipe,
    FlLastSyncInfoComponent,
  ],
  exports: [
    FlDateRangeComponent,
    FlDatetimePickerComponent,
    FlDatePipe,
    FlFromNowPipe,
    FlFromNowComponent,
    FlDurationPipe,
    FlLastSyncInfoComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlTranslateModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class FlDateModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlDateModule', flDateI18n);
  }
}
