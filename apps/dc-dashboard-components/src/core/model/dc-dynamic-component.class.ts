import { EventEmitter, OutputEmitterRef, Signal } from '@angular/core';

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
  MENU_BUTTON = 'menu-button',
  TREE_MENU = 'tree-menu',
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
   * Unique id of the component data
   */
  timestamp: number;
  /**
   * Data for the component specific to the component type
   */
  component_data?: T;
}

/**
 * Interface for dynamic components
 */
export interface DcDynamicComponent<INPUT = any, OUTPUT = any> {
  inputData: INPUT | Signal<INPUT>;
  authenticationInfo?: DcAuthenticationInfo | Signal<DcAuthenticationInfo>;
  outputEvent: EventEmitter<OUTPUT> | OutputEmitterRef<OUTPUT>;
}

/**
 * Object passed to the dynamic components service to listen to DcDynamicComponent
 * output and call setComponentValue
 */
export interface DcDynamicComponentEvent {
  setComponentValue(jsonData: any): void;
}

/**
 * Parses a JSON string input into an object. This is used when the
 * component is converted to an custom element and inputs are passed as strings.
 * @param value The input value to parse.
 * @returns The parsed object or the original value if not a string.
 */
export function dcParseJsonInput(value: string | any): any {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error('Failed to parse inputData as JSON:', e);
      throw e;
    }
  }
  return value;
}
