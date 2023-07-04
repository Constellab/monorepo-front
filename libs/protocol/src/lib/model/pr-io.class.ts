import {TdIOSpec} from '@monorepo/technical-doc';


export interface PrOI {
  /**
   * list of the ports of the input/output
   */
  ports: Record<string, PrPort>;

  /**
   * If true, input and output ports are dynamic (can be added or removed)
   */
  is_dynamic: boolean;
}

/**
 * Spec for the input or output of a process
 */
export interface PrPort {

  resource_id?: string;

  specs: TdIOSpec;

}
