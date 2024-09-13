import { Component, computed, inject, Signal } from '@angular/core';
import { CaChatState } from '../ca-chat.state';
import { CaHierarchyObjectType, CaHierarchyObjectWithChildren } from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { FlFlatTreeControl } from '@monorepo/front-core-lib';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';

interface CaFolderFlatNode {
  id: string;
  name: string;
  level: number;
  expandable: boolean;
  isSelected: boolean;
  objectType: CaHierarchyObjectType;
  route: string;
}

// TODO a fusionner avec l'uatre folder tree
@Component({
  selector: 'ca-chat-folder-tree',
  templateUrl: './ca-chat-folder-tree.component.html',
  styleUrl: './ca-chat-folder-tree.component.scss'
})
export class CaChatFolderTreeComponent {

  state = inject(CaChatState);

  treeControl: FlFlatTreeControl<CaFolderFlatNode, string> = new FlFlatTreeControl<CaFolderFlatNode, string>(
    node => node.level, node => node.expandable, {
      trackBy: node => node.id
    });

  dataSource: Signal<MatTreeFlatDataSource<CaHierarchyObjectWithChildren, CaFolderFlatNode>>
    = computed(() => this.constructTreeDatasource(this.state.folders()));


  hasChild = (_: number, node: CaFolderFlatNode): boolean => node.expandable;

  private constructTreeDatasource(hierarchyObjects: CaHierarchyObjectWithChildren[]): MatTreeFlatDataSource<CaHierarchyObjectWithChildren, CaFolderFlatNode> {
    const _transformer = (node: CaHierarchyObjectWithChildren, level: number): CaFolderFlatNode => {
      return {
        id: node.id,
        expandable: !!node.children && node.children.length > 0,
        level: level,
        name: node.name,
        isSelected: false,
        objectType: node.objectType,
        route: CaRouterService.getChatFolderRoute(node.id)
      };
    };

    // object to flatten tree
    const treeFlattener: MatTreeFlattener<CaHierarchyObjectWithChildren, CaFolderFlatNode, string> = new MatTreeFlattener(
      _transformer, node => node.level, node => node.expandable,
      node => node.children);

    // create the datasource and set data
    return new MatTreeFlatDataSource(this.treeControl, treeFlattener, hierarchyObjects);
  }

}
