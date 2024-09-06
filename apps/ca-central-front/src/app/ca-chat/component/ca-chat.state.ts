import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { CaFolderWithChildren } from '../../ca-core/model/entities/project/ca-folder.class';
import { CaProjectService } from '../../ca-core/service-api/ca-project.service';

/**
 * Global state for the chat page
 */
@Injectable()
export class CaChatState {

  private folderTree: WritableSignal<CaFolderWithChildren[]>;


  constructor(private projectService: CaProjectService) {
  }

  public init(): void {
    this.folderTree = signal([]);
    this.projectService.getChatRootFolders().subscribe(
      folders => this.getProjectFolderTreeSuccess(folders)
    );
  }

  public get folders(): Signal<CaFolderWithChildren[]> {
    return this.folderTree;
  }

  private getProjectFolderTreeSuccess(folders: CaFolderWithChildren[]): void {
    this.folderTree.set(folders);
  }
}
