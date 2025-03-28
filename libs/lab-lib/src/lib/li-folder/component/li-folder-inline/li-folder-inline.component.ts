import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { LiFolder } from '@monorepo/lab-lib/li-core';

/**
 * Show folder information in a compact way
 */
@Component({
  selector: 'li-folder-inline',
  templateUrl: './li-folder-inline.component.html',
  styleUrls: ['./li-folder-inline.component.scss'],
  imports: [FlColorModule],
})
export class LiFolderInlineComponent {
  @Input() folder: LiFolder;

  @Output() selectionChange: EventEmitter<LiFolder | null> = new EventEmitter();
}
