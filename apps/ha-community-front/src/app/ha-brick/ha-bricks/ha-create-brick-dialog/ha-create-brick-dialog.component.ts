import { ChangeDetectionStrategy,Component } from '@angular/core';
import { MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

import { HaEditBrickFormComponent } from '../ha-edit-brick-form/ha-edit-brick-form.component';

@Component({
  selector: 'ha-create-brick-dialog',
  templateUrl: './ha-create-brick-dialog.component.html',
  styleUrls: ['./ha-create-brick-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlDialogModule, HaEditBrickFormComponent, TranslatePipe, MatDialogContent],
})
export class HaCreateBrickDialogComponent {}
