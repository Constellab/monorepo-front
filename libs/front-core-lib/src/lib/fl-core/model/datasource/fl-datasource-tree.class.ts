import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class FlTree<T> {
  id: string;
  children: FlTree<T>[];
}

export class FlDatasourceTree<T extends FlTree<T>> {
  private tree$ = new BehaviorSubject<T[]>([]);

  private readonly childrenOrder: (a: T, b: T) => number;

  constructor(data?: T[], childrenOrder?: (a: T, b: T) => number) {
    if (data) {
      this.setData(data);
    }
    this.childrenOrder = childrenOrder;
  }

  setData(data: T[]): void {
    this.tree$.next(data);
    this.sortAll();
  }

  private get tree(): T[] {
    return this.tree$.getValue();
  }

  connect(): Observable<T[]> {
    return this.tree$.asObservable();
  }

  disconnect(): void {
    this.tree$.complete();
  }

  /////////////////////////////// FIND ///////////////////////////////

  public findNode(nodeId: string): T | null {
    if (!this.tree) return null;
    return this.findNodeRecur(this.tree, nodeId);
  }

  public findNode$(nodeId: string): Observable<T | null> {
    return this.tree$.pipe(map((tree) => this.findNodeRecur(tree, nodeId)));
  }

  public findParentNode(nodeId: string): T | null {
    if (!this.tree) return null;
    return this.findParentNodeRecur(this.tree, nodeId, null);
  }

  private findNodeRecur(nodes: T[], nodeId: string): T {
    if (!nodes) return null;
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node;
      }
      const found = this.findNodeRecur(node.children as T[], nodeId);
      if (found) {
        return found;
      }
    }
    return null;
  }

  private findParentNodeRecur(nodes: T[], nodeId: string, parent: T): T {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return parent;
      }
      const found = this.findParentNodeRecur(node.children as T[], nodeId, node);
      if (found) {
        return found;
      }
    }
    return null;
  }

  //////////////////////////////////////// ADD ////////////////////////////////////////

  public addNode(node: T, parentNodeId: string): void {
    const parentNode = this.findNode(parentNodeId);
    if (!parentNode) return;

    parentNode.children.push(node);

    if (this.childrenOrder) {
      this.sortChildren(parentNode);
    }
    this.tree$.next(this.tree);
  }

  /////////////////////////////////////// UPDATE ///////////////////////////////////////

  /**
   * this method update all the fields of the node except the children
   * @param node
   */
  public updateNode(node: T): void {
    const currentNode = this.findNode(node.id);
    if (!currentNode) return;

    for (const key of Object.keys(node)) {
      if (key === 'children') continue;
      (currentNode as any)[key] = (node as any)[key];
    }

    if (this.childrenOrder) {
      const parentNode = this.findParentNode(node.id);
      if (parentNode) {
        this.sortChildren(parentNode);
      }
    }

    this.tree$.next(this.tree);
  }

  /////////////////////////////////////// DELETE ///////////////////////////////////////

  public deleteNode(nodeId: string): void {
    const parentNode = this.findParentNode(nodeId);
    if (!parentNode) return;

    parentNode.children = parentNode.children.filter((child) => child.id !== nodeId);
    this.tree$.next(this.tree);
  }

  ////////////////////////////////////// SORT /////////////////////////////////////////

  private sortChildren(node: T): void {
    if (this.childrenOrder) {
      node.children = this.sortArray(node.children as T[]);
    }
  }

  private sortAll(): void {
    if (this.tree && this.sortChildren) {
      this.sortAllRecur(this.tree);
    }
  }

  private sortArray(array: T[]): T[] {
    return array.sort(this.childrenOrder);
  }

  private sortAllRecur(nodes: T[]): void {
    nodes = this.sortArray(nodes);
    for (const node of nodes) {
      if (node.children) {
        this.sortAllRecur(node.children as T[]);
      }
    }
  }
}
