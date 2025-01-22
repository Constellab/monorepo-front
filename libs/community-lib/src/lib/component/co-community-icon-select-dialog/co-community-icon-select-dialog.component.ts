import { Component, OnInit, inject } from '@angular/core';
import { CoIcon } from '../../model/co-icon.class';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'co-community-icon-select-dialog',
  templateUrl: './co-community-icon-select-dialog.component.html',
  styleUrl: './co-community-icon-select-dialog.component.scss',
  standalone: false,
})
export class CoCommunityIconSelectDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<CoCommunityIconSelectDialogComponent>>(MatDialogRef);

  matIconName: string;

  ngOnInit(): void {}

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
