import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LiFolder } from '@monorepo/lab-lib/li-core';

/**
 * Show folder information in a compact way
 */
@Component({
  selector: 'li-folder-inline',
  templateUrl: './li-folder-inline.component.html',
  styleUrls: ['./li-folder-inline.component.scss'],
  imports: [FlColorModule, MatIcon, FlIconModule],
})
export class LiFolderInlineComponent {
  folder = input.required<LiFolder>();
}
