import { FlThemeDetail } from '@monorepo/front-core-lib/fl-theme';
import { Observable } from 'rxjs';

import { BnBioNetworkMetaboliteLevel } from '../model/bn-bio-network.class';
import { BnBioNetworkNode } from '../model/bn-bio-network-node.class';
import { BnBioNetworkNodeCofactor } from '../model/bn-bio-network-node-cofactor.class';
import { BnBioNetworkNodeMetabolite } from '../model/bn-bio-network-node-metabolite.class';
import { BnBioNetworkNodeReaction } from '../model/bn-bio-network-node-reaction.class';
import {
  BnBioNetworkSelectionEvent,
  BnBioNetworkSelectionMode,
} from '../model/bn-bio-network-selection.class';
import { BnBioNetworkGridState } from '../state/bn-bio-network-grid.state';
import { BnBioNetworkOptions } from '../state/bn-bio-network-options.state';
import { BnBioNetworkSelectionState } from '../state/bn-bio-network-selection.state';
import { BnBioNetworkCofactorRenderer } from './bn-bio-network-cofactor.renderer';
import { BnBioNetworkGraphRenderer } from './bn-bio-network-main.renderer';
import { BnBioNetworkMetaboliteRenderer } from './bn-bio-network-metabolite.renderer';
import {
  BnBioNetworkObjectColorFunction,
  BnBioNetworkObjectRenderer,
} from './bn-bio-network-object.renderer';
import { BnBioNetworkReactionRenderer } from './bn-bio-network-reaction.renderer';

/**
 * Class to render nodes of the network (metabolites, reactions and cofactors)
 */
export class BnBioNetworkNodesRenderer extends BnBioNetworkObjectRenderer {
  public positions: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  };

  constructor(
    graphRenderer: BnBioNetworkGraphRenderer,
    options$: Observable<BnBioNetworkOptions>,
    selection$: Observable<BnBioNetworkSelectionEvent>,
    private selectionState: BnBioNetworkSelectionState,
    private gridState: BnBioNetworkGridState,
    greyColor: string,
    private themeDetail: FlThemeDetail
  ) {
    super(graphRenderer, options$, selection$, greyColor);
  }

  public render(): void {
    // draw the node
    this.graphRenderer.graph
      // draw the pointer area for interactions
      .nodePointerAreaPaint((node: BnBioNetworkNode, color: string, ctx: CanvasRenderingContext2D) =>
        this.nodePaintPointerArea(node, ctx, color)
      )
      .nodeVal(() => 5)
      // .nodeRelSize(6)
      .onNodeClick((node: BnBioNetworkNode) =>
        this.selectionState.selectNodeAndDirectLinks(node, 'singleNodeByClick')
      )
      .onNodeDrag((node: BnBioNetworkNode) => {
        const coord = node.getCoords();
        if (coord.x != null && coord.y != null) {
          const newPos = this.gridState.roundCoordOnGrid({ x: coord.x, y: coord.y });
          if (newPos) {
            node.setPositionAndFreeze(newPos);
          }
        }

        if (node instanceof BnBioNetworkNodeReaction) {
          node.setCofactorsPositions();
        }
      });
  }

  protected updateObjectColors(options: BnBioNetworkOptions): void {
    let colorFunc: BnBioNetworkObjectColorFunction;
    if (options.coloredClusters?.length > 0) {
      colorFunc = this.getClusterColorFunction(options.coloredClusters);
    } else {
      colorFunc = this.getDefaultColorFunction();
    }

    this.graphRenderer.graph.nodeCanvasObject((node: BnBioNetworkNode, ctx: CanvasRenderingContext2D) =>
      this.nodePaint(node, ctx, colorFunc, options.showTexts)
    );
  }

  public updateVisibility(
    visibleLevels: BnBioNetworkMetaboliteLevel[],
    selectionMode: BnBioNetworkSelectionMode,
    selectedNode: BnBioNetworkNode | null,
    showRelatedCofactor: boolean
  ): void {
    let visibilityNode: (object: BnBioNetworkNode) => boolean;

    const levelVisibility = this.getLevelVisibilityFunction(visibleLevels, selectionMode);

    if (showRelatedCofactor) {
      visibilityNode = (object: BnBioNetworkNode) => {
        // show the cofactor only if the parent reaction is selected and visible
        if (object instanceof BnBioNetworkNodeCofactor) {
          return object.showCofactor(visibleLevels);
        }
        return levelVisibility(object);
      };
    } else {
      visibilityNode = (object: BnBioNetworkNode) => object.isVisible && levelVisibility(object);
    }

    this.graphRenderer.graph.nodeVisibility(visibilityNode);
  }

  private nodePaint(
    node: BnBioNetworkNode,
    ctx: CanvasRenderingContext2D,
    colorFunc: BnBioNetworkObjectColorFunction,
    showText: boolean
  ): void {
    // if node position are not  inside positions
    if (this.isOutsideRenderedPositions(node)) {
      return;
    }

    if (node instanceof BnBioNetworkNodeMetabolite) {
      BnBioNetworkMetaboliteRenderer.draw(ctx, node, colorFunc, showText, this.themeDetail);
    } else if (node instanceof BnBioNetworkNodeReaction) {
      BnBioNetworkReactionRenderer.draw(ctx, node, colorFunc, this.themeDetail);
    } else if (node instanceof BnBioNetworkNodeCofactor) {
      BnBioNetworkCofactorRenderer.draw(ctx, node, colorFunc, showText, this.themeDetail);
    } else {
      console.log('node type not supported');
    }
  }

  private isOutsideRenderedPositions(node: BnBioNetworkNode): boolean {
    const { x, y } = node;
    if (!this.positions || x == null || y == null) {
      return false;
    }
    return (
      x < this.positions.fromX || x > this.positions.toX || y < this.positions.fromY || y > this.positions.toY
    );
  }

  private nodePaintPointerArea(node: BnBioNetworkNode, ctx: CanvasRenderingContext2D, color: string): void {
    if (node instanceof BnBioNetworkNodeMetabolite) {
      BnBioNetworkMetaboliteRenderer.drawPointerArea(ctx, node, color);
    } else if (node instanceof BnBioNetworkNodeReaction) {
      BnBioNetworkReactionRenderer.drawPointerArea(ctx, node, color);
    } else if (node instanceof BnBioNetworkNodeCofactor) {
      BnBioNetworkCofactorRenderer.drawPointerArea(ctx, node, color);
    } else {
      console.log('node type not supported');
    }
  }
}
