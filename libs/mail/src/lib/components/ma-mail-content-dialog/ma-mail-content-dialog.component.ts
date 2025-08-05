import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MaMailEntity } from '../../models/ma-mail.entity';

@Component({
  selector: 'ma-mail-content-dialog',
  templateUrl: './ma-mail-content-dialog.component.html',
  styleUrl: './ma-mail-content-dialog.component.scss',
  standalone: false,
})
export class MaMailContentDialogComponent {
  mail: MaMailEntity = inject(MAT_DIALOG_DATA);
}
