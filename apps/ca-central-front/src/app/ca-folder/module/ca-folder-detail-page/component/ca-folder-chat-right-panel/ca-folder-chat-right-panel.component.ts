import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaHierarchyObject } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';
import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CaChatFolderComponent } from '../../../../../ca-core/entity-module/ca-chat-core/component/ca-chat-folder/ca-chat-folder.component';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-folder-chat-right-panel',
  templateUrl: './ca-folder-chat-right-panel.component.html',
  styleUrls: ['./ca-folder-chat-right-panel.component.scss'],
  imports: [
    CaHierarchyObjectIconComponent,
    MatAnchor,
    RouterLink,
    CaChatFolderComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaFolderChatRightPanelComponent implements OnInit {
  private state = inject(CaHierarchyObjectDetailState);

  @Input({ required: true }) folderId: string;

  folder$: Observable<CaHierarchyObject>;

  chatDetailRoute: string;

  ngOnInit(): void {
    this.folder$ = this.state.getFolder$(this.folderId);
    this.chatDetailRoute = CaRouterService.getChatFolderRoute(this.folderId);
  }
}
