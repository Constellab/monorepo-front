// Record of view type, icon
import { rvDefaultViewTypeInfos, RvResourceViewTypeInfo } from '@monorepo/resource-view';
import { LabResourceViewSpreadsheetComponent } from '../../../entity-module/lab-resource-core/component/lab-resource-view-spreadsheet/lab-resource-view-spreadsheet.component';
import { LabResourceViewTextComponent } from '../../../entity-module/lab-resource-core/component/lab-resource-view-text/lab-resource-view-text.component';
import { LabResourceViewListComponent } from '../../../entity-module/lab-resource-core/component/lab-resource-view-list/lab-resource-view-list.component';
import { LabResourceViewFolderComponent } from '../../../entity-module/lab-resource-core/component/lab-resource-view-folder/lab-resource-view-folder.component';
import { LabResourceRichTextViewComponent } from '../../../entity-module/lab-resource-core/component/lab-resource-rich-text-view/lab-resource-rich-text-view.component';

export const labConstResourceViewTypeInfos: Record<string, RvResourceViewTypeInfo> = {
  ...rvDefaultViewTypeInfos,
  // override the table view to add functionalities like chart from api
  'table-view': {
    viewComponent: LabResourceViewSpreadsheetComponent,
  },
  // override the table view to add functionalities like chart from api
  'tabular-view': {
    viewComponent: LabResourceViewSpreadsheetComponent,
  },
  // override the table view to add functionalities like chart from api
  'dataset-view': {
    viewComponent: LabResourceViewSpreadsheetComponent,
  },
  // override the text view to enable pagination
  'text-view': {
    viewComponent: LabResourceViewTextComponent,
  },
  view: {
    viewComponent: null,
  },
  'resources-list-view': {
    viewComponent: LabResourceViewListComponent,
  },
  'folder-view': {
    viewComponent: LabResourceViewFolderComponent,
  },
  'rich-text-view': {
    viewComponent: LabResourceRichTextViewComponent,
  },
};
