import { Component, OnInit } from '@angular/core';
import { CoIcon } from '../../model/co-icon.class';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'co-community-icon-select-dialog',
  templateUrl: './co-community-icon-select-dialog.component.html',
  styleUrl: './co-community-icon-select-dialog.component.scss',
})
export class CoCommunityIconSelectDialogComponent implements OnInit {
  matIconName: string;

  constructor(private dialogRef: MatDialogRef<CoCommunityIconSelectDialogComponent>) {}

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
