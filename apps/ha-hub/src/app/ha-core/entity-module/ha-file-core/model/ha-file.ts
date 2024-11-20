import { TeBlockFileUploadResponse } from '@monorepo/text-editor';

export enum HaFileType {
  FILE = 'FILE',
  IMAGE = 'IMAGE',
  RESOURCE_VIEW = 'RESOURCE_VIEW',
}

export class HaFile implements TeBlockFileUploadResponse {
  id: string;

  name: string;

  size: number;

  type?: HaFileType;
}
