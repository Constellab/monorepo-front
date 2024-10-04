import { Injectable } from '@angular/core';
import { LabScenarioService } from '../../../lab-core/entity-service/lab-scenario.service';
import { BehaviorSubject, merge, Observable, Subscription } from 'rxjs';
import { LabScenario } from '../../../lab-core/model/entities/lab-scenario.entity';
import { filter, map, tap } from 'rxjs/operators';
import { LabProtocol } from '../../../lab-core/model/entities/process/lab-protocol.entity';
import { LabProtocolService } from '../../../lab-core/entity-service/lab-protocol.service';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlSnackBarService
} from '@monorepo/front-core-lib';
import { LabProcess } from '../../../lab-core/model/entities/process/lab-process.entity';
import { PrWorkflow, PrWorkflowLayer } from '@monorepo/protocol';
import { LabWorkflowFactory } from '../model/lab-workflow.factory';
import { LabTagService } from '../../../lab-core/entity-service/lab-tag.service';
import { LabTagDatasource } from '../../../lab-core/model/entities/lab-tag.entity';
import { TeRichTextContent } from '@monorepo/text-editor';

@Injectable()
export class LabScenarioDetailPageState {

  private scenario$: BehaviorSubject<LabScenario>;
  private scenarioDescription$: BehaviorSubject<TeRichTextContent>;
  private tags$: LabTagDatasource;

  public workflow: PrWorkflow;
  private mainProtocolId: string;
  private protocols: Record<string, BehaviorSubject<LabProtocol>>;

  // does not emit scenario until ready is true
  private ready$: BehaviorSubject<boolean>;

  // refresh time : 15sec
  private refreshIntervalDuration: number = 15000;
  private timeout: any;
  private refreshSubscription: Subscription;
  private scenarioSubscription: Subscription;

  private scenarioIsStarting: boolean = false;

  constructor(private scenarioService: LabScenarioService,
              private protocolService: LabProtocolService,
              private workflowFactory: LabWorkflowFactory,
              private snackBarService: FlSnackBarService,
              private dialogService: FlDialogService,
              private tagService: LabTagService) {
  }

  public init(scenarioId: string): void {
    this.ready$ = new BehaviorSubject(false);
    this.scenario$ = new BehaviorSubject(null);
    this.scenarioDescription$ = new BehaviorSubject(null);
    this.protocols = {};
    this.scenarioService.getScenario(scenarioId).subscribe(
      {
        next: scenario => this.getScenarioSuccess(scenario),
        error: error => {
          this.scenario$.error(error);
          this.ready$.error(error);
        }
      }
    );
    this.tags$ = this.tagService.getEntityTagsDatasource('SCENARIO', scenarioId);
  }

  private getScenarioSuccess(scenario: LabScenario): void {
    this.scenario$.next(scenario);
    this.scenarioDescription$.next(scenario.description);
    this.mainProtocolId = scenario.protocol.id;
    this.protocols[this.mainProtocolId] = new BehaviorSubject(null);

    this.protocolService.getProtocol(this.mainProtocolId).subscribe({
      next: protocol => this.onMainProtocolLoaded(protocol),
      error: error => {
        this.protocols[this.mainProtocolId].error(error);
        this.ready$.error(error);
      }
    });
  }

  private onMainProtocolLoaded(protocol: LabProtocol): void {
    const createSubLayer = (protocolId: string): Observable<PrWorkflowLayer> => this.getProtocol$(protocolId).pipe(
      map(protocol => this.workflowFactory.createLayer(protocol, false))
    );

    this.workflowFactory.initCreateSubLayerFunc(createSubLayer);
    this.workflow = this.workflowFactory.protocolToWorkflow(protocol);
    this.protocols[this.mainProtocolId].next(protocol);
    this.checkAndStartRefreshProtocol();
    this.ready$.next(true);
  }

  public getScenario$(): Observable<LabScenario> {
    return this.scenario$.asObservable().pipe(
      filter(scenario => scenario != null),
    );
  }

  public get currentScenario(): LabScenario {
    return this.scenario$.value;
  }

  public isEditable$(): Observable<boolean> {
    return this.getScenario$().pipe(map(scenario => scenario.protocolIsEditable()));
  }

  public isReady$(): Observable<boolean> {
    return this.ready$.asObservable().pipe(
      filter(ready => ready)
    );
  }

  /**
   * Update the scenario locally
   * @param scenario
   * @param refreshWorkflow if true, the protocol are reloaded
   */
  public updateScenario(scenario: LabScenario, refreshWorkflow: boolean = false): void {
    if (scenario == null) return;
    this.scenario$.next(scenario);

    if (refreshWorkflow) {
      this.refreshAllProtocols();
    }

    this.checkAndStartRefreshProtocol();
  }

  public getTags$(): LabTagDatasource {
    return this.tags$;
  }

  public getDescription$(): Observable<TeRichTextContent> {
    return this.scenarioDescription$.asObservable();
  }

  public get currentDescription(): TeRichTextContent {
    return this.scenarioDescription$.value;
  }

  public updateDescription(description: TeRichTextContent): void {
    this.scenarioDescription$.next(description);
  }

  public refreshScenario(): void {
    this.scenarioSubscription = this.scenarioService.getScenario(this.currentScenario.id).subscribe(
      scenario => this.updateScenario(scenario)
    );
  }

  ////////////////////////////////////////// PROTOCOL //////////////////////////////////////////


  /**
   * Check if the scenario is waiting or running and start to refresh the protocol if yes
   */
  private checkAndStartRefreshProtocol(): void {
    if (this.timeout) return;
    const mainProtocol = this.protocols[this.mainProtocolId].value;
    const scenario = this.currentScenario;
    // Stop refresh if scenario is not running (including queue) and the main protocol is finished
    if ((!scenario.isRunning() && scenario.status.value !== 'IN_QUEUE') && !mainProtocol.isRunning()) return;

    this.timeout = setTimeout(() => {
      this.timeout = null;

      // retrieve all not finished protocols
      const notFinishedProtocolIds: string[] = this.getCurrentProtocols()
        .filter(protocol => !protocol.isFinished()).map(protocol => protocol.id);
      this.refreshProtocolsTick(notFinishedProtocolIds);
      this.refreshScenario();
    }, this.refreshIntervalDuration);
  }

  /**
   * Start to refresh the protocol
   */
  public startProtocolsRefresh(): void {
    // retrieve all not finished protocols
    const allProtocols: string[] = this.getCurrentProtocols().map(protocol => protocol.id);
    this.refreshProtocolsTick(allProtocols);
  }

  /**
   * One tick to refresh the protocol, after getting all protocol, it calls get protocol again
   * @param protocolIds
   * @private
   */
  private refreshProtocolsTick(protocolIds: string[]): void {
    this.refreshSubscription = this.refreshProtocols(protocolIds).subscribe(
      {
        complete: () => this.checkAndStartRefreshProtocol()
      }
    );
  }

  private refreshAllProtocols(): void {
    this.refreshProtocols(this.getCurrentProtocols().map(process => process.id)).subscribe();
  }

  private getCurrentProtocols(): LabProtocol[] {
    return Object.values(this.protocols)
      .map(behavior => behavior.value);
  }

  private refreshProtocols(protocolIds: string[]): Observable<LabProtocol> {
    const obs: Observable<LabProtocol>[] = protocolIds.map(id => this.protocolService.getProtocol(id));
    return merge(...obs).pipe(
      tap(protocol => this.refreshProtocolSuccess(protocol)),
    );
  }

  /**
   * Refresh the protocol passed as parameter directly and then others protocols
   * @param dbProtocol
   */
  public refreshProtocolAndOthers(dbProtocol: LabProtocol): void {
    const protocol = this.workflow.findLayerById(dbProtocol.id);
    if (protocol == null) return;

    this.refreshProtocolSuccess(dbProtocol);

    // refresh other protocols
    const otherProtocols = this.getCurrentProtocols().filter(process => process.id !== dbProtocol.id)
      .map(process => process.id);
    this.refreshProtocols(otherProtocols).subscribe();

    this.refreshScenario();
  }

  public refreshProcess(process: LabProcess): void {
    const layer = this.workflow.findLayerById(process.parentProtocolId);
    if (layer) {
      layer.updateProcessObject(process.toPrProcess());
    }

    // refresh the stored process
    const subProtocol$ = this.protocols[process.parentProtocolId];
    if(subProtocol$) {
      subProtocol$.value.data.nodes[process.instanceName] = process;
    }
  }

  private stopProtocolsRefresh(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.refreshSubscription?.unsubscribe();
    this.scenarioSubscription?.unsubscribe();
  }

  public deleteProtocol(protocolId: string): void {
    if (this.protocols[protocolId]) {
      this.protocols[protocolId].complete();
      delete this.protocols[protocolId];
    }
    this.workflow.deleteLayerAndChildren(protocolId);
  }

  public getLabProcess$(protocolId: string, instanceName: string): Observable<LabProcess> {
    return this.protocols[protocolId].pipe(
      map(protocol => protocol.data.nodes[instanceName])
    );
  }

  public getProtocol$(protocolId: string): Observable<LabProtocol> {
    // if the protocol is not loaded, load it
    if (this.protocols[protocolId] == null) {
      this.protocols[protocolId] = new BehaviorSubject(null);
      this.protocolService.getProtocol(protocolId).subscribe({
        next: protocol => this.refreshProtocolSuccess(protocol),
        error: error => this.protocols[protocolId].error(error)
      });
    }
    return this.protocols[protocolId].asObservable().pipe(
      filter(protocol => protocol != null)
    );
  }

  /////////////////////////////////// FLOW ////////////////////////////////////

  public refreshProtocolsSuccess(protocols: LabProtocol[]): void {
    for (const protocol of protocols) {
      this.refreshProtocolSuccess(protocol);
    }
  }

  private refreshProtocolSuccess(protocol: LabProtocol): void {
    // refresh the layer object
    const layer = this.workflow.findLayerById(protocol.id);
    if (layer) {
      for (const labProcess of Object.values(protocol.data.nodes)) {
        layer.updateProcessObject(labProcess.toPrProcess());
      }
    } else {
      this.workflow.addLayer(this.workflowFactory.createLayer(protocol, false), protocol.parentProtocolId);
    }

    // refresh the stored protocol
    const subProtocol$ = this.protocols[protocol.id];
    subProtocol$.next(protocol);
  }

  public getMainProtocol$(): Observable<LabProtocol> {
    return this.getProtocol$(this.mainProtocolId);
  }

  ////////////////////// START / STOP //////////////////////
  start(): void {
    if (this.scenarioIsStarting) return;
    const scenario: LabScenario = this.currentScenario;

    this.scenarioIsStarting = true;
    this.scenarioService.startScenario(scenario.id).subscribe({
      next: (exp) => this.onStartSuccess(exp),
      error: () => this.scenarioIsStarting = false
    });
  }

  private onStartSuccess(scenario: LabScenario): void {
    this.snackBarService.openSuccessMessage({text: 'biox.scenario_started', translateText: true});
    this.scenarioIsStarting = false;
    this.updateScenario(scenario);
    this.startProtocolsRefresh();
  }

  stopScenario(): void {
    const data: FlConfirmDialogInput = {
      title: 'biox.stop_scenario',
      content: 'biox.stop_scenario_confirmation',
      observable: this.scenarioService.stopScenario(this.currentScenario.id),
      successMessage: 'biox.scenario_stopped',
    };

    this.dialogService.openConfirmDialog(data).afterClosed().subscribe(
      (result: FlConfirmDialogResult<LabScenario>) => {
        if (result.choice) {
          this.updateScenario(result.result);
        }
      }
    );
  }


  ////////////////////// OTHER //////////////////////

  public clear(): void {
    this.scenario$.complete();
    for (const subProtocol$ of Object.values(this.protocols)) {
      subProtocol$.complete();
    }
    this.ready$.complete();
    this.scenarioDescription$.complete();
    this.stopProtocolsRefresh();
    this.workflow?.destroy();
    this.tags$?.disconnect();
  }
}
