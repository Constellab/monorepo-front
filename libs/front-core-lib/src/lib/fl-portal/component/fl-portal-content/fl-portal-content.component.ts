import { ChangeDetectionStrategy,Component } from '@angular/core';

/**
 * To use in <fl-portal> this is the scrollable content of the portal
 */
@Component({
  selector: 'fl-portal-content',
  templateUrl: './fl-portal-content.component.html',
  styleUrls: ['./fl-portal-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlPortalContentComponent {}
