import { TdParamSpecsValues } from '@monorepo/technical-doc';

import { LiProcessType } from '../entities/li-type/li-process-type.entity';

export interface LiTransformForm {
  transformer: LiProcessType;
  config: {
    public: TdParamSpecsValues;
    protected: TdParamSpecsValues;
  };
}

export interface LiTransformerWithConfig {
  transformer: LiProcessType;
  config: TdParamSpecsValues;
}

export interface LiTransformerParams {
  typing_name: string;
  config_values: TdParamSpecsValues;
}

export function liConvertTransformFormToParams(formValue: LiTransformForm[]): LiTransformerParams[] {
  const transformers: LiTransformerParams[] = [];
  for (const form of formValue) {
    transformers.push({
      typing_name: form.transformer.typingName,
      config_values: { ...form.config.public, ...form.config.protected },
    });
  }
  return transformers;
}
