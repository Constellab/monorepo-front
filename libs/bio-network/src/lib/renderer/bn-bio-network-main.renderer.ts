import {Injectable, OnDestroy} from '@angular/core';
import {ForceGraphInstance, GraphData} from 'force-graph';
import {BnBioNetworkGraph} from '../model/bn-bio-network-graph.class';
import {BnBioNetworkSelectionState} from '../state/bn-bio-network-selection.state';
import {BnBioNetworkOptionsState} from '../state/bn-bio-network-options.state';
import {BnBioNetworkState} from '../state/bn-bio-network.state';
import {BnBioNetworkSimulationState} from '../state/bn-bio-network-simulation.state';
import {ClSubscriptionHandler} from '@monorepo/core-lib';
import {BnBioNetworkZoomRenderer} from './bn-bio-network-zoom.renderer';
import {BnBioNetworkGridRenderer} from './bn-bio-network-grid.renderer';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {BnBioNetworkNodesRenderer} from './bn-bio-network-nodes.renderer';
import {BnBioNetworkLinksRenderer} from './bn-bio-network-links.renderer';
import {BnBioNetworkGridState} from '../state/bn-bio-network-grid.state';
import {BnBioNetworkEngineState} from '../state/bn-bio-network-engine.state';
import {FlCoord, FlThemeDetail, FlThemeService} from '@monorepo/front-core-lib';
export let ForceGraph: any = null;

if (typeof window !== 'undefined') {
  ForceGraph = require('force-graph');
}

export interface BnBioNetworkGraphRenderer {
  graph: ForceGraphInstance;
  data: BnBioNetworkGraph;
}

@Injectable()
export class BnBioNetworkMainRenderer implements OnDestroy {

  private container: HTMLElement;

  private _graph$: BehaviorSubject<BnBioNetworkGraphRenderer> = new BehaviorSubject(null);

  private initSubscriptions: ClSubscriptionHandler;

  private nodesRenderer: BnBioNetworkNodesRenderer;
  private linksRenderer: BnBioNetworkLinksRenderer;
  private gridRenderer: BnBioNetworkGridRenderer;

  // all node outside the screen + this margin will not be rendered
  private hideScreenMargin: number = 20;

  constructor(private state: BnBioNetworkState,
              private selectionState: BnBioNetworkSelectionState,
              private optionState: BnBioNetworkOptionsState,
              private simulationState: BnBioNetworkSimulationState,
              private gridState: BnBioNetworkGridState,
              private themeService: FlThemeService,
              private engineState: BnBioNetworkEngineState) {
  }


  public init(container: HTMLElement): void {
    this.container = container;
    this.state.getChartData$().subscribe(
      data => this.startSimulation(data)
    );
  }

  private async startSimulation(data: BnBioNetworkGraph): Promise<void> {
    this.clearNetwork();

    if (data == null) return;

    const enableSimulation = !data.allNodesHavePositions();

    const engineConfig = this.engineState.engineConfig;

    if (enableSimulation && !engineConfig.liveDrawing) {
      await this.simulationState.initSimulation(data, engineConfig);

      // once the simulation is over, save the new positions
      // data.savePositions();
    }

    data.setCofactorsPositions();

    this.drawNetwork(data);
  }

  private drawNetwork(data: BnBioNetworkGraph): void {
    this.initSubscriptions = new ClSubscriptionHandler();


    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    const engineConfig = this.engineState.engineConfig;
    // get data, if we draw in live, we don't include the cofactors to disturb the graph. We add them later.
    const graphData: GraphData = this.dataToGraph(data, !engineConfig.liveDrawing);


    const graph: ForceGraphInstance = ForceGraph()(this.container)
      .graphData(graphData).width(width).height(height)
      .autoPauseRedraw(true) // prevent redraw on every tick
      .maxZoom(BnBioNetworkZoomRenderer.maxZoomScale)
      .minZoom(BnBioNetworkZoomRenderer.minZoomScale)
      .zoom(BnBioNetworkZoomRenderer.defaultZoomScale)
      .onBackgroundClick(() => this.selectionState.clearSelection())
      .cooldownTime(engineConfig.liveDrawing ? 60000 : null)
      // if live drawing, we set null so it will calculate positions
      // otherwise we set 0 because positions where calculated already
      .cooldownTicks(engineConfig.liveDrawing ? undefined : 0)
      .d3AlphaDecay(engineConfig.alphaDecay)
      .d3AlphaMin(engineConfig.alphaMin)
      .d3VelocityDecay(engineConfig.velocityDecay)
      .d3Force('link', this.simulationState.getLinkForce(data, engineConfig))
      .d3Force('charge', this.simulationState.getChargeForce(engineConfig))
      .d3Force('center', this.simulationState.getCenterForce(engineConfig))
      .onEngineTick(() => this.simulationState.newTick())
    ;


    if (engineConfig.liveDrawing) {
      this.simulationState.markAsStarted(engineConfig);
      // once the simulation is over, stop the simulation
      graph.onEngineStop(() => {
        // clear the engine stop listener
        graph.onEngineStop(() => {
        });

        graph.cooldownTicks(0);
        // set the data with the cofactors
        graph.graphData(this.dataToGraph(data, true));

        this.simulationState.markAsEnded();
      });
    }


    const graphRenderer: BnBioNetworkGraphRenderer = {
      graph: graph,
      data: data
    };

    const themeDetail: FlThemeDetail = this.themeService.getCurrentThemeDetail();
    const grey = themeDetail.cardBackground;

    this.gridRenderer = new BnBioNetworkGridRenderer(graphRenderer, grey, this.optionState.getOptions$());
    this.nodesRenderer = new BnBioNetworkNodesRenderer(graphRenderer, this.optionState.getOptions$(),
      this.selectionState.getSelectionMode$(), this.selectionState, this.gridState,
      grey, themeDetail);
    this.nodesRenderer.render();

    this.linksRenderer = new BnBioNetworkLinksRenderer(graphRenderer, this.optionState.getOptions$(),
      this.selectionState.getSelectionMode$(), themeDetail.hover);
    this.linksRenderer.render();


    this.selectionState.init(data);
    this._graph$.next(graphRenderer);

    // hide nodes and links that are outside the screen
    graph.onZoom((transform) => {
      const canvasSize = this.getCanvasSize();
      const xWidth = canvasSize.x / transform.k;
      const yHeight = canvasSize.y / transform.k;

      const fromX = transform.x - xWidth / 2 - this.hideScreenMargin;
      const fromY = transform.y - yHeight / 2 - this.hideScreenMargin;
      const toX = transform.x + xWidth / 2 + this.hideScreenMargin;
      const toY = transform.y + yHeight / 2 + this.hideScreenMargin;

      for (const node of data.getMetabolitesAndReactions()) {
        // set visibility of nodes from position
        node.isVisible = node.x >= fromX && node.x <= toX &&
          node.y >= fromY && node.y <= toY;
      }
      for (const link of data.getMetaboliteAndReactionLinks()) {
        // set visibility of links from position
        link.isVisible = link.source.isVisible || link.target.isVisible;
      }
    });

  }

  private forceDraw(graphData: GraphData): void {
    if (this.graphRenderer == null) return;

    this.graphRenderer.graph.graphData(graphData);
  }

  private dataToGraph(data: BnBioNetworkGraph, includeCofactors: boolean): GraphData {
    if (includeCofactors) {
      return {
        nodes: data.getAllNodes(),
        links: data.getAllLinks()
      };
    } else {
      return {
        nodes: data.getMetabolitesAndReactions(),
        links: data.getMetaboliteAndReactionLinks()
      };
    }
  }

  private get graphRenderer(): BnBioNetworkGraphRenderer {
    return this._graph$.value;
  }

  public getGraphRenderer$(filterNull: boolean = true): Observable<BnBioNetworkGraphRenderer> {
    if (filterNull) {
      return this._graph$.asObservable().pipe(filter(graph => graph != null));
    } else {
      return this._graph$.asObservable();
    }
  }

  private clearNetwork(): void {
    // clear previous subscription
    this.initSubscriptions?.unsubscribe();
    this.nodesRenderer?.destroy();
    this.linksRenderer?.destroy();

    this.graphRenderer?.graph.graphData({nodes: [], links: []});
  }

  private getCanvasSize(): FlCoord {
    return {
      x: this.container.clientWidth,
      y: this.container.clientHeight
    };
  }

  ngOnDestroy(): void {
    this.graphRenderer?.graph._destructor();
  }


}
