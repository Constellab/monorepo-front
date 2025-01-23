import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FlMenuDynamic, FlMenuDynamicButton } from '../../model/fl-menu-dynamic.class';
import { MatMenu, MatMenuTrigger, MenuPositionX, MenuPositionY } from '@angular/material/menu';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'fl-menu-dynamic',
  templateUrl: './fl-menu-dynamic.component.html',
  styleUrls: ['./fl-menu-dynamic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FlMenuDynamicComponent {
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
  @ViewChild(MatMenu, { static: true }) public menu: MatMenu;

  @ViewChild(MatMenuTrigger, { static: false }) menuTrigger: MatMenuTrigger;

  @Output() buttonClick: EventEmitter<FlMenuDynamic> = new EventEmitter();

  containerClass = FlMenuDynamicComponent.containerClass;

  menuItems$: Observable<FlMenuDynamic[]>;

  callItem(menuItem: FlMenuDynamicButton, event: MouseEvent): void {
    if (menuItem.onClick) {
      menuItem.onClick(event);
      this.buttonClick.next(menuItem);
    }
  }

  onButtonClick(menuItem: FlMenuDynamic): void {
    this.buttonClick.next(menuItem);
  }
}
