import { Directive, HostBinding, Input, OnInit } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

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
  hideClass: string = null;

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
    if (coerceBooleanProperty(this.flHide)) {
      this.hideClass = 'g-hide';
      // Exact
    } else if (coerceBooleanProperty(this.flHideXs)) {
      this.hideClass = 'g-hide-xs';
    } else if (coerceBooleanProperty(this.flHideSm)) {
      this.hideClass = 'g-hide-sm';
    } else if (coerceBooleanProperty(this.flHideMd)) {
      this.hideClass = 'g-hide-md';
    } else if (coerceBooleanProperty(this.flHideLg)) {
      this.hideClass = 'g-hide-lg';
    } else if (coerceBooleanProperty(this.flHideXl)) {
      this.hideClass = 'g-hide-xl';
      // Less than
    } else if (coerceBooleanProperty(this.flHideLtSm)) {
      this.hideClass = 'g-hide-lt-sm';
    } else if (coerceBooleanProperty(this.flHideLtMd)) {
      this.hideClass = 'g-hide-lt-md';
    } else if (coerceBooleanProperty(this.flHideLtLg)) {
      this.hideClass = 'g-hide-lt-lg';
    } else if (coerceBooleanProperty(this.flHideLtXl)) {
      this.hideClass = 'g-hide-lt-xl';
      // Greater than
    } else if (coerceBooleanProperty(this.flHideGtXs)) {
      this.hideClass = 'g-hide-gt-xs';
    } else if (coerceBooleanProperty(this.flHideGtSm)) {
      this.hideClass = 'g-hide-gt-sm';
    } else if (coerceBooleanProperty(this.flHideGtMd)) {
      this.hideClass = 'g-hide-gt-md';
    } else if (coerceBooleanProperty(this.flHideGtLg)) {
      this.hideClass = 'g-hide-gt-lg';
    } else if (coerceBooleanProperty(this.flHidePrint)) {
      this.hideClass = 'g-print-hide';
    }
  }
}
