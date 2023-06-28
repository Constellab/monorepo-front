import {Component, Input, ViewChild} from '@angular/core';
import {FlHorizontalNavBarItem} from '../../fl-horizontal-nav-bar.class';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatMenuTrigger} from '@angular/material/menu';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

/**
 * Horizontal navigation bar that takes full width of the screen
 * It is responsive and will collapse on small screen
 */
@Component({
  selector: 'fl-horizontal-nav-bar',
  templateUrl: './fl-horizontal-nav-bar.component.html',
  styleUrls: ['./fl-horizontal-nav-bar.component.scss'],
})
export class FlHorizontalNavBarComponent {

  @Input() items: FlHorizontalNavBarItem[];

  @ViewChild(MatMenuTrigger, {static: false}) trigger: MatMenuTrigger;

  private smallScreenMatches = [Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium];

  showSmallMenu$: Observable<boolean> = this.breakpointObserver.observe(this.smallScreenMatches).pipe(
    map((state) => state.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  openMenu(): void {
    if (this.breakpointObserver.isMatched(this.smallScreenMatches) && this.trigger) {
      this.trigger.openMenu();
    }
  }


}
