import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Generic dialog title with centered title and close button
 */
@Component({
  selector: 'fl-dialog-header',
  templateUrl: './fl-dialog-header.component.html',
  styleUrls: ['./fl-dialog-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlDialogHeaderComponent {
  @Input() hideCloseButton: boolean = false;

  @Input() closeButtonData: any;
}
