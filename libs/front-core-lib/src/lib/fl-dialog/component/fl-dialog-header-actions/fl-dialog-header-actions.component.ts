import { Component } from '@angular/core';

/**
 * Show html along with a close button
 * /!\ Only works if the close button is shown
 * /!\ Can shift the title to the left
 */
@Component({
  selector: 'fl-dialog-header-actions',
  templateUrl: './fl-dialog-header-actions.component.html',
  styleUrls: ['./fl-dialog-header-actions.component.scss'],
  standalone: false,
})
export class FlDialogHeaderActionsComponent {}
