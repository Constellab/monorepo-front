import { FlEntity } from '../fl-entity.class';

export class FlTree<T extends FlEntity> {
  id: string;
  object: T;
  children: FlTree<T>[] | undefined;
  parent: FlTree<T> | null;

  constructor(object: T, children?: FlTree<T>[]) {
    this.id = object.id;
    this.object = object;
    // set the children to undefined differentiate between children no loaded and children loaded but empty
    this.children = children;
    this.parent = null;
  }

  public findNodeById(id: string | null): FlTree<T> | null {
    if (this.id === id) {
      return this;
    }

    const children = this.children;
    if (!children) return null;
    for (const child of children) {
      const node = child.findNodeById(id);
      if (node) {
        return node;
      }
    }
    return null;
  }

  public findNodeObjectById(id: string): T | null {
    const node = this.findNodeById(id);
    return node ? node.object : null;
  }

  public findParentNodeById(id: string): FlTree<T> | null {
    const node = this.findNodeById(id);
    if (!node) return null;
    return node.parent;
  }

  public deleteNodeById(id: string): boolean {
    const children = this.children;
    if (!children) return false;
    const index = children.findIndex((child) => child.id === id);
    if (index > -1) {
      children.splice(index, 1);
      return true;
    } else {
      for (const child of children) {
        if (child.deleteNodeById(id)) {
          return true;
        }
      }
    }
    return false;
  }

  public getAncestors(): FlTree<T>[] {
    const ancestors: FlTree<T>[] = [];

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: FlTree<T> | null = this;
    while (node) {
      ancestors.push(node);
      node = node.parent;
    }

    return ancestors;
  }

  public addOrReplaceDirectChild(child: FlTree<T>): void {
    let children = this.children;
    if (!children) {
      children = [];
      this.children = children;
    }

    const index = children.findIndex((c) => c.id === child.id);
    if (index > -1) {
      children[index] = child;
    } else {
      children.push(child);
    }
    child.parent = this;
  }

  public updateNodeObject(object: T): boolean {
    const node = this.findNodeById(object.id);
    if (node) {
      node.object = object;
      return true;
    }
    return false;
  }

  public addOrReplaceNode(object: T, parentNodeId: string | null, initChildren: boolean = false): boolean {
    this.deleteNodeById(object.id);

    const parentNode = this.findNodeById(parentNodeId);
    if (!parentNode) return false;

    const newNode = new FlTree<T>(object, initChildren ? [] : undefined);
    parentNode.addOrReplaceDirectChild(newNode);

    return true;
  }

  public addOrReplaceObject(object: T, parentNodeId: string | null): void {
    const existingNode = this.findNodeById(object.id);
    if (existingNode) {
      this.updateNodeObject(object);
      return;
    } else {
      this.addOrReplaceNode(object, parentNodeId);
    }
  }

  public addOrReplaceNodesAndChildren(
    objects: T[],
    parentNodeId: string | null,
    getChildren: (object: T) => T[] | null
  ): void {
    for (const object of objects) {
      this.addOrReplaceNode(object, parentNodeId, true);

      const childrenNodes = getChildren(object);
      if (childrenNodes) {
        this.addOrReplaceNodesAndChildren(childrenNodes, object.id, getChildren);
      }
    }
  }

  /**
   * Refreshes the node objects and their children based on the newChildren list.
   * It deletes children that are not in the newChildren list
   * and adds or replaces objects in the newChildren list.
   */
  public refreshNodeObjectsAndChildren(
    newChildren: T[] | null,
    parentNodeId: string | null,
    getChildren: (object: T) => T[] | null
  ): void {
    if (!newChildren) return;

    // delete children that are not in the newChildren list
    const children = this.children;
    if (children) {
      const existingChildrenIds = children.map((child) => child.object.id);
      for (const childId of existingChildrenIds) {
        const newChild = newChildren.find((c) => c.id === childId);
        if (!newChild) {
          this.deleteNodeById(childId);
        }
      }
    }

    // add or replace objects in the newChildren list
    for (const object of newChildren) {
      this.addOrReplaceObject(object, parentNodeId);
      const node = this.findNodeById(object.id);
      if (!node) continue;
      const subChildren = getChildren(object);
      node.refreshNodeObjectsAndChildren(subChildren, object.id, getChildren);
    }
  }

  public hasNode(id: string): boolean {
    return this.findNodeById(id) != null;
  }

  public childrenAreLoaded(): boolean {
    return this.children != null;
  }
}
