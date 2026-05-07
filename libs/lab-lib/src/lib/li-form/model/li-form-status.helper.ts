import { FlStatus, FlStatusDict, FlStatusHelper } from '@monorepo/front-core-lib/fl-status';

import { LiFormStatus } from './li-form.enum';

export const LI_FORM_STATUS_DICT: FlStatusDict<LiFormStatus> = {
  DRAFT: FlStatusHelper.getDraftStatus('DRAFT', 'li.form_status_DRAFT'),
  SUBMITTED: FlStatusHelper.getSuccessStatus('SUBMITTED', 'li.form_status_SUBMITTED'),
};

export function liGetFormStatus(status: LiFormStatus): FlStatus<LiFormStatus> {
  return LI_FORM_STATUS_DICT[status];
}
