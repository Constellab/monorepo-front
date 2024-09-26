import { Injectable } from '@angular/core';
import { FlApiWithCacheService, FlEntityPaginatedDatasource, FlFileHelper } from '@monorepo/front-core-lib';
import { Observable, tap } from 'rxjs';
import { LabProcessLayout, LabProtocol, LabProtocolLayout } from '../model/entities/process/lab-protocol.entity';
import { LabProtocolUpdateDTO } from '../../lab-biox/module/lab-experiment-detail-page/model/lab-workflow-action.class';
import { PrConfigValues } from '@monorepo/protocol';
import {
  LabCreateProtocolTemplateDTO,
  LabProtocolTemplate
} from '../model/entities/process/lab-protocol-template.entity';
import { TdIOSpec } from '@monorepo/technical-doc';
import {
  LabCreateCommunityLiveTaskVersionResDto,
  LabLiveTask,
  LabLiveTaskDatasourcePaginated
} from '../model/entities/lab-live-task.entity';
import { LabNavigableEntityImpact } from '../model/entities/lab-navigable-entity.entity';
import { LabProcess } from '../model/entities/process/lab-process.entity';
import { ClPage } from '@monorepo/core-lib';
import { LabCommunitySpace } from '../model/entities/lab-community-space.entity';
import { CoCreateLiveTaskFormData } from '@monorepo/community-lib';


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

  public addDuplicateProcessToProtocol(protocolId: string, processInstanceName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/duplicate-process/${processInstanceName}`, null,
      LabProtocolUpdateDTO);
  }

  /**
   * Call http post to get all live tasks with filters
   * @param spacesFilter
   * @param titleFilter
   * @param personalOnly
   * @param page
   * @param size
   * @return a list of live tasks
   */
  public getAllCommunityLiveTasksWithFilters(spacesFilter: string[], titleFilter: string, personalOnly: boolean,
                                             page: number, size: number): Observable<ClPage<LabLiveTask>> {
    return this.apiService.post(`${this.baseRoute}/get-community-available-live-tasks`,
      {spacesFilter: spacesFilter, titleFilter: titleFilter, personalOnly: personalOnly},
      LabLiveTask, {page: page, pageSize: size, resultIsPaginated: true});
  }

  public getCommunityAvailableLiveTasksWithFiltersPaginated(spacesFilter: string[], titleFilter: string,
                                                            personalOnly: boolean = false): LabLiveTaskDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAllCommunityLiveTasksWithFilters(spacesFilter, titleFilter, personalOnly, page, size), 10);
  }

  public getCurrentLiveTask(liveTaskVersionId: string): Observable<LabLiveTask> {
    return this.apiService.get(`${this.baseRoute}/get-current-live-task/${liveTaskVersionId}`, LabLiveTask);
  }


  public createCommunityLiveTask(processId: string,
                                 formData: CoCreateLiveTaskFormData): Observable<LabCreateCommunityLiveTaskVersionResDto>{
    return this.apiService.post(`${this.baseRoute}/${processId}/create-community-live-task`,
      formData, LabCreateCommunityLiveTaskVersionResDto);
  }

  public forkIntoNewCommunityLiveTask(processId: string,
                                      formData: CoCreateLiveTaskFormData,
                                      liveTaskVersionId: string): Observable<LabCreateCommunityLiveTaskVersionResDto>{
    return this.apiService.post(`${this.baseRoute}/${processId}/fork-community-live-task/${liveTaskVersionId}`,
      formData, LabCreateCommunityLiveTaskVersionResDto);
  }

  public addVersionToCommunityLiveTask(processId: string, liveTaskId: string): Observable<LabCreateCommunityLiveTaskVersionResDto> {
    return this.apiService.post(`${this.baseRoute}/${processId}/add-version-to-community-live-task/${liveTaskId}`,
      null, LabCreateCommunityLiveTaskVersionResDto);
  }


  public getCommunitySpaces(): Observable<LabCommunitySpace[]>{
    return this.apiService.post(`${this.baseRoute}/get-community-available-spaces`, null);
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

  public resetProcessInProtocol(protocolId: string, processInstanceName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/process/${processInstanceName}/reset`,
      null, LabProtocolUpdateDTO);
  }

  public checkImpactForProcessReset(protocolId: string, processInstanceName: string): Observable<LabNavigableEntityImpact> {
    return this.apiService.get(`${this.baseRoute}/${protocolId}/process/${processInstanceName}/reset/check-impact`,
      LabNavigableEntityImpact);
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

  public addProtocolTemplateToProtocol(protocolId: string, templateId: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/add-template/${templateId}`, null, LabProtocolUpdateDTO);
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

  ///////////////////////////////////////////////// OTHERS /////////////////////////////////////////////////
  public renameProcess(protocolId: string, processName: string, newName: string): Observable<LabProcess> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/process/${processName}/rename`, {new_name: newName},
      LabProcess);
  }

  ///////////////////////////////////////////////// PROTOCOL TEMPLATE /////////////////////////////////////////////////
  public createProtocolTemplate(protocolId: string, template: LabCreateProtocolTemplateDTO): Observable<LabProtocolTemplate> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/template`, template, LabProtocolTemplate);
  }

  public downloadProtocolTemplate(protocolId: string): Observable<Blob> {
    return this.apiService.get(`${this.baseRoute}/${protocolId}/template/download`, null,
      {responseType: 'blob'}).pipe(
      tap((result) => FlFileHelper.downloadBlob(result, 'protocol-template.json'))
    );
  }

}
