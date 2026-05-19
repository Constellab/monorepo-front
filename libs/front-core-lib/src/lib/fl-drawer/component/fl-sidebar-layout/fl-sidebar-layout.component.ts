import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, inject, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

/**
 * Layout component with a scrollable main content area and a right sidebar.
 * The sidebar switches to overlay mode on small screens.
 *
 * Content projection slots:
 * - default: main content (centered with max-width)
 * - sidebar: right sidebar content
 */
@Component({
  selector: 'fl-sidebar-layout',
  standalone: false,
  templateUrl: './fl-sidebar-layout.component.html',
  styleUrls: ['./fl-sidebar-layout.component.scss'],
})
export class FlSidebarLayoutComponent implements OnInit, OnDestroy {
  /**
   * Breakpoint at which the sidebar switches to overlay mode
   */
  breakpoint = input<string>('(max-width: 1280px)');

  /**
   * Whether the sidebar should be hidden when printing
   */
  hideOnPrint = input<boolean>(false);

  @ViewChild('drawer', { static: true }) drawer: MatDrawer;

  @HostBinding('class.fl-sidebar-small-screen')
  isSmallScreen = false;

  @HostBinding('class.fl-sidebar-hide-print')
  get shouldHideOnPrint(): boolean {
    return this.hideOnPrint();
  }

  private breakpointObserver = inject(BreakpointObserver);
  private subscription: Subscription;

  ngOnInit(): void {
    const bp = this.breakpoint();

    this.isSmallScreen = this.breakpointObserver.isMatched(bp);

    this.subscription = this.breakpointObserver.observe(bp).subscribe((state) => {
      this.isSmallScreen = state.matches;
    });
  }

  toggle(): void {
    this.drawer.toggle();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
