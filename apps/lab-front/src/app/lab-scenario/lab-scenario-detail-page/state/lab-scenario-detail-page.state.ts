import { inject,Injectable } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import {
  LiProcess,
  LiProtocol,
  LiProtocolService,
  LiScenario,
  LiScenarioService,
  LiTagDatasource,
  LiTagService,
} from '@monorepo/lab-lib/li-core';
import { PrWorkflow, PrWorkflowLayer } from '@monorepo/protocol';
import { TeRichText } from '@monorepo/text-editor';
import { BehaviorSubject, merge,Observable, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { LabWorkflowFactory } from '../model/lab-workflow.factory';

@Injectable()
export class LabScenarioDetailPageState {
  private scenarioService = inject(LiScenarioService);
  private protocolService = inject(LiProtocolService);
  private workflowFactory = inject(LabWorkflowFactory);
  private snackBarService = inject(FlSnackBarService);
  private dialogService = inject(FlDialogService);
  private tagService = inject(LiTagService);

  private scenario$: BehaviorSubject<LiScenario>;
  private scenarioDescription$: BehaviorSubject<TeRichText>;
  private tags$: LiTagDatasource;

  public workflow: PrWorkflow;
  private mainProtocolId: string;
  private protocols: Record<string, BehaviorSubject<LiProtocol>>;
  private processes: Record<string, BehaviorSubject<LiProcess>>;

  // does not emit scenario until ready is true
  private ready$: BehaviorSubject<boolean>;

  // refresh time : 15sec
  private refreshIntervalDuration: number = 15000;
  private timeout: any;
  private refreshSubscription: Subscription;
  private scenarioSubscription: Subscription;

  private scenarioIsStarting: boolean = false;

  public init(scenarioId: string): void {
    this.ready$ = new BehaviorSubject(false);
    this.scenario$ = new BehaviorSubject(null);
    this.scenarioDescription$ = new BehaviorSubject(null);
    this.protocols = {};
    this.processes = {};
    this.scenarioService.getScenario(scenarioId).subscribe({
      next: (scenario) => this.getScenarioSuccess(scenario),
      error: (error) => {
        this.scenario$.error(error);
        this.ready$.error(error);
      },
    });
    this.tags$ = this.tagService.getEntityTagsDatasource('SCENARIO', scenarioId);
  }

  private getScenarioSuccess(scenario: LiScenario): void {
    this.scenario$.next(scenario);
    this.scenarioDescription$.next(scenario.description);
    this.mainProtocolId = scenario.protocol.id;
    this.protocols[this.mainProtocolId] = new BehaviorSubject(null);

    this.protocolService.getProtocol(this.mainProtocolId).subscribe({
      next: (protocol) => this.onMainProtocolLoaded(protocol),
      error: (error) => {
        this.protocols[this.mainProtocolId].error(error);
        this.ready$.error(error);
      },
    });
  }

  private onMainProtocolLoaded(protocol: LiProtocol): void {
    const createSubLayer = (protocolId: string): Observable<PrWorkflowLayer> =>
      this.getProtocol$(protocolId).pipe(
        map((protocol) => this.workflowFactory.createLayer(protocol, false))
      );

    this.workflowFactory.initCreateSubLayerFunc(createSubLayer);
    this.workflow = this.workflowFactory.protocolToWorkflow(protocol);
    this.refreshProtocolProcesses(protocol);
    this.protocols[this.mainProtocolId].next(protocol);
    this.checkAndStartRefreshProtocol();
    this.ready$.next(true);
  }

  public getScenario$(): Observable<LiScenario> {
    return this.scenario$.asObservable().pipe(filter((scenario) => scenario != null));
  }

  public get currentScenario(): LiScenario {
    return this.scenario$.value;
  }

  public isEditable$(): Observable<boolean> {
    return this.getScenario$().pipe(map((scenario) => scenario.protocolIsEditable()));
  }

  public isReady$(): Observable<boolean> {
    return this.ready$.asObservable().pipe(filter((ready) => ready));
  }

  /**
   * Update the scenario locally
   * @param scenario
   * @param refreshWorkflow if true, the protocol are reloaded
   */
  public updateScenario(scenario: LiScenario, refreshWorkflow: boolean = false): void {
    if (scenario == null) return;
    this.scenario$.next(scenario);

    if (refreshWorkflow) {
      this.refreshAllProtocols();
    }

    this.checkAndStartRefreshProtocol();
  }

  public getTags$(): LiTagDatasource {
    return this.tags$;
  }

  public getDescription$(): Observable<TeRichText> {
    return this.scenarioDescription$.asObservable();
  }

  public get currentDescription(): TeRichText {
    return this.scenarioDescription$.value;
  }

  public updateDescription(description: TeRichText): void {
    this.scenarioDescription$.next(description);
  }

  public refreshScenario(): void {
    this.scenarioSubscription = this.scenarioService
      .getScenario(this.currentScenario.id)
      .subscribe((scenario) => this.updateScenario(scenario));
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
    if (!scenario.isRunning() && scenario.status.value !== 'IN_QUEUE' && !mainProtocol.isRunning()) return;

    this.timeout = setTimeout(() => {
      this.timeout = null;

      // retrieve all not finished protocols
      const notFinishedProtocolIds: string[] = this.getCurrentProtocols()
        .filter((protocol) => !protocol.isFinished())
        .map((protocol) => protocol.id);
      this.refreshProtocolsTick(notFinishedProtocolIds);
      this.refreshScenario();
    }, this.refreshIntervalDuration);
  }

  /**
   * Start to refresh the protocol
   */
  public startProtocolsRefresh(): void {
    // retrieve all not finished protocols
    const allProtocols: string[] = this.getCurrentProtocols().map((protocol) => protocol.id);
    this.refreshProtocolsTick(allProtocols);
  }

  /**
   * One tick to refresh the protocol, after getting all protocol, it calls get protocol again
   * @param protocolIds
   * @private
   */
  private refreshProtocolsTick(protocolIds: string[]): void {
    this.refreshSubscription = this.refreshProtocols(protocolIds).subscribe({
      complete: () => this.checkAndStartRefreshProtocol(),
    });
  }

  private refreshAllProtocols(): void {
    this.refreshProtocols(this.getCurrentProtocols().map((process) => process.id)).subscribe();
  }

  private getCurrentProtocols(): LiProtocol[] {
    return Object.values(this.protocols).map((behavior) => behavior.value);
  }

  private refreshProtocols(protocolIds: string[]): Observable<LiProtocol> {
    const obs: Observable<LiProtocol>[] = protocolIds.map((id) => this.protocolService.getProtocol(id));
    return merge(...obs).pipe(tap((protocol) => this.refreshProtocolSuccess(protocol)));
  }

  /**
   * Refresh the protocol passed as parameter directly and then others protocols
   * @param dbProtocol
   */
  public refreshProtocolAndOthers(dbProtocol: LiProtocol): void {
    const protocol = this.workflow.findLayerById(dbProtocol.id);
    if (protocol == null) return;

    this.refreshProtocolSuccess(dbProtocol);

    // refresh other protocols
    const otherProtocols = this.getCurrentProtocols()
      .filter((process) => process.id !== dbProtocol.id)
      .map((process) => process.id);
    this.refreshProtocols(otherProtocols).subscribe();

    this.refreshScenario();
  }

  public refreshProcess(process: LiProcess): void {
    // store it in the dict
    const process$ = this.processes[process.id];
    if (process$) {
      process$.next(process);
    } else {
      this.processes[process.id] = new BehaviorSubject(process);
    }

    const layer = this.workflow.findLayerById(process.parentProtocolId);
    if (layer) {
      layer.updateProcessObject(process.toPrProcess());
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

  public getLabProcess$(processId: string): Observable<LiProcess> {
    return this.processes[processId].asObservable();
  }

  public getProtocol$(protocolId: string): Observable<LiProtocol> {
    // if the protocol is not loaded, load it
    if (this.protocols[protocolId] == null) {
      this.protocols[protocolId] = new BehaviorSubject(null);
      this.protocolService.getProtocol(protocolId).subscribe({
        next: (protocol) => this.refreshProtocolSuccess(protocol),
        error: (error) => this.protocols[protocolId].error(error),
      });
    }
    return this.protocols[protocolId].asObservable().pipe(filter((protocol) => protocol != null));
  }

  private refreshProtocolProcesses(protocol: LiProtocol): void {
    for (const labProcess of Object.values(protocol.data.nodes)) {
      this.refreshProcess(labProcess);
    }
  }

  /////////////////////////////////// FLOW ////////////////////////////////////

  public refreshProtocolsSuccess(protocols: LiProtocol[]): void {
    for (const protocol of protocols) {
      this.refreshProtocolSuccess(protocol);
    }
  }

  private refreshProtocolSuccess(protocol: LiProtocol): void {
    this.refreshProtocolProcesses(protocol);

    // refresh the stored protocol
    const subProtocol$ = this.protocols[protocol.id];
    subProtocol$.next(protocol);

    // refresh the layer object
    const layer = this.workflow.findLayerById(protocol.id);
    if (!layer) {
      this.workflow.addLayer(this.workflowFactory.createLayer(protocol, false), protocol.parentProtocolId);
    }
  }

  public getMainProtocol$(): Observable<LiProtocol> {
    return this.getProtocol$(this.mainProtocolId);
  }

  ////////////////////// START / STOP //////////////////////
  start(): void {
    if (this.scenarioIsStarting) return;
    const scenario: LiScenario = this.currentScenario;

    this.scenarioIsStarting = true;
    this.scenarioService.startScenario(scenario.id).subscribe({
      next: (exp) => this.onStartSuccess(exp),
      error: () => (this.scenarioIsStarting = false),
    });
  }

  private onStartSuccess(scenario: LiScenario): void {
    this.snackBarService.openSuccessMessage({ text: 'biox.scenario_started', translateText: true });
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

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult<LiScenario>) => {
        if (result.choice) {
          this.updateScenario(result.result);
        }
      });
  }

  ////////////////////// OTHER //////////////////////

  public clear(): void {
    this.scenario$.complete();
    for (const subProtocol$ of Object.values(this.protocols)) {
      subProtocol$.complete();
    }
    for (const subProcess$ of Object.values(this.processes)) {
      subProcess$.complete();
    }
    this.ready$.complete();
    this.scenarioDescription$.complete();
    this.stopProtocolsRefresh();
    this.workflow?.destroy();
    this.tags$?.disconnect();
  }
}
