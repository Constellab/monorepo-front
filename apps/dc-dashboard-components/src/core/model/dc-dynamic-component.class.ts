import { EventEmitter } from '@angular/core';

/**
 * Auth info for the dc components
 * This info is provided in the init data of the dc components
 */
export interface DcAuthenticationInfo {
  app_id: string;
  user_access_token: string;
}

/**
 * List of available dynamic components
 */
export enum DcDynamicComponentEnum {
  SELECT_RESOURCE = 'select-resource',
  TEXT_EDITOR = 'text-editor',
  PROCESS_CONFIG = 'process-config',
}


/**
 * Object passed to the dashboard components from the streamlit back
 */
export interface DcComponentData<T = any> {
  /**
   * Object provided if the component supports lab api calls
   */
  authentication_info?: DcAuthenticationInfo;

  /**
   * Class of the component container html element in main streamlit app
   */
  container_class: string;
  /**
   * Which component to load
   */
  component: DcDynamicComponentEnum;
  /**
   * Data for the component specific to the component type
   */
  component_data?: T;
}

/**
 * Interface for dynamic components
 */
export interface DcDynamicComponent<INPUT= any, OUTPUT = any> {
  inputData: DcComponentData<INPUT>;
  outputEvent: EventEmitter<OUTPUT>;
}

/**
 * Object passed to the dynamic components service to listen to DcDynamicComponent
 * output and call setComponentValue
 */
export interface DcDynamicComponentEvent {
  setComponentValue(jsonData: any): void;
}

