import { FlStatus, FlStatusDict, FlStatusHelper } from '@monorepo/front-core-lib/fl-status';

import { LiFormTemplateVersionStatus } from '../../li-core/model/entities/form/li-form.enum';

export const LI_FORM_TEMPLATE_VERSION_STATUS_DICT: FlStatusDict<LiFormTemplateVersionStatus> = {
  DRAFT: FlStatusHelper.getDraftStatus('DRAFT', 'li.form_version_status_DRAFT'),
  PUBLISHED: FlStatusHelper.getSuccessStatus('PUBLISHED', 'li.form_version_status_PUBLISHED'),
  ARCHIVED: FlStatusHelper.getInfoStatus(
    'ARCHIVED',
    'li.form_version_status_ARCHIVED',
    FlStatusHelper.archivedIcon
  ),
};

export function liGetFormTemplateVersionStatus(
  status: LiFormTemplateVersionStatus
): FlStatus<LiFormTemplateVersionStatus> {
  return LI_FORM_TEMPLATE_VERSION_STATUS_DICT[status];
}
