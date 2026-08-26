import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, HostBinding, Input, OnInit } from '@angular/core';

/**
 * Directive similar to fxHide from flex-layout to hide element based on media query
 */
@Directive({
  selector:
    '[flHide], [flHide.xs], [flHide.sm], [flHide.md], [flHide.lg], [flHide.xl] ' +
    '[flHide.lt-sm], [flHide.lt-md], [flHide.lt-lg], [flHide.lt-xl], ' +
    '[flHide.gt-xs], [flHide.gt-sm], [flHide.gt-md], [flHide.gt-lg],' +
    '[flHide.print]',
  standalone: false,
})
export class FlHideDirective implements OnInit {
  @HostBinding('class')
  hideClass: string | null = null;

  @Input() flHide: any;
  @Input('flHide.xs') flHideXs: any;
  @Input('flHide.sm') flHideSm: any;
  @Input('flHide.md') flHideMd: any;
  @Input('flHide.lg') flHideLg: any;
  @Input('flHide.xl') flHideXl: any;
  @Input('flHide.lt-sm') flHideLtSm: any;
  @Input('flHide.lt-md') flHideLtMd: any;
  @Input('flHide.lt-lg') flHideLtLg: any;
  @Input('flHide.lt-xl') flHideLtXl: any;
  @Input('flHide.gt-xs') flHideGtXs: any;
  @Input('flHide.gt-sm') flHideGtSm: any;
  @Input('flHide.gt-md') flHideGtMd: any;
  @Input('flHide.gt-lg') flHideGtLg: any;
  @Input('flHide.print') flHidePrint: any;

  ngOnInit(): void {
    // input value -> class to apply, the first truthy input wins
    const inputs: [any, string][] = [
      [this.flHide, 'g-hide'],
      // Exact
      [this.flHideXs, 'g-hide-xs'],
      [this.flHideSm, 'g-hide-sm'],
      [this.flHideMd, 'g-hide-md'],
      [this.flHideLg, 'g-hide-lg'],
      [this.flHideXl, 'g-hide-xl'],
      // Less than
      [this.flHideLtSm, 'g-hide-lt-sm'],
      [this.flHideLtMd, 'g-hide-lt-md'],
      [this.flHideLtLg, 'g-hide-lt-lg'],
      [this.flHideLtXl, 'g-hide-lt-xl'],
      // Greater than
      [this.flHideGtXs, 'g-hide-gt-xs'],
      [this.flHideGtSm, 'g-hide-gt-sm'],
      [this.flHideGtMd, 'g-hide-gt-md'],
      [this.flHideGtLg, 'g-hide-gt-lg'],
      [this.flHidePrint, 'g-print-hide'],
    ];

    const match = inputs.find(([value]) => coerceBooleanProperty(value));
    this.hideClass = match ? match[1] : null;
  }
}
