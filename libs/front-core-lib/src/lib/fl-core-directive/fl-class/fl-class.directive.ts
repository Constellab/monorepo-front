import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Directive, HostBinding, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

interface FlBreakpointInfo {
  breakpoints: string[];
  classes: string[] | string;
}

/**
 * Directive similar to ngClass, it adds classes based on the screen size
 */
@Directive({
  selector:
    '[flClass], [flClass.xs], [flClass.sm], [flClass.md], [flClass.lg], [flClass.xl] ' +
    '[flClass.lt-sm], [flClass.lt-md], [flClass.lt-lg], [flClass.lt-xl], ' +
    '[flClass.gt-xs], [flClass.gt-sm], [flClass.gt-md], [flClass.gt-lg]',
  standalone: false,
})
export class FlClassDirective implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);

  @HostBinding('class') elementClass: string[];

  @Input() flClass: string | string[];
  @Input('flClass.xs') flClassXs: string | string[];
  @Input('flClass.sm') flClassSm: string | string[];
  @Input('flClass.md') flClassMd: string | string[];
  @Input('flClass.lg') flClassLg: string | string[];
  @Input('flClass.xl') flClassXl: string | string[];
  @Input('flClass.lt-sm') flClassLtSm: string | string[];
  @Input('flClass.lt-md') flClassLtMd: string | string[];
  @Input('flClass.lt-lg') flClassLtLg: string | string[];
  @Input('flClass.lt-xl') flClassLtXl: string | string[];
  @Input('flClass.gt-xs') flClassGtXs: string | string[];
  @Input('flClass.gt-sm') flClassGtSm: string | string[];
  @Input('flClass.gt-md') flClassGtMd: string | string[];
  @Input('flClass.gt-lg') flClassGtLg: string | string[];

  private subscription: Subscription;

  ngOnInit(): void {
    // subscript for all the breakpoints
    this.subscription = this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe(() => this.onMediaChange());
  }

  private onMediaChange(): void {
    // read the input breakpoints and classes
    const breakpoints = this.getInputBreakpointsAndClasses();

    const elementClasses: string[] = [];

    // for each breakpoint, check if the breakpoint is active and add the classes
    for (const breakpoint of breakpoints) {
      if (this.breakpointObserver.isMatched(breakpoint.breakpoints)) {
        elementClasses.push(...this.convertClass(breakpoint.classes));
      }
    }
    this.elementClass = elementClasses;
  }

  /**
   * Method to return the breakpoints and classes based on the input
   * @private
   */
  private getInputBreakpointsAndClasses(): FlBreakpointInfo[] {
    const { XSmall, Small, Medium, Large, XLarge } = Breakpoints;

    // input value -> breakpoints it applies to, in declaration order
    const inputs: [string | string[], string[]][] = [
      [this.flClass, [XSmall, Small, Medium, Large, XLarge]],
      [this.flClassXs, [XSmall]],
      [this.flClassSm, [Small]],
      [this.flClassMd, [Medium]],
      [this.flClassLg, [Large]],
      [this.flClassXl, [XLarge]],
      [this.flClassLtSm, [XSmall, Small]],
      [this.flClassLtMd, [XSmall, Small, Medium]],
      [this.flClassLtLg, [XSmall, Small, Medium, Large]],
      [this.flClassLtXl, [XSmall, Small, Medium, Large, XLarge]],
      [this.flClassGtXs, [Small, Medium, Large, XLarge]],
      [this.flClassGtSm, [Medium, Large, XLarge]],
      [this.flClassGtMd, [Large, XLarge]],
      [this.flClassGtLg, [XLarge]],
    ];

    return inputs
      .filter(([classes]) => Boolean(classes))
      .map(([classes, breakpoints]) => ({ breakpoints, classes }));
  }

  private convertClass(classes: string | string[]): string[] {
    if (typeof classes === 'string') {
      return classes.split(' ');
    } else {
      return classes;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
