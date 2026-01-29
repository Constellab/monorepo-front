import { Component, signal } from '@angular/core';

import { DcMenuComponent, DcMenuConfig } from '../../../../dc-components/dc-menu/dc-menu.component';

@Component({
  selector: 'dc-menu-dev',
  imports: [DcMenuComponent],
  templateUrl: './dc-menu-dev.component.html',
  styleUrl: '../dc-dev-examples.scss',
})
export class DcMenuDevComponent {
  menuConfig = signal<DcMenuConfig>({
    icon: 'more_vert',
    menu_items: [
      {
        key: 'item1',
        label: 'Item 1',
        material_icon: 'check',
        has_handler: true,
        children: [{ key: 'subitem1', label: 'Subitem 1', material_icon: 'check', has_handler: true }],
      },
      { key: 'item2', label: 'Item 2', material_icon: 'close', has_handler: false },
    ],
  });

  onMenuOutput(data: any): void {
    console.log('Menu output:', data);
  }
}
