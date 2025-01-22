import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaLabConfig } from '../../../../model/entities/lab/ca-lab-config.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlTranslatableText } from '@monorepo/front-core-lib';

export interface CaLabConfigDialogInput {
  labConfig: Observable<CaLabConfig>;
  title: FlTranslatableText;
  helpText: FlTranslatableText;
}

/**
 * Show the configuration of a lab
 */
@Component({
  selector: 'ca-lab-config-dialog',
  templateUrl: './ca-lab-config-dialog.component.html',
  styleUrls: ['./ca-lab-config-dialog.component.scss'],
  standalone: false,
})
export class CaLabConfigDialogComponent {
  labConfig$: Observable<CaLabConfig>;
  title: FlTranslatableText;
  helpText: FlTranslatableText;

  constructor() {
    const input = inject<CaLabConfigDialogInput>(MAT_DIALOG_DATA);

    this.labConfig$ = input.labConfig;
    this.title = input.title;
    this.helpText = input.helpText;
  }
}
