import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject,Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, startWith } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { FlHorizontalNavBarItem } from '../../fl-horizontal-nav-bar.class';

/**
 * Horizontal navigation bar that takes full width of the screen
 * It is responsive and will collapse on small screen
 */
@Component({
  selector: 'fl-horizontal-nav-bar',
  templateUrl: './fl-horizontal-nav-bar.component.html',
  styleUrls: ['./fl-horizontal-nav-bar.component.scss'],
  standalone: false,
})
export class FlHorizontalNavBarComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);

  @Input() items: FlHorizontalNavBarItem[];

  @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;

  private smallScreenMatches = [Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium];

  showSmallMenu$: Observable<boolean> = this.breakpointObserver
    .observe(this.smallScreenMatches)
    .pipe(map((state) => state.matches));

  activeItem$: Observable<FlHorizontalNavBarItem> = this.router.events.pipe(
    startWith(null),
    filter((event) => event == null || event instanceof NavigationEnd),
    map(() => this.getActiveItem())
  );

  openMenu(): void {
    this.trigger.openMenu();
  }

  private getActiveItem(): FlHorizontalNavBarItem {
    for (const item of this.items) {
      if (
        item.route &&
        this.router.isActive(item.route, {
          paths: item.linkActiveExact ? 'exact' : 'subset',
          fragment: 'ignored',
          matrixParams: 'ignored',
          queryParams: 'ignored',
        })
      ) {
        return item;
      }
    }
    return null;
  }
}
