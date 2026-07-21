import { ChangeDetectionStrategy,Component, signal } from '@angular/core';

import {
  DcTreeConfig,
  DcTreeMenuComponent,
} from '../../../../dc-components/dc-tree-menu/dc-tree-menu.component';

@Component({
  selector: 'dc-tree-dev',
  imports: [DcTreeMenuComponent],
  templateUrl: './dc-tree-dev.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: '../dc-dev-examples.scss',
})
export class DcTreeDevComponent {
  treeConfig = signal<DcTreeConfig>({
    tree_items: [
      {
        id: 'root',
        label: 'Root',
        material_icon: 'folder',
        children: [
          {
            id: 'child1',
            label: 'Child 1',
            material_icon: 'folder',
            children: [
              { id: 'grandchild1', label: 'Grandchild 1', material_icon: 'description' },
              {
                id: 'grandchild2',
                label: 'Grandchild 2',
                material_icon: 'description',
              },
            ],
          },
          { id: 'child2', label: 'Disabled child 2', material_icon: 'description', disabled: true },
        ],
      },
    ],
  });

  onTreeOutput(data: any): void {
    console.log('Tree output:', data);
  }
}
