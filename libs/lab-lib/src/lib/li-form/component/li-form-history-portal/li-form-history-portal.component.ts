import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FL_PORTAL_DATA, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { TdParamSpecs } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

import { LiFormHistoryComponent } from '../li-form-history/li-form-history.component';

export interface LiFormHistoryPortalData {
  formId: string;
  specs?: TdParamSpecs;
}

@Component({
  selector: 'li-form-history-portal',
  templateUrl: './li-form-history-portal.component.html',
  styleUrl: './li-form-history-portal.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlPortalModule, LiFormHistoryComponent, TranslatePipe],
})
export class LiFormHistoryPortalComponent {
  formId: string;
  specs?: TdParamSpecs;

  constructor() {
    const data = inject<LiFormHistoryPortalData>(FL_PORTAL_DATA);
    this.formId = data.formId;
    this.specs = data.specs;
  }
}
