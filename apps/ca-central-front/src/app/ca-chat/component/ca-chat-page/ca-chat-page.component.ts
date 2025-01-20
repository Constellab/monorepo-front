import { Component, Signal } from '@angular/core';
import { CaChatState } from '../ca-chat.state';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import {
  CaHierarchyObject,
  CaHierarchyObjectWithChildren,
} from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
    selector: 'ca-chat-page',
    templateUrl: './ca-chat-page.component.html',
    styleUrl: './ca-chat-page.component.scss',
    providers: [CaChatState],
    standalone: false
})
export class CaChatPageComponent {
  isLoading: Signal<boolean>;
  folders$: Observable<CaHierarchyObjectWithChildren[]>;

  selectedObjectId$: Observable<string>;

  getRoute: (node: CaHierarchyObject) => string = (node: CaHierarchyObject) => {
    return CaRouterService.getChatFolderRoute(node.id);
  };

  constructor(state: CaChatState) {
    state.init();
    this.folders$ = toObservable(state.folders);
    this.isLoading = state.isLoading;
    this.selectedObjectId$ = state.getSelectedFolderId$();
  }
}
