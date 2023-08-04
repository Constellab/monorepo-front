import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlCodeEditorComponent} from './component/fl-code-editor/fl-code-editor.component';

@NgModule({
  declarations: [
    FlCodeEditorComponent
  ],
  exports: [
    FlCodeEditorComponent
  ],
  imports: [CommonModule],
})
export class FlCodeEditorModule {}
