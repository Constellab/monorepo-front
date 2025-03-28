import { ClPage, clRxjsDebug } from '@monorepo/core-lib';
import { CoCreateAgentFormData } from '@monorepo/community-lib';
import { FlApiWithCacheService } from '@monorepo/front-core-lib/fl-api';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { Injectable, inject } from '@angular/core';
import {
  LiAgent,
  LiAgentDatasourcePaginated,
  LiCreateCommunityAgentVersionResDto,
} from '../model/entities/li-agent.entity';
import { LiCommunitySpace } from '../model/entities/li-community-space.entity';
import {
  LiCreateScenarioTemplateDTO,
  LiScenarioTemplate,
} from '../model/entities/process/li-scenario-template.entity';
import { LiNavigableEntityImpact } from '../model/entities/li-navigable-entity.entity';
import { LiProcess } from '../model/entities/process/li-process.entity';
import { LiProcessLayout, LiProtocol } from '../model/entities/process/li-protocol.entity';
import { LiProtocolUpdateDTO } from '../model/entities/process/li-workflow-action.class';
import { Observable, tap } from 'rxjs';
import {
  TdEditParamSpecDict,
  TdIOSpec,
  TdParamSpec,
  TdParamSpecVisibility,
  TdParamSpecsValues,
  TdTypeStyle,
} from '@monorepo/technical-doc';

@Injectable({
  providedIn: 'root',
})
export class LiProtocolService {
  private apiService = inject(FlApiWithCacheService);

  private readonly baseRoute: string = 'protocol';

  public getProtocol(protocolId: string): Observable<LiProtocol> {
    return this.apiService.get(`${this.baseRoute}/${protocolId}`, LiProtocol);
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
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-process/${processTypingName}`,
      null,
      LiProtocolUpdateDTO
    );
  }

  public addEmptyProtocolToProtocol(protocolId: string): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-empty-protocol`,
      null,
      LiProtocolUpdateDTO
    );
  }

  public addDuplicateProcessToProtocol(
    protocolId: string,
    processInstanceName: string
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/duplicate-process/${processInstanceName}`,
      null,
      LiProtocolUpdateDTO
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
  ): Observable<ClPage<LiAgent>> {
    return this.apiService.post(
      `${this.baseRoute}/get-community-available-agents`,
      { spacesFilter: spacesFilter, titleFilter: titleFilter, personalOnly: personalOnly },
      LiAgent,
      { page: page, pageSize: size, resultIsPaginated: true }
    );
  }

  public getCommunityAvailableAgentsWithFiltersPaginated(
    spacesFilter: string[],
    titleFilter: string,
    personalOnly: boolean = false
  ): LiAgentDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size) =>
        this.getAllCommunityAgentsWithFilters(spacesFilter, titleFilter, personalOnly, page, size),
      10
    );
  }

  public getCurrentAgent(agentVersionId: string): Observable<LiAgent> {
    return this.apiService.get(`${this.baseRoute}/get-current-agent/${agentVersionId}`, LiAgent);
  }

  public getCurrentAgentAndCheckRights(agentVersionId: string): Observable<LiAgent> {
    return this.apiService.get(
      `${this.baseRoute}/get-current-agent-and-check-rights/${agentVersionId}`,
      LiAgent
    );
  }

  public createCommunityAgent(
    processId: string,
    formData: CoCreateAgentFormData
  ): Observable<LiCreateCommunityAgentVersionResDto> {
    return this.apiService.post(
      `${this.baseRoute}/${processId}/create-community-agent`,
      formData,
      LiCreateCommunityAgentVersionResDto
    );
  }

  public forkIntoNewCommunityAgent(
    processId: string,
    formData: CoCreateAgentFormData,
    agentVersionId: string
  ): Observable<LiCreateCommunityAgentVersionResDto> {
    return this.apiService.post(
      `${this.baseRoute}/${processId}/fork-community-agent/${agentVersionId}`,
      formData,
      LiCreateCommunityAgentVersionResDto
    );
  }

  public addVersionToCommunityAgent(
    processId: string,
    agentId: string
  ): Observable<LiCreateCommunityAgentVersionResDto> {
    return this.apiService.post(
      `${this.baseRoute}/${processId}/add-version-to-community-agent/${agentId}`,
      null,
      LiCreateCommunityAgentVersionResDto
    );
  }

  public getCommunitySpaces(): Observable<LiCommunitySpace[]> {
    return this.apiService.post(`${this.baseRoute}/get-community-available-spaces`, null);
  }

  public addCommunityAgentToProtocol(
    protocolId: string,
    agentVersionId: string
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-community-agent/${agentVersionId}`,
      null,
      LiProtocolUpdateDTO
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
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-process/${processTypingName}/connected-to-output` +
        `/${outputProcessName}/${outputPortName}`,
      null,
      LiProtocolUpdateDTO
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
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-process/${processTypingName}/connected-to-input` +
        `/${inputProcessName}/${inputPortName}`,
      null,
      LiProtocolUpdateDTO
    );
  }

  public deleteProcessInProtocol(
    protocolId: string,
    processInstanceName: string
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.delete(
      `${this.baseRoute}/${protocolId}/process/${processInstanceName}`,
      LiProtocolUpdateDTO
    );
  }

  public resetProcessInProtocol(
    protocolId: string,
    processInstanceName: string
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processInstanceName}/reset`,
      null,
      LiProtocolUpdateDTO
    );
  }

  public checkImpactForProcessReset(
    protocolId: string,
    processInstanceName: string
  ): Observable<LiNavigableEntityImpact> {
    return this.apiService.get(
      `${this.baseRoute}/${protocolId}/process/${processInstanceName}/reset/check-impact`,
      LiNavigableEntityImpact
    );
  }

  public runProcessInProtocol(
    protocolId: string,
    processInstanceName: string
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processInstanceName}/run`,
      null,
      LiProtocolUpdateDTO
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
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/connector`, connection, LiProtocolUpdateDTO);
  }

  public deleteConnection(
    protocolId: string,
    inputProcessName: string,
    inputPortName: string
  ): Observable<void> {
    return this.apiService.delete(
      `${this.baseRoute}/${protocolId}/connector/${inputProcessName}/${inputPortName}`,
      LiProtocolUpdateDTO
    );
  }

  //////////////////////////////////////// CONFIG /////////////////////////////////////

  public saveProcessConfig(
    protocolId: string,
    processInstanceName: string,
    config: TdParamSpecsValues
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processInstanceName}/config`,
      config,
      LiProtocolUpdateDTO
    );
  }

  //////////////////////////////////////// INTERFACE / OUTERFACE /////////////////////////////////////

  public addInterface(
    protocolId: string,
    target_process_name: string,
    target_port_name: string
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/interface/${target_process_name}/${target_port_name}`,
      null,
      LiProtocolUpdateDTO
    );
  }

  public addOuterface(
    protocolId: string,
    target_process_name: string,
    target_port_name: string
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/outerface/${target_process_name}/${target_port_name}`,
      null,
      LiProtocolUpdateDTO
    );
  }

  public deleteInterface(protocolId: string, interfaceName: string): Observable<LiProtocolUpdateDTO> {
    return this.apiService.delete(
      `${this.baseRoute}/${protocolId}/interface/${interfaceName}`,
      LiProtocolUpdateDTO
    );
  }

  public deleteOuterface(protocolId: string, outerfaceName: string): Observable<LiProtocolUpdateDTO> {
    return this.apiService.delete(
      `${this.baseRoute}/${protocolId}/outerface/${outerfaceName}`,
      LiProtocolUpdateDTO
    );
  }

  //////////////////////////////////////// SPECIFIC PROCESS /////////////////////////////////////

  public addSourceToProcessInput(
    protocolId: string,
    resourceId: string,
    processName: string,
    inputPortName: string
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-resource/${resourceId}/${processName}/${inputPortName}`,
      null,
      LiProtocolUpdateDTO
    );
  }

  public addSource(protocolId: string, resourceId: string): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-resource/${resourceId}`,
      null,
      LiProtocolUpdateDTO
    );
  }

  public addTaskOutput(
    protocolId: string,
    processName: string,
    outputPortName: string
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-output/${processName}/${outputPortName}`,
      null,
      LiProtocolUpdateDTO
    );
  }

  public addScenarioTemplateToProtocol(
    protocolId: string,
    templateId: string
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/add-template/${templateId}`,
      null,
      LiProtocolUpdateDTO
    );
  }

  ///////////////////////////////////////////////// LAYOUT /////////////////////////////////////////////////

  public saveProcessLayout(
    protocolId: string,
    processName: string,
    layout: LiProcessLayout
  ): Observable<void> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/layout/process/${processName}`, layout);
  }

  public saveInterfaceLayout(
    protocolId: string,
    interfaceName: string,
    layout: LiProcessLayout
  ): Observable<void> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/layout/interface/${interfaceName}`, layout);
  }

  public saveOuterfaceLayout(
    protocolId: string,
    outerfaceName: string,
    layout: LiProcessLayout
  ): Observable<void> {
    return this.apiService.put(`${this.baseRoute}/${protocolId}/layout/outerface/${outerfaceName}`, layout);
  }

  ///////////////////////////////// DYNAMIC PORT ///////////////////////////////////////////

  public createDynamicInputPort(protocolId: string, processName: string): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/process/${processName}/dynamic-input`,
      null,
      LiProtocolUpdateDTO
    );
  }

  public createDynamicOutputPort(protocolId: string, processName: string): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/process/${processName}/dynamic-output`,
      null,
      LiProtocolUpdateDTO
    );
  }

  public deleteDynamicInputPort(
    protocolId: string,
    processName: string,
    portName: string
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.delete(
      `${this.baseRoute}/${protocolId}/process/${processName}/dynamic-input/${portName}`,
      LiProtocolUpdateDTO
    );
  }

  public deleteDynamicOutputPort(
    protocolId: string,
    processName: string,
    portName: string
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.delete(
      `${this.baseRoute}/${protocolId}/process/${processName}/dynamic-output/${portName}`,
      LiProtocolUpdateDTO
    );
  }

  public updateDynamicInputPort(
    protocolId: string,
    processName: string,
    portName: string,
    ioSpec: TdIOSpec
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processName}/dynamic-input/${portName}`,
      ioSpec,
      LiProtocolUpdateDTO
    );
  }

  public updateDynamicOutputPort(
    protocolId: string,
    processName: string,
    portName: string,
    ioSpec: TdIOSpec
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processName}/dynamic-output/${portName}`,
      ioSpec,
      LiProtocolUpdateDTO
    );
  }

  ///////////////////////////////////////////////// OTHERS /////////////////////////////////////////////////
  public renameProcess(protocolId: string, processName: string, newName: string): Observable<LiProcess> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processName}/rename`,
      { new_name: newName },
      LiProcess
    );
  }

  public updateStyle(protocolId: string, processName: string, style: TdTypeStyle): Observable<LiProcess> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processName}/style`,
      style,
      LiProcess
    );
  }

  public updateCommunityAgentCodeParamsVisibility(
    protocolId: string,
    processName: string,
    visibility: TdParamSpecVisibility
  ): Observable<LiProcess> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processName}/code-params-visibility/${visibility}`,
      null,
      LiProcess
    );
  }

  ///////////////////////////////////////////////// PARAM SPEC /////////////////////////////////////////////

  public getParamSpecsInfos(protocolId: string, processName: string): Observable<TdEditParamSpecDict> {
    return this.apiService
      .get(`${this.baseRoute}/${protocolId}/process/${processName}/get-param-spec-types`)
      .pipe(clRxjsDebug());
  }

  public addDynamicParamSpec(
    protocolId: string,
    processName: string,
    configSpecName: string,
    name: string,
    paramSpec: TdParamSpec
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.post(
      `${this.baseRoute}/${protocolId}/process/${processName}/${configSpecName}/dynamic-param-spec/${name}`,
      paramSpec,
      LiProtocolUpdateDTO
    );
  }

  public updateDynamicParamSpec(
    protocolId: string,
    processName: string,
    configSpecName: string,
    name: string,
    paramSpec: TdParamSpec
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processName}/${configSpecName}/dynamic-param-spec/${name}`,
      paramSpec,
      LiProtocolUpdateDTO
    );
  }

  public renameAndUpdateDynamicParamSpec(
    protocolId: string,
    processName: string,
    configSpecName: string,
    oldName: string,
    name: string,
    paramSpec: TdParamSpec
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.put(
      `${this.baseRoute}/${protocolId}/process/${processName}/${configSpecName}` +
        `/dynamic-param-spec/${oldName}/rename-and-update/${name}`,
      paramSpec,
      LiProtocolUpdateDTO
    );
  }

  public deleteDynamicParamSpec(
    protocolId: string,
    processName: string,
    configSpecName: string,
    name: string
  ): Observable<LiProtocolUpdateDTO> {
    return this.apiService.delete(
      `${this.baseRoute}/${protocolId}/process/${processName}/${configSpecName}/dynamic-param-spec/${name}`,
      LiProtocolUpdateDTO
    );
  }

  ///////////////////////////////////////////////// PROTOCOL TEMPLATE ///////////////////////////////////////
  public createScenarioTemplate(
    protocolId: string,
    template: LiCreateScenarioTemplateDTO
  ): Observable<LiScenarioTemplate> {
    return this.apiService.post(`${this.baseRoute}/${protocolId}/template`, template, LiScenarioTemplate, {
      serialization: LiCreateScenarioTemplateDTO,
    });
  }

  public downloadScenarioTemplate(protocolId: string): Observable<Blob> {
    return this.apiService
      .get(`${this.baseRoute}/${protocolId}/template/download`, null, { responseType: 'blob' })
      .pipe(tap((result) => FlFileHelper.downloadBlob(result, 'scenario-template.json')));
  }
}
