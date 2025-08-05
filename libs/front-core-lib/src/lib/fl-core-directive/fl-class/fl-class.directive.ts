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
    const breakpoints: FlBreakpointInfo[] = [];

    if (this.flClass)
      breakpoints.push({
        breakpoints: [
          Breakpoints.XSmall,
          Breakpoints.Small,
          Breakpoints.Medium,
          Breakpoints.Large,
          Breakpoints.XLarge,
        ],
        classes: this.flClass,
      });
    if (this.flClassXs) breakpoints.push({ breakpoints: [Breakpoints.XSmall], classes: this.flClassXs });
    if (this.flClassSm) breakpoints.push({ breakpoints: [Breakpoints.Small], classes: this.flClassSm });
    if (this.flClassMd) breakpoints.push({ breakpoints: [Breakpoints.Medium], classes: this.flClassMd });
    if (this.flClassLg) breakpoints.push({ breakpoints: [Breakpoints.Large], classes: this.flClassLg });
    if (this.flClassXl) breakpoints.push({ breakpoints: [Breakpoints.XLarge], classes: this.flClassXl });
    if (this.flClassLtSm)
      breakpoints.push({
        breakpoints: [Breakpoints.XSmall, Breakpoints.Small],
        classes: this.flClassLtSm,
      });
    if (this.flClassLtMd)
      breakpoints.push({
        breakpoints: [Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium],
        classes: this.flClassLtMd,
      });
    if (this.flClassLtLg)
      breakpoints.push({
        breakpoints: [Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large],
        classes: this.flClassLtLg,
      });
    if (this.flClassLtXl)
      breakpoints.push({
        breakpoints: [
          Breakpoints.XSmall,
          Breakpoints.Small,
          Breakpoints.Medium,
          Breakpoints.Large,
          Breakpoints.XLarge,
        ],
        classes: this.flClassLtXl,
      });
    if (this.flClassGtXs)
      breakpoints.push({
        breakpoints: [Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge],
        classes: this.flClassGtXs,
      });
    if (this.flClassGtSm)
      breakpoints.push({
        breakpoints: [Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge],
        classes: this.flClassGtSm,
      });
    if (this.flClassGtMd)
      breakpoints.push({
        breakpoints: [Breakpoints.Large, Breakpoints.XLarge],
        classes: this.flClassGtMd,
      });
    if (this.flClassGtLg) breakpoints.push({ breakpoints: [Breakpoints.XLarge], classes: this.flClassGtLg });

    return breakpoints;
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
