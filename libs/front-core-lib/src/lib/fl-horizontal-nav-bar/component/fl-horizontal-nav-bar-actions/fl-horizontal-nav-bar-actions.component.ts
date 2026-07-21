import { ChangeDetectionStrategy,Component } from '@angular/core';

@Component({
  selector: 'fl-horizontal-nav-bar-actions',
  template: ` <ng-content></ng-content> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlHorizontalNavBarActionsComponent {}
