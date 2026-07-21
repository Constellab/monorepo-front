import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { CoIcon } from '../../model/co-icon.class';

@Component({
  selector: 'co-community-icon-select-dialog',
  templateUrl: './co-community-icon-select-dialog.component.html',
  styleUrl: './co-community-icon-select-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CoCommunityIconSelectDialogComponent {
  private dialogRef = inject<MatDialogRef<CoCommunityIconSelectDialogComponent>>(MatDialogRef);

  matIconName: string;

  changeMaterialIcon(event: string): void {
    this.matIconName = event;
  }

  selectIcon(eventIcon: [Event, CoIcon]): void {
    const icon = eventIcon[1];
    this.dialogRef.close(icon);
  }

  selectMaterialIcon(): void {
    this.dialogRef.close({ type: 'MATERIAL_ICON', technicalName: this.matIconName });
  }
}
