import { ClTheme } from '@monorepo/core-lib';
import { DcComponentData } from '../model/dc-dynamic-component.class';

/**
 * Every message between iframe and parent must use this type to filter them
 */
export const dcIframeEventType = 'gws-streamlit-component-message';

export enum DcIframeEventAction {
  /**
   * Event from iframe to parent to declare the iframe is ready
   * After the parent create the component beside the iframe
   */
  INIT = 'init',
  /**
   * Event from parent to iframe to set the component value
   * It is transferred to the iframe so it can trigger the Streamlit.setComponentValue
   * from iframe to streamlit update the component value
   */
  SET_COMPONENT_VALUE = 'set-component-value',
}

/**
 * Object that represent the messages sent from the iframe to the parent
 * to initialize the component
 */
export interface DcIframeEventInitData {
  componentData: DcComponentData;
  theme: ClTheme;
}

/**
 * Object that represent the messages sent from the iframe to the parent
 */
export type DcIframeToMainEvent = {
  type: typeof dcIframeEventType;
  action: DcIframeEventAction.INIT;
  data: DcIframeEventInitData;
};

/**
 * Object that represent the messages sent from the parent to the iframe
 */
export type DcMainToIframeEvent = {
  type: typeof dcIframeEventType;
  action: DcIframeEventAction.SET_COMPONENT_VALUE;
  data: any;
};

/**
 * Get the host of the iframe message to filter the origin
 */
export function dcGetIframeMessageHost(): string {
  const location = window.location;
  if (location.hostname === 'localhost') return '*';
  return `${location.protocol}//${location.hostname}`;
}
