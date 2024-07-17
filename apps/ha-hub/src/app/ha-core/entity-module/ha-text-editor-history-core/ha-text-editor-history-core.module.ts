import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HaCoreModule} from '../../ha-core.module';
import {
  HaTextEditorHistoryPortalComponent
} from './component/ha-text-editor-history-portal/ha-text-editor-history-portal.component';
import { HaTextEditorHistoryModificationComponent } from './component/ha-text-editor-history-modification/ha-text-editor-history-modification.component';
import {FormsModule} from '@angular/forms';
import { HaTextEditorHistoryModificationGroupComponent } from './component/ha-text-editor-history-modification-group/ha-text-editor-history-modification-group.component';
import {MatExpansionModule} from "@angular/material/expansion";
import { HaTextEditorHistoryModificationVisualizerDialogComponent } from './component/ha-text-editor-history-modification-visualizer-dialog/ha-text-editor-history-modification-visualizer-dialog.component';


@NgModule({
  declarations: [HaTextEditorHistoryModificationComponent, HaTextEditorHistoryPortalComponent, HaTextEditorHistoryModificationGroupComponent, HaTextEditorHistoryModificationVisualizerDialogComponent, ],
  exports: [HaTextEditorHistoryModificationComponent, HaTextEditorHistoryPortalComponent, ],
    imports: [
        CommonModule,
        HaCoreModule,
        FormsModule,
        MatExpansionModule
    ]
})
export class HaTextEditorHistoryCoreModule {

}
