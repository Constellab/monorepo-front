import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaHierarchyObject } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';


@Component({
  selector: 'ca-folder-chat-right-panel',
  templateUrl: './ca-folder-chat-right-panel.component.html',
  styleUrls: ['./ca-folder-chat-right-panel.component.scss']
})
export class CaFolderChatRightPanelComponent implements OnInit{

  @Input({ required: true }) folderId: string;

  folder$: Observable<CaHierarchyObject>;

  chatDetailRoute: string;

  constructor(private state: CaHierarchyObjectDetailState) {
  }

  ngOnInit(): void {
    this.folder$ = this.state.getFolder$(this.folderId);
    this.chatDetailRoute = CaRouterService.getChatFolderRoute(this.folderId);
  }



}
