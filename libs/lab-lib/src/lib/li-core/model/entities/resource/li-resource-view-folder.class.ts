import { RvResourceViewBase } from '@monorepo/resource-view';

export interface LiResourceViewFolder extends RvResourceViewBase {
  type: 'folder-view';
  data: LiResourceViewFolderData;
}

export interface LiResourceViewFolderData {
  path: string;
  content: LiResourceViewFolderContent;
}

export interface LiResourceViewFolderContent {
  name: string;

  // if present, it means a symbolic node already exist
  resource_model_id?: string;

  // if there are children, this is a folder, otherwise this is a file
  children?: LiResourceViewFolderContent[];
}

export interface LiResourceViewFolderContentTree {
  id: string;
  name: string;
  resource_model_id?: string;
  isLoading: boolean;
  isFolder: boolean;
}
