import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FlMenuDynamic, FlMenuDynamicButton} from '../../model/fl-menu-dynamic.class';
import {MatMenu, MatMenuTrigger, MenuPositionX, MenuPositionY} from '@angular/material/menu';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'fl-menu-dynamic',
  templateUrl: './fl-menu-dynamic.component.html',
  styleUrls: ['./fl-menu-dynamic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlMenuDynamicComponent implements OnInit {

  public static readonly containerClass = 'fl-dynamic-menu';

  @Input() set menuItems(menuItems: FlMenuDynamic[] | Observable<FlMenuDynamic[]>) {
    if (menuItems instanceof Observable) {
      this.menuItems$ = menuItems;
    } else {
      this.menuItems$ = of(menuItems);
    }
  }

  @Input() hasBackdrop: boolean = true;

  @Input() xPosition: MenuPositionX = 'after';

  @Input() yPosition: MenuPositionY = 'below';

  // use to access the MatMenu from outside
  // use the [matMenuTriggerFor]="menuComponent.menu" with this value to open the menu
  @ViewChild(MatMenu, {static: true}) public menu: MatMenu;

  @ViewChild(MatMenuTrigger, {static: false}) menuTrigger: MatMenuTrigger;

  containerClass = FlMenuDynamicComponent.containerClass;

  menuItems$: Observable<FlMenuDynamic[]>;

  constructor() {
  }

  ngOnInit(): void {
  }

  callItem(menuItem: FlMenuDynamicButton, event: MouseEvent): void {
    if (menuItem.onClick) {
      menuItem.onClick(event);
    }
  }
}
