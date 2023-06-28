import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatDrawer, MatDrawerMode} from '@angular/material/sidenav';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';

/**
 * Directive that work on mat-drawer and mat-sidenav to change the mode base on screen size.
 * When the input media is active, it switched the mode to over
 *
 * This is useful to make the drawer over on small screen
 */
@Directive({
  selector: '[flDrawerOver]'
})
export class FlDrawerOverDirective implements OnInit, OnDestroy {

  /**
   * When the media alias is active, the drawer mode switched to over
   * String from Breakpoint
   */
  @Input() flDrawerOver: string[];

  /**
   * If true, on init this will close the drawer if the mode is over. And this will
   * open the drawer in other modes
   */
  @Input() flDrawerCloseOverOnInit: boolean = true;


  private subscription: Subscription;

  private initialMode: MatDrawerMode;

  constructor(private breakpointObserver: BreakpointObserver,
              private matDrawer: MatDrawer) {
  }

  ngOnInit(): void {
    this.initialMode = this.matDrawer.mode;

    this.subscription = this.breakpointObserver.observe(this.flDrawerOver).subscribe(
      (state) => this.onMediaChange(state)
    );

    // if the option is active, open the drawer only if over is not active
    if (this.flDrawerCloseOverOnInit) {
      this.matDrawer.opened = !this.breakpointObserver.isMatched(this.flDrawerOver);
    }
  }

  private onMediaChange(state: BreakpointState): void {
    if (state.matches) {
      this.matDrawer.mode = 'over';
    } else {
      this.matDrawer.mode = this.initialMode;
    }
  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
