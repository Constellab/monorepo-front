import {NgModule} from '@angular/core';
import {
  FlDateModule,
  FlKeyValueModule,
  FlTranslateModule,
  FlTranslateService,
  FlUserModule
} from '@monorepo/front-core-lib';
import {ltLiveTaskI18n} from './lt-live-last.i18n';
import {LtLiveTaskListItemComponent} from './component/lt-live-task-list-item/lt-live-task-list-item.component';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';

@NgModule({
  imports: [
    FlDateModule,
    FlKeyValueModule,
    FlTranslateModule,
    FlUserModule,
    MatButtonModule,
    NgIf
  ],
  declarations: [LtLiveTaskListItemComponent],
  exports: [
    LtLiveTaskListItemComponent
  ]
})
export class LtLiveTaskModule{
  constructor(translateService: FlTranslateService) {
    translateService.addModuleTranslation(
      'LtLiveTaskModule',
      ltLiveTaskI18n
    );
  }
}
