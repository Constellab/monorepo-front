import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  FlMenuDynamic,
  FlMenuDynamicModule,
  FlMenuDynamicService,
} from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';

import { DcComponentData, DcDynamicComponent } from '../../../core/model/dc-dynamic-component.class';

interface DcMenuButtonItem {
  key: string;
  label: string;
  material_icon?: string;
  disabled?: boolean;
  children?: DcMenuButtonItem[];
  divider?: boolean;
  color?: 'primary' | 'accent' | 'warn';
  has_handler: boolean;
}

export interface DcMenuConfig {
  icon: string;
  disabled?: boolean;
  menu_items: DcMenuButtonItem[];
}

interface DcMenuItemOutput {
  button_key: string;
  timestamp: number;
}

/**
 * Menu component that displays a menu with buttons and icons.
 */
@Component({
  selector: 'dc-menu',
  imports: [FlMenuDynamicModule, MatIconButton, MatIcon, FlIconModule],
  templateUrl: './dc-menu.component.html',
  styleUrl: './dc-menu.component.scss',
})
export class DcMenuComponent implements DcDynamicComponent<DcMenuConfig, DcMenuItemOutput> {
  private dynamicMenuService = inject(FlMenuDynamicService);

  @Input() inputData: DcComponentData<DcMenuConfig>;
  @Output() outputEvent: EventEmitter<DcMenuItemOutput> = new EventEmitter();

  openMenu(event: MouseEvent): void {
    const menuItems = this.inputData.component_data.menu_items.map((item) =>
      this.dcMenuItemToDynamicMenu(item)
    );
    this.dynamicMenuService.openDynamicMenuFromMouseEvent(menuItems, event);
  }

  private dcMenuItemToDynamicMenu(menuItem: DcMenuButtonItem): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: menuItem.label, translateText: false },
      icon: menuItem.material_icon,
      disabled: menuItem.disabled,
      children: menuItem.children
        ? menuItem.children.map((item) => this.dcMenuItemToDynamicMenu(item))
        : undefined,
      divider: menuItem.divider,
      color: menuItem.color,
      onClick: menuItem.has_handler ? () => this.emitButtonEvent(menuItem.key) : undefined,
    };
  }

  private emitButtonEvent(id: string): void {
    this.outputEvent.emit({ button_key: id, timestamp: Date.now() });
  }
}
