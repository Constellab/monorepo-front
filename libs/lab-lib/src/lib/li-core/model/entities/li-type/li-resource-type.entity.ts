import { TdResourceMethodList, TdResourceType } from '@monorepo/technical-doc';

import { LiTypeEntity } from './li-type.entity';

export class LiResourceType extends LiTypeEntity {
  variables: Record<string, any>;
  methods: TdResourceMethodList;

  public toTypeEntity(): TdResourceType {
    return {
      ...super.toTypeEntity(),
      variables: this.variables,
      methods: this.methods,
    };
  }
}
