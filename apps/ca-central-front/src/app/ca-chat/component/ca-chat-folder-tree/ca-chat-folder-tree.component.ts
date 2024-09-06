import { Component, computed, inject, Signal } from '@angular/core';
import { CaChatState } from '../ca-chat.state';
import { CaFolderObjectType, CaFolderWithChildren } from '../../../ca-core/model/entities/project/ca-folder.class';
import { FlFlatTreeControl } from '@monorepo/front-core-lib';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';

interface CaProjectFlatNode {
  id: string;
  name: string;
  level: number;
  expandable: boolean;
  isSelected: boolean;
  objectType: CaFolderObjectType;
  route: string;
}

// TODO a fusionner avec l'uatre project tree
@Component({
  selector: 'ca-chat-folder-tree',
  templateUrl: './ca-chat-folder-tree.component.html',
  styleUrl: './ca-chat-folder-tree.component.scss'
})
export class CaChatFolderTreeComponent {

  state = inject(CaChatState);

  treeControl: FlFlatTreeControl<CaProjectFlatNode, string> = new FlFlatTreeControl<CaProjectFlatNode, string>(
    node => node.level, node => node.expandable, {
      trackBy: node => node.id
    });

  dataSource: Signal<MatTreeFlatDataSource<CaFolderWithChildren, CaProjectFlatNode>>
    = computed(() => this.constructTreeDatasource(this.state.folders()));


  hasChild = (_: number, node: CaProjectFlatNode): boolean => node.expandable;

  private constructTreeDatasource(projects: CaFolderWithChildren[]): MatTreeFlatDataSource<CaFolderWithChildren, CaProjectFlatNode> {
    const _transformer = (node: CaFolderWithChildren, level: number): CaProjectFlatNode => {
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
    const treeFlattener: MatTreeFlattener<CaFolderWithChildren, CaProjectFlatNode, string> = new MatTreeFlattener(
      _transformer, node => node.level, node => node.expandable,
      node => node.children);

    // create the datasource and set data
    return new MatTreeFlatDataSource(this.treeControl, treeFlattener, projects);
  }

}
