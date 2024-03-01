import {NgModule} from '@angular/core';
import {
    FlCoreDirectiveModule,
    FlCorePipeModule,
    FlDateModule,
    FlDialogModule,
    FlKeyValueModule,
    FlLoaderModule, FlSectionModule,
    FlTranslateModule,
    FlTranslateService,
    FlUserModule,
} from '@monorepo/front-core-lib';
import {ltLiveTaskI18n} from './lt-live-last.i18n';
import {LtLiveTaskListItemComponent} from './component/lt-live-task-list-item/lt-live-task-list-item.component';
import {MatButtonModule} from '@angular/material/button';
import {AsyncPipe, CommonModule, NgForOf, NgIf} from '@angular/common';
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {ReactiveFormsModule} from "@angular/forms";
import {
  LtLiveTaskCreateDialogFormComponent
} from './component/lt-live-task-create-dialog-form/lt-live-task-create-dialog-form.component';

@NgModule({
    imports: [
        CommonModule,
        FlDateModule,
        FlKeyValueModule,
        FlTranslateModule,
        FlUserModule,
        MatButtonModule,
        FlCoreDirectiveModule,
        FlCorePipeModule,
        FlDialogModule,
        FlLoaderModule,
        MatDialogActions,
        MatDialogContent,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        ReactiveFormsModule,
        FlSectionModule,
    ],
  declarations: [LtLiveTaskListItemComponent, LtLiveTaskCreateDialogFormComponent],
  exports: [LtLiveTaskListItemComponent, LtLiveTaskCreateDialogFormComponent],
})
export class LtLiveTaskModule {
  constructor(translateService: FlTranslateService) {
    translateService.addModuleTranslation('LtLiveTaskModule', ltLiveTaskI18n);
  }
}
