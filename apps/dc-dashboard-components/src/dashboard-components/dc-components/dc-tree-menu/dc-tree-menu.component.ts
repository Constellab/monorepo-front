import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy,Component, effect, EventEmitter, input, Output, Signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { FlDatasourceTree, FlTree } from '@monorepo/front-core-lib/fl-core';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';

import { DcDynamicComponent } from '../../../core/model/dc-dynamic-component.class';

interface DcTreeItem {
  id: string;
  label: string;
  material_icon?: string;
  children?: DcTreeItem[];
  disabled?: boolean;
}

export interface DcTreeConfig {
  tree_items: DcTreeItem[];
  selected_item?: string;
}

export interface DcTreeItemOutput {
  item_key: string;
}

@Component({
  selector: 'dc-tree',
  imports: [MatTreeModule, MatIconModule, MatButtonModule, FlIconModule, NgClass],
  templateUrl: './dc-tree-menu.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dc-tree-menu.component.scss',
})
export class DcTreeMenuComponent implements DcDynamicComponent<DcTreeConfig, DcTreeItemOutput> {
  inputData = input.required<DcTreeConfig>();
  @Output() outputEvent: EventEmitter<DcTreeItemOutput> = new EventEmitter();

  tree: FlDatasourceTree<DcTreeItem> = new FlDatasourceTree<DcTreeItem>();

  matTreeObj: Signal<MatTree<FlTree<DcTreeItem>>> = viewChild.required(MatTree);

  selectedObjectAndParent: FlTree<DcTreeItem>[] = [];

  private initialized = false;

  constructor() {
    effect(() => {
      if (this.initialized) {
        this.tree.refreshNodeObjectsAndChildren(
          this.inputData().tree_items,
          (object: DcTreeItem) => object.children
        );
        this.onNodeSelectedByKey(this.inputData().selected_item);
      } else {
        this.tree.setData(this.inputData().tree_items, (object: DcTreeItem) => object.children);
      }
      setTimeout(() => this.onNodeSelectedByKey(this.inputData().selected_item), 0);

      this.initialized = true;
    });
  }

  private onNodeSelectedByKey(key: string): void {
    if (!key) {
      this.onNodeSelected(null);
      return;
    }
    const node = this.tree.findNode(key);
    if (node) {
      this.onNodeSelected(node);
    } else {
      console.warn(`Node with key ${key} not found.`);
    }
  }

  private onNodeSelected(node: FlTree<DcTreeItem>): void {
    this.selectedObjectAndParent = [];

    if (node) {
      let currentNode: FlTree<DcTreeItem> | null = node;
      while (currentNode) {
        this.selectedObjectAndParent.unshift(currentNode);
        this.matTreeObj().expand(currentNode);
        currentNode = currentNode.parent;
      }
    }
  }

  onItemClick(node: FlTree<DcTreeItem>): void {
    if (node.object.disabled) return;
    this.onNodeSelected(node);
    this.outputEvent.emit({
      item_key: node.object.id,
    });
  }

  isSelected(node: FlTree<DcTreeItem>): boolean {
    return this.selectedObjectAndParent.find((n) => n.id === node.id) != null;
  }
}
