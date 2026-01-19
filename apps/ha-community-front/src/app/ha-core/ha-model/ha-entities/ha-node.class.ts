import { FlDatasourceTree, FlEntity } from '@monorepo/front-core-lib/fl-core';
import { Type } from 'class-transformer';

import { HaBaseEntity, HaEntity } from './ha-entity.class';

export class HaNodeObjectsTreeDatasource extends FlDatasourceTree<HaNode> {
  constructor() {
    super((a, b) => a.order - b.order);
  }

  addNodeObjects(objects: HaNode[]): void {
    for (const object of objects) {
      this.tree.addOrReplaceObject(object, object.parentId);
    }

    this.sortAndEmits();
  }

  addNodeObjectsWithChildren(objects: HaNode[]): void {
    this.addNodeObjectsWithChildrenRecur(objects);
    this.sortAndEmits();
  }

  public updateNodeLocation(node: HaNode, oldParentId: string, newParentId: string): void {
    this.tree.updateNodeObject(node);
    if (oldParentId != newParentId) {
      this.moveNode(node.id, oldParentId, newParentId);
    } else {
      this.sortAndEmits();
    }
  }

  private moveNode(nodeId: string, oldParentId: string, newParentId: string): void {
    const node = this.tree.findNodeById(nodeId);
    if (!node) return null;

    const oldParent = this.tree.findNodeById(oldParentId);
    const newParent = this.tree.findNodeById(newParentId);
    if (!oldParent || !newParent) return null;

    oldParent.deleteNodeById(nodeId);
    if (oldParent.object.children) {
      oldParent.object.children = oldParent.object.children.filter((child) => child.id !== nodeId);
      this.tree.updateNodeObject(oldParent.object);
    }

    this.sortAndEmits();

    setTimeout(() => {
      this.addOrReplaceNode([node.object], newParentId);
      this.sortAndEmits();
    }, 10);
  }

  private addNodeObjectsWithChildrenRecur(objects: HaNode[]): void {
    for (const object of objects) {
      this.tree.addOrReplaceObject(object, object.parentId);

      if (object.children) {
        this.addNodeObjectsWithChildrenRecur(object.children);
      }
    }
    console.log(this.tree.children);
  }
}

export class HaNode extends HaBaseEntity {
  path: string;

  completePath: string;

  name: string;

  order: number;

  @Type(() => HaNode)
  children?: HaNode[];

  parentId: string;

  isExpanded = false;

  constructor(
    id: string,
    path: string,
    completePath: string,
    name: string,
    order: number,
    parentId: string,
    children?: HaNode[]
  ) {
    super();
    this.id = id;
    this.path = path;
    this.completePath = completePath;
    this.name = name;
    this.order = order;
    this.parentId = parentId;
    if (children) {
      this.children = children;
    }
  }
}

export class HaNodeDTO extends HaEntity {
  title: string;
  path: string;
  folderId?: string;
  isFolder?: boolean;
  type: HaNodeType;
}

export enum HaNodeType {
  DOC = 'DOC',
  FOL = 'FOL',
  TEC = 'TEC',
}

export class EntityWithPotentialsChildren<T> implements FlEntity {
  id: string;
  children?: T[];
}
