import { Component, inject, Signal } from '@angular/core';
import { CaChatState } from '../ca-chat.state';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import {
  CaChatFolder,
  CaHierarchyObjectsTreeDatasource,
} from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { Observable } from 'rxjs';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { CaHierarchyObjectTreeComponent } from '../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-tree/ca-hierarchy-object-tree.component';
import { RouterOutlet } from '@angular/router';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ca-chat-page',
  templateUrl: './ca-chat-page.component.html',
  styleUrl: './ca-chat-page.component.scss',
  providers: [CaChatState],
  imports: [
    FlLoaderModule,
    CaHierarchyObjectTreeComponent,
    RouterOutlet,
    FlCoreComponentModule,
    TranslatePipe,
    AsyncPipe,
  ],
})
export class CaChatPageComponent {
  isLoading: Signal<boolean>;
  folders: CaHierarchyObjectsTreeDatasource;
  isEmpty$: Observable<boolean>;

  selectedObjectId$: Observable<string>;

  getRoute: (node: CaChatFolder) => string = (node: CaChatFolder) => {
    if (node.chatEnabled) {
      return CaRouterService.getChatFolderRoute(node.id);
    } else {
      // disable the link for the folders that are not chat enabled
      return null;
    }
  };

  constructor() {
    const state = inject(CaChatState);

    state.init();
    this.folders = state.getFolders();
    this.isEmpty$ = this.folders.isEmpty$();
    this.isLoading = state.isLoading;
    this.selectedObjectId$ = state.getSelectedFolderId$();
  }
}
