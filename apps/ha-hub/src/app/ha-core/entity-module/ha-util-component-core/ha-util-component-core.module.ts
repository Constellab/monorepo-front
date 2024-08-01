import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HaCoreModule} from '../../ha-core.module';
import {HaLikeButtonComponent} from './component/ha-like-button/ha-like-button.component';
import {HaCommentButtonComponent} from './component/ha-comment-button/ha-comment-button.component';
import { HaTextEditorRightSidePanelComponent } from './component/ha-text-editor-right-side-panel/ha-text-editor-right-side-panel.component';

@NgModule({
  declarations: [
    HaLikeButtonComponent,
    HaCommentButtonComponent,
    HaTextEditorRightSidePanelComponent
  ],
    exports: [
        HaLikeButtonComponent,
        HaCommentButtonComponent,
        HaTextEditorRightSidePanelComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HaCoreModule
  ]
})
export class HaUtilComponentCoreModule {
}
