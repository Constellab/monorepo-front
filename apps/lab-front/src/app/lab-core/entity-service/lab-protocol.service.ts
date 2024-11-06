import { Injectable } from '@angular/core';
import { FlApiWithCacheService, FlEntityPaginatedDatasource, FlFileHelper } from '@monorepo/front-core-lib';
import { Observable, tap } from 'rxjs';
import {
  LabProcessLayout,
  LabProtocol,
  LabProtocolLayout,
} from '../model/entities/process/lab-protocol.entity';
import { LabProtocolUpdateDTO } from '../../lab-scenario/lab-scenario-detail-page/model/lab-workflow-action.class';
import { PrConfigValues } from '@monorepo/protocol';
import {
  LabCreateScenarioTemplateDTO,
  LabScenarioTemplate,
} from '../model/entities/process/lab-scenario-template.entity';
import { TdIOSpec, TdTypeStyle } from '@monorepo/technical-doc';
import {
  LabAgent,
  LabAgentDatasourcePaginated,
  LabCreateCommunityAgentVersionResDto,
} from '../model/entities/lab-agent.entity';
import { LabNavigableEntityImpact } from '../model/entities/lab-navigable-entity.entity';
import { LabProcess } from '../model/entities/process/lab-process.entity';
import { ClPage } from '@monorepo/core-lib';
import { LabCommunitySpace } from '../model/entities/lab-community-space.entity';
import { CoCreateAgentFormData } from '@monorepo/community-lib';

@Injectable({
  providedIn: 'root',
})
export class LabProtocolService {
  private readonly baseRoute: string = 'protocol';

  constructor(private apiService: FlApiWithCacheService) {}

  public getProtocol(protocolId: string): Observable<LabProtocol> {
    return this.apiService.get(`${this.baseRoute}/${protocolId}`, LabProtocol);
  }

  //////////////////////////////////////// PROCESS /////////////////////////////////////
  /**
   * Route to add a process (from type) to an existing protocol (can be a sub protocol)
   * @param protocolId
   * @param processTypingName
   */
  public addProcessToProtocol(
    protocolId: string,
    processTypingName: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-process/${processTypingName}`,
      null,
      LabProtocolUpdateDTO
    );
  }

  public addEmptyProtocolToProtocol(protocolId: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-empty-protocol`,
      null,
      LabProtocolUpdateDTO
    );
  }

  public addDuplicateProcessToProtocol(
    protocolId: string,
    processInstanceName: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/duplicate-process/${processInstanceName}`,
      null,
      LabProtocolUpdateDTO
    );
  }

  /**
   * Call http post to get all agents with filters
   * @param spacesFilter
   * @param titleFilter
   * @param personalOnly
   * @param page
   * @param size
   * @return a list of agents
   */
  public getAllCommunityAgentsWithFilters(
    spacesFilter: string[],
    titleFilter: string,
    personalOnly: boolean,
    page: number,
    size: number
  ): Observable<ClPage<LabAgent>> {
    return this.apiService.post(
      `${this.baseRoute}/get-community-available-agents`,
      { spacesFilter: spacesFilter, titleFilter: titleFilter, personalOnly: personalOnly },
      LabAgent,
      { page: page, pageSize: size, resultIsPaginated: true }
    );
  }

  public getCommunityAvailableAgentsWithFiltersPaginated(
    spacesFilter: string[],
    titleFilter: string,
    personalOnly: boolean = false
  ): LabAgentDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size) =>
        this.getAllCommunityAgentsWithFilters(spacesFilter, titleFilter, personalOnly, page, size),
      10
    );
  }

  public getCurrentAgent(agentVersionId: string): Observable<LabAgent> {
    return this.apiService.get(`${this.baseRoute}/get-current-agent/${agentVersionId}`, LabAgent);
  }

  public createCommunityAgent(
    processId: string,
    formData: CoCreateAgentFormData
  ): Observable<LabCreateCommunityAgentVersionResDto> {
    return this.apiService.post(
      `${this.baseRoute}/${processId}/create-community-agent`,
      formData,
      LabCreateCommunityAgentVersionResDto
    );
  }

  public forkIntoNewCommunityAgent(
    processId: string,
    formData: CoCreateAgentFormData,
    agentVersionId: string
  ): Observable<LabCreateCommunityAgentVersionResDto> {
    return this.apiService.post(
      `${this.baseRoute}/${processId}/fork-community-agent/${agentVersionId}`,
      formData,
      LabCreateCommunityAgentVersionResDto
    );
  }

  public addVersionToCommunityAgent(
    processId: string,
    agentId: string
  ): Observable<LabCreateCommunityAgentVersionResDto> {
    return this.apiService.post(
      `${this.baseRoute}/${processId}/add-version-to-community-agent/${agentId}`,
      null,
      LabCreateCommunityAgentVersionResDto
    );
  }

  public getCommunitySpaces(): Observable<LabCommunitySpace[]> {
    return this.apiService.post(`${this.baseRoute}/get-community-available-spaces`, null);
  }

  public addCommunityAgentToProtocol(
    protocolId: string,
    agentVersionId: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-community-agent/${agentVersionId}`,
      null,
      LabProtocolUpdateDTO
    );
  }

  /**
   * Route to add a process (from type) to an existing protocol (can be a sub protocol),
   * and link it to the output of an existing process
   * @param protocolId
   * @param processTypingName
   * @param outputProcessName name of the process to link to
   * @param outputPortName name of the port to link to
   */
  public addProcessConnectedToOutput(
    protocolId: string,
    processTypingName: string,
    outputProcessName: string,
    outputPortName: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-process/${processTypingName}/connected-to-output` +
        `/${outputProcessName}/${outputPortName}`,
      null,
      LabProtocolUpdateDTO
    );
  }

  /**
   * Route to add a process (from type) to an existing protocol (can be a sub protocol),
   * and link it to the output of an existing process
   * @param protocolId
   * @param processTypingName
   * @param inputProcessName name of the process to link to
   * @param inputPortName name of the port to link to
   */
  public addProcessConnectedToInput(
    protocolId: string,
    processTypingName: string,
    inputProcessName: string,
    inputPortName: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-process/${processTypingName}/connected-to-input` +
        `/${inputProcessName}/${inputPortName}`,
      null,
      LabProtocolUpdateDTO
    );
  }

  public deleteProcessInProtocol(
    protocolId: string,
    processInstanceName: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.delete(
      `${this.baseRoute}/${protocolId}/process/${processInstanceName}`,
      LabProtocolUpdateDTO
    );
  }

  public resetProcessInProtocol(
    protocolId: string,
    processInstanceName: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processInstanceName}/reset`,
      null,
      LabProtocolUpdateDTO
    );
  }

  public checkImpactForProcessReset(
    protocolId: string,
    processInstanceName: string
  ): Observable<LabNavigableEntityImpact> {
    return this.apiService.get(
      `${this.baseRoute}/${protocolId}/process/${processInstanceName}/reset/check-impact`,
      LabNavigableEntityImpact
    );
  }

  public runProcessInProtocol(
    protocolId: string,
    processInstanceName: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processInstanceName}/run`,
      null,
      LabProtocolUpdateDTO
    );
  }

  //////////////////////////////////////// CONNECTION /////////////////////////////////////

  public addConnection(
    protocolId: string,
    connection: {
      output_process_name: string;
      output_port_name: string;
      input_process_name: string;
      input_port_name: string;
    }
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/connector`,
      connection,
      LabProtocolUpdateDTO
    );
  }

  public deleteConnection(
    protocolId: string,
    inputProcessName: string,
    inputPortName: string
  ): Observable<void> {
    return this.apiService.delete(
      `${this.baseRoute}/${protocolId}/connector/${inputProcessName}/${inputPortName}`,
      LabProtocolUpdateDTO
    );
  }

  //////////////////////////////////////// CONFIG /////////////////////////////////////

  public saveProcessConfig(
    protocolId: string,
    processInstanceName: string,
    config: PrConfigValues
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processInstanceName}/config`,
      config,
      LabProtocolUpdateDTO
    );
  }

  //////////////////////////////////////// INTERFACE / OUTERFACE /////////////////////////////////////

  public addInterface(
    protocolId: string,
    target_process_name: string,
    target_port_name: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/interface/${target_process_name}/${target_port_name}`,
      null,
      LabProtocolUpdateDTO
    );
  }

  public addOuterface(
    protocolId: string,
    target_process_name: string,
    target_port_name: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/outerface/${target_process_name}/${target_port_name}`,
      null,
      LabProtocolUpdateDTO
    );
  }

  public deleteInterface(protocolId: string, interfaceName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.delete(
      `${this.baseRoute}/${protocolId}/interface/${interfaceName}`,
      LabProtocolUpdateDTO
    );
  }

  public deleteOuterface(protocolId: string, outerfaceName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.delete(
      `${this.baseRoute}/${protocolId}/outerface/${outerfaceName}`,
      LabProtocolUpdateDTO
    );
  }

  //////////////////////////////////////// SPECIFIC PROCESS /////////////////////////////////////

  public addSourceToProcessInput(
    protocolId: string,
    resourceId: string,
    processName: string,
    inputPortName: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-resource/${resourceId}/${processName}/${inputPortName}`,
      null,
      LabProtocolUpdateDTO
    );
  }

  public addSource(protocolId: string, resourceId: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-resource/${resourceId}`,
      null,
      LabProtocolUpdateDTO
    );
  }

  public addTaskOutput(
    protocolId: string,
    processName: string,
    outputPortName: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-output/${processName}/${outputPortName}`,
      null,
      LabProtocolUpdateDTO
    );
  }

  public addScenarioTemplateToProtocol(
    protocolId: string,
    templateId: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-template/${templateId}`,
      null,
      LabProtocolUpdateDTO
    );
  }

  ///////////////////////////////////////////////// LAYOUT /////////////////////////////////////////////////
  public saveLayout(protocolId: string, layout: LabProtocolLayout): Observable<void> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/layout`, layout);
  }

  public saveProcessLayout(
    protocolId: string,
    processName: string,
    layout: LabProcessLayout
  ): Observable<void> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/layout/process/${processName}`, layout);
  }

  public saveInterfaceLayout(
    protocolId: string,
    interfaceName: string,
    layout: LabProcessLayout
  ): Observable<void> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/layout/interface/${interfaceName}`, layout);
  }

  public saveOuterfaceLayout(
    protocolId: string,
    outerfaceName: string,
    layout: LabProcessLayout
  ): Observable<void> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/layout/outerface/${outerfaceName}`, layout);
  }

  ///////////////////////////////// DYNAMIC PORT ///////////////////////////////////////////

  public createDynamicInputPort(protocolId: string, processName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/process/${processName}/dynamic-input`,
      null,
      LabProtocolUpdateDTO
    );
  }

  public createDynamicOutputPort(protocolId: string, processName: string): Observable<LabProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/process/${processName}/dynamic-output`,
      null,
      LabProtocolUpdateDTO
    );
  }

  public deleteDynamicInputPort(
    protocolId: string,
    processName: string,
    portName: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.delete(
      `${this.baseRoute}/${protocolId}/process/${processName}/dynamic-input/${portName}`,
      LabProtocolUpdateDTO
    );
  }

  public deleteDynamicOutputPort(
    protocolId: string,
    processName: string,
    portName: string
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.delete(
      `${this.baseRoute}/${protocolId}/process/${processName}/dynamic-output/${portName}`,
      LabProtocolUpdateDTO
    );
  }

  public updateDynamicInputPort(
    protocolId: string,
    processName: string,
    portName: string,
    ioSpec: TdIOSpec
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processName}/dynamic-input/${portName}`,
      ioSpec,
      LabProtocolUpdateDTO
    );
  }

  public updateDynamicOutputPort(
    protocolId: string,
    processName: string,
    portName: string,
    ioSpec: TdIOSpec
  ): Observable<LabProtocolUpdateDTO> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processName}/dynamic-output/${portName}`,
      ioSpec,
      LabProtocolUpdateDTO
    );
  }

  ///////////////////////////////////////////////// OTHERS /////////////////////////////////////////////////
  public renameProcess(protocolId: string, processName: string, newName: string): Observable<LabProcess> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processName}/rename`,
      { new_name: newName },
      LabProcess
    );
  }

  public updateStyle(protocolId: string, processName: string, style: TdTypeStyle): Observable<LabProcess> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processName}/style`,
      style,
      LabProcess
    );
  }

  ///////////////////////////////////// PROTOCOL TEMPLATE //////////////////////////////////
  public createScenarioTemplate(
    protocolId: string,
    template: LabCreateScenarioTemplateDTO
  ): Observable<LabScenarioTemplate> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/template`, template, LabScenarioTemplate);
  }

  public downloadScenarioTemplate(protocolId: string): Observable<Blob> {
    return this.apiService
      .get(`${this.baseRoute}/${protocolId}/template/download`, null, { responseType: 'blob' })
      .pipe(tap((result) => FlFileHelper.downloadBlob(result, 'scenario-template.json')));
  }
}
