import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { FlDialogModule } from '../fl-dialog/fl-dialog.module';
import { FlCodeDialogComponent } from './component/fl-code-dialog/fl-code-dialog.component';
import { FlCodeEditorComponent } from './component/fl-code-editor/fl-code-editor.component';

@NgModule({
  declarations: [FlCodeEditorComponent, FlCodeDialogComponent],
  exports: [FlCodeEditorComponent, FlCodeDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, FlDialogModule],
})
export class FlCodeEditorModule {}
