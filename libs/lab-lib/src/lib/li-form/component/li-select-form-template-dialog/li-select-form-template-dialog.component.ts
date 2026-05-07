import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

import { LiFormTemplate } from '../../model/li-form-template.entity';
import { LiFormTemplateSearchComponent } from '../li-form-template-search/li-form-template-search.component';

@Component({
  selector: 'li-select-form-template-dialog',
  templateUrl: './li-select-form-template-dialog.component.html',
  imports: [FlDialogModule, MatDialogContent, LiFormTemplateSearchComponent, TranslatePipe],
})
export class LiSelectFormTemplateDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectFormTemplateDialogComponent>>(MatDialogRef);

  columns: FlTableColumnStatic<LiFormTemplate>[] = ['name', 'tags', 'lastModification'];

  onTemplateSelected(template: LiFormTemplate): void {
    this.dialogRef.close(template);
  }
}
