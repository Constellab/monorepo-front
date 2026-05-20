import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger, MenuPositionX, MenuPositionY } from '@angular/material/menu';
import { FlThemeHelper } from '@monorepo/front-core-lib/fl-theme';
import { combineLatest, map, Observable, of, startWith } from 'rxjs';

import { FlMenuDynamic, FlMenuDynamicButton, FlMenuDynamicInput } from '../../model/fl-menu-dynamic.class';

@Component({
  selector: 'fl-menu-dynamic',
  templateUrl: './fl-menu-dynamic.component.html',
  styleUrls: ['./fl-menu-dynamic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FlMenuDynamicComponent {
  public static readonly containerClass = 'fl-dynamic-menu';

  @Input() set menuItems(menuItems: FlMenuDynamicInput | FlMenuDynamic[] | Observable<FlMenuDynamic[]>) {
    if (menuItems instanceof Observable) {
      // Legacy: full Observable<FlMenuDynamic[]>
      this.menuItems$ = menuItems;
    } else if (!Array.isArray(menuItems)) {
      this.menuItems$ = of([]);
    } else if (menuItems.some((item) => item instanceof Observable)) {
      // New: mixed array with Observable slots
      const sources = menuItems.map((item) =>
        item instanceof Observable ? item.pipe(startWith(null)) : of(item)
      );
      this.menuItems$ = combineLatest(sources).pipe(
        map((items) => items.filter((item): item is FlMenuDynamic => item != null))
      );
    } else {
      this.menuItems$ = of(menuItems as FlMenuDynamic[]);
    }
  }

  @Input() hasBackdrop: boolean = true;

  @Input() xPosition: MenuPositionX = 'after';

  @Input() yPosition: MenuPositionY = 'below';

  // use to access the MatMenu from outside
  // use the [matMenuTriggerFor]="menuComponent.menu" with this value to open the menu
  @ViewChild(MatMenu, { static: true }) public menu: MatMenu;

  @ViewChild(MatMenuTrigger, { static: false }) menuTrigger: MatMenuTrigger;

  @Output() buttonClick: EventEmitter<FlMenuDynamic> = new EventEmitter();

  menuItems$: Observable<FlMenuDynamic[]>;

  containerClass = FlMenuDynamicComponent.containerClass;

  callItem(menuItem: FlMenuDynamicButton, event: MouseEvent): void {
    if (menuItem.onClick) {
      menuItem.onClick(event);
      this.buttonClick.next(menuItem);
    }
  }

  getTextClass(menuItem: FlMenuDynamic): string {
    if (!menuItem.color) return null;
    return FlThemeHelper.paletteToTextCssClass(menuItem.color);
  }
}
