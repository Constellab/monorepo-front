import {Component, Input, ViewChild} from '@angular/core';
import {FlHorizontalNavBarItem} from '../../fl-horizontal-nav-bar.class';
import {MediaObserver} from '@angular/flex-layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FlMediaAlias} from '../../../../model/fl-media-alias.class';
import {MatMenuTrigger} from '@angular/material/menu';

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

  showSmallMenu$: Observable<boolean> = this.media.asObservable().pipe(
    map(() => this.showSmallMenu())
  );


  constructor(private media: MediaObserver) {
  }

  showSmallMenu(): boolean {
    return this.media.isActive('lt-lg' as FlMediaAlias);
  }

  openMenu(): void {
    if (this.showSmallMenu() && this.trigger) {
      this.trigger.openMenu();
    }
  }


}
