import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';
import { MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Simple dialog to show a help message to explain the use of a tag
 */
@Component({
  selector: 'li-tag-help-dialog',
  templateUrl: './li-tag-help-dialog.component.html',
  styleUrls: ['./li-tag-help-dialog.component.scss'],
  imports: [FlDialogModule, CdkScrollable, MatDialogContent, TranslatePipe],
})
export class LiTagHelpDialogComponent {}
