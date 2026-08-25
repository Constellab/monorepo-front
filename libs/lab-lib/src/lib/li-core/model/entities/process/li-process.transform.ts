import { ClCoreJsonConvert, ClTransformFnParams } from '@monorepo/core-lib';
import { Transform } from 'class-transformer';

import { LiProcess } from './li-process.entity';
import { LiProtocol } from './li-protocol.entity';
import { LiTask } from './li-task.entity';

/**
 * Method to instantiate the correct process object when getting it from DB
 * @param json
 */
export function liInstantiateProcess(json: any): LiProcess | null {
  if (json === null) return null;
  // if this is a resource file
  if (json.is_protocol) {
    return ClCoreJsonConvert.deserializeObject(json, LiProtocol);
  } else {
    return ClCoreJsonConvert.deserializeObject(json, LiTask);
  }
}

export function liProcessTransform(): PropertyDecorator {
  const transformToPlain = Transform(
    (params: ClTransformFnParams) => ClCoreJsonConvert.instanceToPlain(params.value),
    { toPlainOnly: true }
  );

  const transformToClass = Transform((params: ClTransformFnParams) => liInstantiateProcess(params.value), {
    toClassOnly: true,
  });

  return (target: any, key: string): void => {
    transformToPlain(target, key);
    transformToClass(target, key);
  };
}
