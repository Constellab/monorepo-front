import { Component, Signal, inject } from '@angular/core';
import { CaChatState } from '../ca-chat.state';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import {
  CaHierarchyObject,
  CaHierarchyObjectWithChildren,
} from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { FlLoaderModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { CaHierarchyObjectTreeComponent } from '../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-tree/ca-hierarchy-object-tree.component';
import { RouterOutlet } from '@angular/router';
import { FlCoreComponentModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-core-component/fl-core-component.module';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

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
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaChatPageComponent {
  isLoading: Signal<boolean>;
  folders$: Observable<CaHierarchyObjectWithChildren[]>;

  selectedObjectId$: Observable<string>;

  getRoute: (node: CaHierarchyObject) => string = (node: CaHierarchyObject) => {
    return CaRouterService.getChatFolderRoute(node.id);
  };

  constructor() {
    const state = inject(CaChatState);

    state.init();
    this.folders$ = toObservable(state.folders);
    this.isLoading = state.isLoading;
    this.selectedObjectId$ = state.getSelectedFolderId$();
  }
}
