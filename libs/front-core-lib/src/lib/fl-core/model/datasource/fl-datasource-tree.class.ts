import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClHelpService } from '@monorepo/core-lib';
import { FlTree } from './fl-tree-object.class';
import { FlEntity } from '../fl-entity.class';
import { MatTree } from '@angular/material/tree';

export class FlDatasourceTree<T extends FlEntity> {
  private tree$ = new BehaviorSubject<FlTree<T>>(new FlTree<T>({ id: null } as T, []));

  private readonly childrenOrder?: (a: T, b: T) => number;

  constructor(childrenOrder?: (a: T, b: T) => number) {
    this.childrenOrder = childrenOrder;
  }

  protected get tree(): FlTree<T> {
    return this.tree$.getValue();
  }

  connect(): Observable<FlTree<T>[]> {
    return this.tree$.asObservable().pipe(map((tree) => tree.children));
  }

  connectRoot(): Observable<FlTree<T>> {
    return this.tree$.asObservable();
  }

  disconnect(): void {
    this.tree$.complete();
  }

  /////////////////////////////// FIND ///////////////////////////////

  public findNodeObject(nodeId: string): T | null {
    return this.tree.findNodeObjectById(nodeId);
  }

  public findNode(nodeId: string): FlTree<T> | null {
    return this.tree.findNodeById(nodeId);
  }

  public findNodeObject$(nodeId: string): Observable<T | null> {
    return this.tree$.pipe(map((tree) => tree.findNodeObjectById(nodeId)));
  }

  public findAncestorsNode$(nodeId: string): Observable<FlTree<T>[]> {
    return this.tree$.pipe(
      map((tree) => {
        const node = tree.findNodeById(nodeId);
        if (!node) return [];
        // remove the fake root
        return node.getAncestors().filter((node) => node.id !== null);
      })
    );
  }

  public findAncestorsObject$(nodeId: string): Observable<T[]> {
    return this.tree$.pipe(
      map((tree) => {
        const node = tree.findNodeById(nodeId);
        if (!node) return [];
        const ancestors = node.getAncestors().map((node) => node.object);
        // remove the fake root
        return ancestors.filter((node) => node.id !== null);
      })
    );
  }

  //////////////////////////////////////// ADD ////////////////////////////////////////

  public addOrReplaceNode(node: T | T[], parentNodeId: string): void {
    const nodes: T[] = ClHelpService.convertObjectOrArrayToArray(node);
    for (const node of nodes) {
      this.tree.addOrReplaceNode(node, parentNodeId);
    }

    this.sortAndEmits();
  }

  public addOrReplaceObject(node: T | T[], parentNodeId: string): void {
    const nodes: T[] = ClHelpService.convertObjectOrArrayToArray(node);

    for (const node of nodes) {
      this.tree.addOrReplaceNode(node, parentNodeId);
    }
    this.sortAndEmits();
  }

  /////////////////////////////////////// UPDATE ///////////////////////////////////////

  /**
   * this method update all the fields of the node except the children
   * @param node
   */
  public updateNodeInfo(node: T): void {
    if (this.tree.updateNodeObject(node)) {
      this.sortAndEmits();
    }
  }

  /////////////////////////////////////// DELETE ///////////////////////////////////////

  public deleteNode(nodeId: string): void {
    if (this.tree.deleteNodeById(nodeId)) {
      this.tree$.next(this.tree);
    }
  }

  ////////////////////////////////////// SORT /////////////////////////////////////////
  protected sortAndEmits(): void {
    const tree = this.tree;
    tree.children = this.sortAllRecur(tree.children);
    this.tree$.next(tree);
  }

  private sortAllRecur(nodes: FlTree<T>[]): FlTree<T>[] {
    if (this.childrenOrder) {
      nodes = nodes.sort((a, b) => this.childrenOrder(a.object, b.object));
      for (const node of nodes) {
        if (node.children) {
          this.sortAllRecur(node.children);
        }
      }
    }

    return nodes;
  }

  ///////////////////////////// OTHERS //////////////////////////////
  public getVisibleNodes(tree: MatTree<FlTree<T>>): FlTree<T>[] {
    const visibleNodes: FlTree<T>[] = [];
    for (const child of this.tree.children) {
      visibleNodes.push(...this.getVisibleNodesRecur(tree, child));
    }
    return visibleNodes;
  }

  private getVisibleNodesRecur(tree: MatTree<FlTree<T>>, node: FlTree<T>): FlTree<T>[] {
    const visibleNodes: FlTree<T>[] = [node];
    if (node.children && tree.isExpanded(node)) {
      for (const child of node.children) {
        visibleNodes.push(...this.getVisibleNodesRecur(tree, child));
      }
    }
    return visibleNodes;
  }

  public getRootNode(): FlTree<T> {
    return this.tree;
  }

  public isEmpty$(): Observable<boolean> {
    return this.tree$.pipe(map((tree) => tree.children.length === 0));
  }

  public hasNode(nodeId: string): boolean {
    return this.tree.hasNode(nodeId);
  }

  public trackById(_: number, item: FlTree<T>): string {
    return item.id;
  }

  public childrenAccessor(node: FlTree<T>): FlTree<T>[] {
    return node.children ?? [];
  }
}
