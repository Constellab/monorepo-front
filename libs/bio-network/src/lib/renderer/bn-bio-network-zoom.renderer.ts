import { inject, Injectable } from '@angular/core';
import { ForceGraphInstance } from 'force-graph';
import { combineLatest } from 'rxjs';

import { BnBioNetworkNode } from '../model/bn-bio-network-node.class';
import { BnBioNetworkSelectionEvent } from '../model/bn-bio-network-selection.class';
import { BnBioNetworkSelectionState } from '../state/bn-bio-network-selection.state';
import { BnBioNetworkMainRenderer } from './bn-bio-network-main.renderer';

@Injectable()
export class BnBioNetworkZoomRenderer {
  private mainRenderer = inject(BnBioNetworkMainRenderer);
  private selectionState = inject(BnBioNetworkSelectionState);

  public static readonly minZoomScale: number = 0.01;
  public static readonly maxZoomScale: number = 10;
  public static readonly defaultZoomScale: number = 0.25;

  // Default zoom scale when zooming to a position
  private readonly zoomToPositionScale: number = 1;

  private readonly zoomDuration: number = 750;

  public init(): void {
    combineLatest([this.mainRenderer.getGraphRenderer$(), this.selectionState.getSelectionMode$()]).subscribe(
      ([graphRenderer, selection]) => this.zoomOnSelection(graphRenderer?.graph ?? null, selection)
    );
  }

  private zoomOnSelection(graph: ForceGraphInstance | null, selection: BnBioNetworkSelectionEvent): void {
    if (graph == null || selection == null) return;
    if (selection.mode === 'singleNode') {
      const { x, y } = selection.selectedNode;
      if (x == null || y == null) return;
      this.zoomToPosition(graph, x, y);
    } else if (selection.mode === 'multipleNodes') {
      this.zoomToSelectedElements(graph);
    }
  }

  /**
   * Method to zoom to a position
   */
  private zoomToPosition(
    graph: ForceGraphInstance,
    posX: number,
    posY: number,
    scale: number = this.zoomToPositionScale
  ): void {
    graph.centerAt(posX, posY, this.zoomDuration);
    graph.zoom(scale, this.zoomDuration);
  }

  private zoomToSelectedElements(graph: ForceGraphInstance): void {
    graph.zoomToFit(this.zoomDuration, 100, (node: BnBioNetworkNode) => node.selected);
  }
}
