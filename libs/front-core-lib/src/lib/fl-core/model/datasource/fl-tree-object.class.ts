import { FlEntity } from '../fl-entity.class';

export class FlTree<T extends FlEntity> {
  id: string;
  object: T;
  children: FlTree<T>[];
  parent: FlTree<T> | null;

  constructor(object: T, children?: FlTree<T>[]) {
    this.id = object.id;
    this.object = object;
    // set the children to undefined differentiate between children no loaded and children loaded but empty
    this.children = children;
    this.parent = null;
  }

  public findNodeById(id: string): FlTree<T> | null {
    if (this.id === id) {
      return this;
    }

    if (this.children == null) return null;
    for (const child of this.children) {
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
    if (this.children == null) return false;
    const index = this.children.findIndex((child) => child.id === id);
    if (index > -1) {
      this.children.splice(index, 1);
      return true;
    } else {
      for (const child of this.children) {
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
    let node: FlTree<T> = this;
    while (node) {
      ancestors.push(node);
      node = node.parent;
    }

    return ancestors;
  }

  public addOrReplaceDirectChild(child: FlTree<T>): void {
    if (this.children == null) {
      this.children = [];
    }

    const index = this.children.findIndex((c) => c.id === child.id);
    if (index > -1) {
      this.children[index] = child;
    } else {
      this.children.push(child);
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

  public addOrReplaceNode(node: T, parentNodeId: string): boolean {
    this.deleteNodeById(node.id);

    const parentNode = this.findNodeById(parentNodeId);
    if (!parentNode) return false;

    const newNode = new FlTree<T>(node);
    parentNode.addOrReplaceDirectChild(newNode);

    return true;
  }

  public addOrReplaceObject(node: T, parentNodeId: string): void {
    const existingNode = this.findNodeById(node.id);
    if (existingNode) {
      this.updateNodeObject(node);
      return;
    } else {
      this.addOrReplaceNode(node, parentNodeId);
    }
  }

  public hasNode(id: string): boolean {
    return this.findNodeById(id) != null;
  }
}
