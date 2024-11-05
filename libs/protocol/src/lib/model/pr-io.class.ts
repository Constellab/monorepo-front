import { TdIOSpec } from '@monorepo/technical-doc';

export interface PrOI {
  /**
   * list of the ports of the input/output
   */
  ports: Record<string, PrPort>;

  /**
   * dynamic: ports are dynamic (can be added or removed)
   */
  type: 'normal' | 'dynamic';

  /**
   * Additional info based on type
   */
  additional_info?: Record<string, any>;
}

/**
 * Spec for the input or output of a process
 */
export interface PrPort {
  resource_id?: string;

  specs: TdIOSpec;
}
