import { LabProcessType } from '../entities/lab-type/lab-process-type.entity';
import { TdParamSpecsValues } from '@monorepo/technical-doc';

export interface LabTransformForm {
  transformer: LabProcessType;
  config: {
    public: TdParamSpecsValues;
    protected: TdParamSpecsValues;
  };
}

export interface LabTransformerWithConfig {
  transformer: LabProcessType;
  config: TdParamSpecsValues;
}

export interface LabTransformerParams {
  typing_name: string;
  config_values: TdParamSpecsValues;
}

export function labConvertTransformFormToParams(formValue: LabTransformForm[]): LabTransformerParams[] {
  const transformers: LabTransformerParams[] = [];
  for (const form of formValue) {
    transformers.push({
      typing_name: form.transformer.typingName,
      config_values: { ...form.config.public, ...form.config.protected },
    });
  }
  return transformers;
}
