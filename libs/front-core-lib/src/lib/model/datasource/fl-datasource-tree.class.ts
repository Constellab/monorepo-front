import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export class FlTree<T> {
  id: string;
  children: FlTree<T>[];
}

export class FlDatasourceTree<T extends FlTree<T>> {

  private tree$: BehaviorSubject<T> = new BehaviorSubject<T>(null);

  private readonly childrenOrder: (a: T, b: T) => number;


  constructor(data?: T, childrenOrder?: (a: T, b: T) => number) {
    if (data) {
      this.setData(data);
    }
    this.childrenOrder = childrenOrder;
  }

  setData(data: T): void {
    this.tree$.next(data);
    this.sortAll();
  }

  private get tree(): T {
    return this.tree$.getValue();
  }

  connect(): Observable<T> {
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
    return this.tree$.pipe(
      map(tree => this.findNodeRecur(tree, nodeId))
    );
  }

  public findParentNode(nodeId: string): T | null {
    if (!this.tree) return null;
    return this.findParentNodeRecur(this.tree, nodeId);
  }

  private findNodeRecur(currentNode: T, nodeId: string): T {
    if(!currentNode) return null;
    if (currentNode.id === nodeId) {
      return currentNode;
    }
    for (const child of currentNode.children) {
      const node = this.findNodeRecur(child as T, nodeId);
      if (node != null) {
        return node;
      }
    }
    return null;
  }

  private findParentNodeRecur(currentNode: T, nodeId: string): T {
    for (const child of currentNode.children) {
      if (child.id === nodeId) {
        return currentNode;
      }
      const node = this.findParentNodeRecur(child as T, nodeId);
      if (node != null) {
        return node;
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

    parentNode.children = parentNode.children.filter(child => child.id !== nodeId);
    this.tree$.next(this.tree);
  }

  ////////////////////////////////////// SORT /////////////////////////////////////////

  private sortChildren(node: T): void {
    if (this.childrenOrder) {
      node.children = node.children.sort(this.childrenOrder);
    }
  }

  private sortAll(): void {
    if (this.tree && this.sortChildren) {
      this.sortAllRecur(this.tree);
    }
  }

  private sortAllRecur(node: T): void {
    this.sortChildren(node);
    for (const child of node.children) {
      this.sortAllRecur(child as T);
    }
  }
}
