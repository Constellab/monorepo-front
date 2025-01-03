import { LabProcessType } from '../entities/lab-type/lab-process-type.entity';
import { PrConfigValues } from '@monorepo/protocol';

export interface LabTransformForm {
  transformer: LabProcessType;
  config: {
    public: PrConfigValues;
    protected: PrConfigValues;
  };
}

export interface LabTransformerWithConfig {
  transformer: LabProcessType;
  config: PrConfigValues;
}

export interface LabTransformerParams {
  typing_name: string;
  config_values: PrConfigValues;
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
