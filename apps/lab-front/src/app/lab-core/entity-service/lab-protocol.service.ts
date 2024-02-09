import {Injectable} from '@angular/core';
import {FlApiWithCacheService} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {LabProcessLayout, LabProtocol, LabProtocolLayout} from '../model/entities/process/lab-protocol.entity';
import {LabProtocolUpdateDTO} from '../../lab-biox/module/lab-experiment-detail-page/model/lab-workflow-action.class';
import {PrConfigValues} from '@monorepo/protocol';
import {
  LabCreateProtocolTemplateDTO,
  LabProtocolTemplate
} from '../model/entities/process/lab-protocol-template.entity';
import {TdIOSpec} from '@monorepo/technical-doc';
import {LabLiveTask} from '../model/entities/lab-live-task.entity';
import {LabProcessResetResult} from '../model/entities/lab-navigable-entity.entity';

@Injectable({
  providedIn: 'root'
})
export class LabProtocolService {

  private readonly baseRoute: string = 'protocol';


  constructor(private apiService: FlApiWithCacheService) {
  }

  public getProtocol(protocolId: string): Observable<LabProtocol> {
    return this.apiService.get(`${this.baseRoute}/${protocolId}`, LabProtocol);
  }

  //////////////////////////////////////// PROCESS /////////////////////////////////////
  /**
   * Route to add a process (from type) to an existing protocol (can be a sub protocol)
   * @param protocolId
   * @param processTypingName
   */
  public addProcessToProtocol(protocolId: string, processTypingName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/add-process/${processTypingName}`, null,
      LabProtocolUpdateDTO);
  }

  public getCommunityAvailableLiveTask(): Observable<LabLiveTask[]> {
    return this.apiService.post(`${this.baseRoute}/get-community-available-live-tasks`, null,
      LabProtocolUpdateDTO);
  }

  public addCommunityLiveTaskToProtocol(protocolId: string, liveTaskVersionId: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/add-community-live-task/${liveTaskVersionId}`, null,
      LabProtocolUpdateDTO);
  }

  /**
   * Route to add a process (from type) to an existing protocol (can be a sub protocol),
   * and link it to the output of an existing process
   * @param protocolId
   * @param processTypingName
   * @param outputProcessName name of the process to link to
   * @param outputPortName name of the port to link to
   */
  public addProcessConnectedToOutput(protocolId: string, processTypingName: string,
                                     outputProcessName: string, outputPortName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-process/${processTypingName}/connected-to-output/${outputProcessName}/${outputPortName}`,
      null, LabProtocolUpdateDTO);
  }

  /**
   * Route to add a process (from type) to an existing protocol (can be a sub protocol),
   * and link it to the output of an existing process
   * @param protocolId
   * @param processTypingName
   * @param inputProcessName name of the process to link to
   * @param inputPortName name of the port to link to
   */
  public addProcessConnectedToInput(protocolId: string, processTypingName: string,
                                    inputProcessName: string, inputPortName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-process/${processTypingName}/connected-to-input/${inputProcessName}/${inputPortName}`,
      null, LabProtocolUpdateDTO);
  }

  public deleteProcessInProtocol(protocolId: string, processInstanceName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.delete(`${this.baseRoute}/${protocolId}/process/${processInstanceName}`, LabProtocolUpdateDTO);
  }

  public resetProcessInProtocol(protocolId: string, processInstanceName: string,
                                force: boolean = false): Observable<LabProcessResetResult> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/process/${processInstanceName}/reset/${force}`,
      null, LabProcessResetResult);
  }

  public runProcessInProtocol(protocolId: string, processInstanceName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/process/${processInstanceName}/run`, null, LabProtocolUpdateDTO);
  }

  //////////////////////////////////////// CONNECTION /////////////////////////////////////

  public addConnection(protocolId: string, connection: {
    output_process_name: string
    output_port_name: string
    input_process_name: string
    input_port_name: string
  }): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/connector`, connection, LabProtocolUpdateDTO);
  }

  public deleteConnection(protocolId: string, inputProcessName: string, inputPortName: string): Observable<void> {
    return this.apiService.delete(`${this.baseRoute}/${protocolId}/connector/${inputProcessName}/${inputPortName}`, LabProtocolUpdateDTO);
  }

  //////////////////////////////////////// CONFIG /////////////////////////////////////

  public saveProcessConfig(protocolId: string, processInstanceName: string, config: PrConfigValues): Observable<LabProtocolUpdateDTO> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/process/${processInstanceName}/config`,
      config, LabProtocolUpdateDTO);
  }

  //////////////////////////////////////// INTERFACE / OUTERFACE /////////////////////////////////////

  public deleteInterface(protocolId: string, interfaceName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.delete(`${this.baseRoute}/${protocolId}/interface/${interfaceName}`, LabProtocolUpdateDTO);
  }

  public deleteOuterface(protocolId: string, outerfaceName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.delete(`${this.baseRoute}/${protocolId}/outerface/${outerfaceName}`, LabProtocolUpdateDTO);
  }

  //////////////////////////////////////// SPECIFIC PROCESS /////////////////////////////////////

  public addSourceToProcessInput(protocolId: string, resourceId: string,
                                 processName: string, inputPortName: string,): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/add-source/${resourceId}/${processName}/${inputPortName}`,
      null, LabProtocolUpdateDTO);
  }

  public addSource(protocolId: string, resourceId: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/add-source/${resourceId}`,
      null, LabProtocolUpdateDTO);
  }

  public addTaskOutput(protocolId: string, processName: string,
                       outputPortName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/add-sink/${processName}/${outputPortName}`,
      null, LabProtocolUpdateDTO);
  }

  public addViewerToProcessOutput(protocolId: string, processName: string,
                                  outputPortName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/add-viewer/${processName}/${outputPortName}`,
      null, LabProtocolUpdateDTO);
  }

  ///////////////////////////////////////////////// LAYOUT /////////////////////////////////////////////////
  public saveLayout(protocolId: string, layout: LabProtocolLayout): Observable<void> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/layout`, layout);
  }

  public saveProcessLayout(protocolId: string, processName: string, layout: LabProcessLayout): Observable<void> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/layout/process/${processName}`, layout);
  }

  public saveInterfaceLayout(protocolId: string, interfaceName: string, layout: LabProcessLayout): Observable<void> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/layout/interface/${interfaceName}`, layout);
  }

  public saveOuterfaceLayout(protocolId: string, outerfaceName: string, layout: LabProcessLayout): Observable<void> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/layout/outerface/${outerfaceName}`, layout);
  }

  ///////////////////////////////////////////////// DYNAMIC PORT /////////////////////////////////////////////////

  public createDynamicInputPort(protocolId: string, processName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/process/${processName}/dynamic-input`, null,
      LabProtocolUpdateDTO);
  }

  public createDynamicOutputPort(protocolId: string, processName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/process/${processName}/dynamic-output`, null,
      LabProtocolUpdateDTO);
  }

  public deleteDynamicInputPort(protocolId: string, processName: string, portName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.delete(`${this.baseRoute}/${protocolId}/process/${processName}/dynamic-input/${portName}`,
      LabProtocolUpdateDTO);
  }

  public deleteDynamicOutputPort(protocolId: string, processName: string, portName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.delete(`${this.baseRoute}/${protocolId}/process/${processName}/dynamic-output/${portName}`,
      LabProtocolUpdateDTO);
  }

  public updateDynamicInputPort(protocolId: string, processName: string, portName: string,
                                ioSpec: TdIOSpec): Observable<LabProtocolUpdateDTO> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/process/${processName}/dynamic-input/${portName}`,
      ioSpec, LabProtocolUpdateDTO);
  }

  public updateDynamicOutputPort(protocolId: string, processName: string, portName: string,
                                 ioSpec: TdIOSpec): Observable<LabProtocolUpdateDTO> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/process/${processName}/dynamic-output/${portName}`,
      ioSpec, LabProtocolUpdateDTO);
  }


  ///////////////////////////////////////////////// PROTOCOL TEMPLATE /////////////////////////////////////////////////
  public createProtocolTemplate(protocolId: string, template: LabCreateProtocolTemplateDTO): Observable<LabProtocolTemplate> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/template`, template, LabProtocolTemplate);
  }

  public getProtocolTemplateDownloadUrl(protocolId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.baseRoute}/${protocolId}/template/download`);
  }

}
