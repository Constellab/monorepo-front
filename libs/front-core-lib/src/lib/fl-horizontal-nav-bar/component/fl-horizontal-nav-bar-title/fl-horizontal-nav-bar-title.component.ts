import { ChangeDetectionStrategy,Component } from '@angular/core';

@Component({
  selector: 'fl-horizontal-nav-bar-title',
  template: ` <ng-content></ng-content> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlHorizontalNavBarTitleComponent {}
