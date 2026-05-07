import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

import { LiForm } from '../../model/li-form.entity';
import { LiFormSearchComponent } from '../li-form-search/li-form-search.component';

@Component({
  selector: 'li-select-form-dialog',
  templateUrl: './li-select-form-dialog.component.html',
  imports: [FlDialogModule, MatDialogContent, LiFormSearchComponent, TranslatePipe],
})
export class LiSelectFormDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectFormDialogComponent>>(MatDialogRef);

  columns: FlTableColumnStatic<LiForm>[] = ['name', 'status', 'template', 'tags'];

  onFormSelected(form: LiForm): void {
    this.dialogRef.close(form);
  }
}
