// Record of view type, icon
import {rvDefaultViewTypeInfos, RvResourceViewTypeInfo} from '@monorepo/resource-view';
import {
  LabResourceViewSpreadsheetComponent
} from '../../../entity-module/lab-resource-core/component/lab-resource-view-spreadsheet/lab-resource-view-spreadsheet.component';
import {
  LabResourceViewTextComponent
} from '../../../entity-module/lab-resource-core/component/lab-resource-view-text/lab-resource-view-text.component';
import {
  LabResourceViewListComponent
} from '../../../entity-module/lab-resource-core/component/lab-resource-view-list/lab-resource-view-list.component';
import {
  LabResourceViewFolderComponent
} from '../../../entity-module/lab-resource-core/component/lab-resource-view-folder/lab-resource-view-folder.component';
import {
  LabResourceRichTextViewComponent
} from '../../../entity-module/lab-resource-core/component/lab-resource-rich-text-view/lab-resource-rich-text-view.component';

export const labConstResourceViewTypeInfos: Record<string, RvResourceViewTypeInfo> = {
  ...rvDefaultViewTypeInfos,
  // override the table view to add functionalities like chart from api
  'table-view': {
    icon: 'calendar_view_month',
    text: 'rvResourceView.resource_view_spreadsheet',
    viewComponent: LabResourceViewSpreadsheetComponent,
    image: {
      lightTheme: 'assets/views/light/tabular-view.svg',
      darkTheme: 'assets/views/dark/tabular-view.svg',
    }
  },
  // override the table view to add functionalities like chart from api
  'tabular-view': {
    icon: 'calendar_view_month',
    text: 'rvResourceView.resource_view_spreadsheet',
    viewComponent: LabResourceViewSpreadsheetComponent,
    image: {
      lightTheme: 'assets/views/light/tabular-view.svg',
      darkTheme: 'assets/views/dark/tabular-view.svg',
    }
  },
  // override the table view to add functionalities like chart from api
  'dataset-view': {
    icon: 'calendar_view_month',
    text: 'rvResourceView.resource_view_dataset_view',
    viewComponent: LabResourceViewSpreadsheetComponent,
    image: {
      lightTheme: 'assets/views/light/tabular-view.svg',
      darkTheme: 'assets/views/dark/tabular-view.svg',
    }
  },
  // override the text view to enable pagination
  'text-view': {
    icon: 'text_snippet',
    text: 'rvResourceView.resource_view_text',
    viewComponent: LabResourceViewTextComponent,
    image: null
  },
  view: {
    icon: 'view_quilt',
    text: 'biox.resource_view_base',
    viewComponent: null,
    image: {
      lightTheme: 'assets/views/light/default-view.svg',
      darkTheme: 'assets/views/dark/default-view.svg',
    }
  },
  'resources-list-view': {
    icon: 'format_list_bulleted',
    text: 'biox.resource_view_resources_list',
    viewComponent: LabResourceViewListComponent,
    image: null
  },
  'folder-view': {
    icon: 'folder',
    text: 'biox.resource_view_folder',
    viewComponent: LabResourceViewFolderComponent,
    image: null
  },
  'rich-text-view':{
    icon: 'report',
    text: 'biox.report',
    viewComponent: LabResourceRichTextViewComponent,
    image: null
  }
};

