import { Injectable } from '@angular/core';
import { LabExperimentService } from '../../../../lab-core/entity-service/lab-experiment.service';
import { BehaviorSubject, merge, Observable, Subscription } from 'rxjs';
import { LabExperiment } from '../../../../lab-core/model/entities/lab-experiment.entity';
import { filter, map, tap } from 'rxjs/operators';
import { LabProtocol } from '../../../../lab-core/model/entities/process/lab-protocol.entity';
import { LabProtocolService } from '../../../../lab-core/entity-service/lab-protocol.service';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlSnackBarService
} from '@monorepo/front-core-lib';
import { LabProcess } from '../../../../lab-core/model/entities/process/lab-process.entity';
import { PrWorkflow, PrWorkflowLayer } from '@monorepo/protocol';
import { LabWorkflowFactory } from '../model/lab-workflow.factory';
import { LabTagService } from '../../../../lab-core/entity-service/lab-tag.service';
import { LabTagDatasource } from '../../../../lab-core/model/entities/lab-tag.entity';
import { TeRichTextContent } from '@monorepo/text-editor';

@Injectable()
export class LabExperimentDetailPageState {

  private experiment$: BehaviorSubject<LabExperiment>;
  private experimentDescription$: BehaviorSubject<TeRichTextContent>;
  private tags$: LabTagDatasource;

  public workflow: PrWorkflow;
  private mainProtocolId: string;
  private protocols: Record<string, BehaviorSubject<LabProtocol>>;

  // does not emit experiment until ready is true
  private ready$: BehaviorSubject<boolean>;

  // refresh time : 15sec
  private refreshIntervalDuration: number = 15000;
  private timeout: any;
  private refreshSubscription: Subscription;
  private experimentSubscription: Subscription;

  private experimentIsStarting: boolean = false;

  constructor(private experimentService: LabExperimentService,
              private protocolService: LabProtocolService,
              private workflowFactory: LabWorkflowFactory,
              private snackBarService: FlSnackBarService,
              private dialogService: FlDialogService,
              private tagService: LabTagService) {
  }

  public init(experimentId: string): void {
    this.ready$ = new BehaviorSubject(false);
    this.experiment$ = new BehaviorSubject(null);
    this.experimentDescription$ = new BehaviorSubject(null);
    this.protocols = {};
    this.experimentService.getExperiment(experimentId).subscribe(
      {
        next: experiment => this.getExperimentSuccess(experiment),
        error: error => {
          this.experiment$.error(error);
          this.ready$.error(error);
        }
      }
    );
    this.tags$ = this.tagService.getEntityTagsDatasource('EXPERIMENT', experimentId);
  }

  private getExperimentSuccess(experiment: LabExperiment): void {
    this.experiment$.next(experiment);
    this.experimentDescription$.next(experiment.description);
    this.mainProtocolId = experiment.protocol.id;
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

  public getExperiment$(): Observable<LabExperiment> {
    return this.experiment$.asObservable().pipe(
      filter(experiment => experiment != null),
    );
  }

  public get currentExperiment(): LabExperiment {
    return this.experiment$.value;
  }

  public isEditable$(): Observable<boolean> {
    return this.getExperiment$().pipe(map(experiment => experiment.protocolIsEditable()));
  }

  public isReady$(): Observable<boolean> {
    return this.ready$.asObservable().pipe(
      filter(ready => ready)
    );
  }

  /**
   * Update the experiment locally
   * @param experiment
   * @param refreshWorkflow if true, the protocol are reloaded
   */
  public updateExperiment(experiment: LabExperiment, refreshWorkflow: boolean = false): void {
    if (experiment == null) return;
    this.experiment$.next(experiment);

    if (refreshWorkflow) {
      this.refreshAllProtocols();
    }

    this.checkAndStartRefreshProtocol();
  }

  public getTags$(): LabTagDatasource {
    return this.tags$;
  }

  public getDescription$(): Observable<TeRichTextContent> {
    return this.experimentDescription$.asObservable();
  }

  public get currentDescription(): TeRichTextContent {
    return this.experimentDescription$.value;
  }

  public updateDescription(description: TeRichTextContent): void {
    this.experimentDescription$.next(description);
  }

  public refreshExperiment(): void {
    this.experimentSubscription = this.experimentService.getExperiment(this.currentExperiment.id).subscribe(
      experiment => this.updateExperiment(experiment)
    );
  }

  ////////////////////////////////////////// PROTOCOL //////////////////////////////////////////


  /**
   * Check if the experiment is waiting or running and start to refresh the protocol if yes
   */
  private checkAndStartRefreshProtocol(): void {
    if (this.timeout) return;
    const mainProtocol = this.protocols[this.mainProtocolId].value;
    const experiment = this.currentExperiment;
    // Stop refresh if experiment is not running (including queue) and the main protocol is finished
    if ((!experiment.isRunning() && experiment.status.value !== 'IN_QUEUE') && !mainProtocol.isRunning()) return;

    this.timeout = setTimeout(() => {
      this.timeout = null;

      // retrieve all not finished protocols
      const notFinishedProtocolIds: string[] = this.getCurrentProtocols()
        .filter(protocol => !protocol.isFinished()).map(protocol => protocol.id);
      this.refreshProtocolsTick(notFinishedProtocolIds);
      this.refreshExperiment();
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
    const protocol = this.workflow.findLayerWithId(dbProtocol.id);
    if (protocol == null) return;

    this.refreshProtocolSuccess(dbProtocol);

    // refresh other protocols
    const otherProtocols = this.getCurrentProtocols().filter(process => process.id !== dbProtocol.id)
      .map(process => process.id);
    this.refreshProtocols(otherProtocols).subscribe();

    this.refreshExperiment();
  }

  public refreshProcess(process: LabProcess): void {
    const layer = this.workflow.findLayerWithId(process.parentProtocolId);
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
    this.experimentSubscription?.unsubscribe();
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
    const layer = this.workflow.findLayerWithId(protocol.id);
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
    if (this.experimentIsStarting) return;
    const experiment: LabExperiment = this.currentExperiment;

    this.experimentIsStarting = true;
    this.experimentService.startExperiment(experiment.id).subscribe({
      next: (exp) => this.onStartSuccess(exp),
      error: () => this.experimentIsStarting = false
    });
  }

  private onStartSuccess(experiment: LabExperiment): void {
    this.snackBarService.openSuccessMessage({text: 'biox.experiment_started', translateText: true});
    this.experimentIsStarting = false;
    this.updateExperiment(experiment);
    this.startProtocolsRefresh();
  }

  stopExperiment(): void {
    const data: FlConfirmDialogInput = {
      title: 'biox.stop_experiment',
      content: 'biox.stop_experiment_confirmation',
      observable: this.experimentService.stopExperiment(this.currentExperiment.id),
      successMessage: 'biox.experiment_stopped',
    };

    this.dialogService.openConfirmDialog(data).afterClosed().subscribe(
      (result: FlConfirmDialogResult<LabExperiment>) => {
        if (result.choice) {
          this.updateExperiment(result.result);
        }
      }
    );
  }


  ////////////////////// OTHER //////////////////////

  public clear(): void {
    this.experiment$.complete();
    for (const subProtocol$ of Object.values(this.protocols)) {
      subProtocol$.complete();
    }
    this.ready$.complete();
    this.experimentDescription$.complete();
    this.stopProtocolsRefresh();
    this.workflow?.destroy();
    this.tags$?.disconnect();
  }
}
