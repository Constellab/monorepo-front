import { FlDatasourcePaginated, FlEntity } from '@monorepo/front-core-lib/fl-core';

export interface FlUser extends FlEntity {
  alias: string;

  firstname: string;

  lastname: string;

  photo?: string;

  email?: string;

  company?: string;

  activity?: string;
}

export type FlUserDatasource<F = void> = FlDatasourcePaginated<FlUser, F>;
