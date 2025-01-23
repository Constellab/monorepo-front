import { Component } from '@angular/core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Simple dialog to show a help message to explain the use of a tag
 */
@Component({
  selector: 'lab-tag-help-dialog',
  templateUrl: './lab-tag-help-dialog.component.html',
  styleUrls: ['./lab-tag-help-dialog.component.scss'],
  imports: [FlDialogModule, CdkScrollable, MatDialogContent, TranslatePipe],
})
export class LabTagHelpDialogComponent {}
