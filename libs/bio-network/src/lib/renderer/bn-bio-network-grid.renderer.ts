import {BnBioNetworkGridState} from '../state/bn-bio-network-grid.state';
import {Observable} from 'rxjs';
import {BnBioNetworkOptions} from '../state/bn-bio-network-options.state';
import {BnBioNetworkGraphRenderer} from './bn-bio-network-main.renderer';

/**
 * Renderer for the background grid
 */
export class BnBioNetworkGridRenderer {


  constructor(private graphRenderer: BnBioNetworkGraphRenderer,
              private color: string,
              options$: Observable<BnBioNetworkOptions>) {
    options$.subscribe(
      action => this.updateGrid(action.showGrid)
    );
  }

  private updateGrid(showGrid: boolean): void {
    if (showGrid) {
      this.graphRenderer.graph.onRenderFramePre((ctx: CanvasRenderingContext2D) => this.drawGrid(ctx));
    } else {
      this.graphRenderer.graph.onRenderFramePre(null);
    }
  }

  private drawGrid(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 0.1;

    let i = -BnBioNetworkGridState.gridSize;
    while (i < BnBioNetworkGridState.gridSize) {
      // vertical lines
      ctx.beginPath();
      ctx.moveTo(i, -BnBioNetworkGridState.gridSize);
      ctx.lineTo(i, BnBioNetworkGridState.gridSize);
      ctx.stroke();

      // horizontal lines
      ctx.beginPath();
      ctx.moveTo(-BnBioNetworkGridState.gridSize, i);
      ctx.lineTo(BnBioNetworkGridState.gridSize, i);
      ctx.stroke();

      ctx.stroke();
      i += BnBioNetworkGridState.gridStep;
    }
  }
}
