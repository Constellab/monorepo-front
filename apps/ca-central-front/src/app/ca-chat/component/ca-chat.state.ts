import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { CaHierarchyObjectWithChildren } from '../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaFolderService } from '../../ca-core/service-api/ca-folder.service';

/**
 * Global state for the chat page
 */
@Injectable()
export class CaChatState {

  private folderTree: WritableSignal<CaHierarchyObjectWithChildren[]>;


  constructor(private folderService: CaFolderService) {
  }

  public init(): void {
    this.folderTree = signal([]);
    this.folderService.getChatRootFolders().subscribe(
      folders => this.getFolderTreeSuccess(folders)
    );
  }

  public get folders(): Signal<CaHierarchyObjectWithChildren[]> {
    return this.folderTree;
  }

  private getFolderTreeSuccess(folders: CaHierarchyObjectWithChildren[]): void {
    this.folderTree.set(folders);
  }
}
