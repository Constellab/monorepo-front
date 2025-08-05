import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaChatFolderComponent } from '../../../../../ca-core/entity-module/ca-chat-core/component/ca-chat-folder/ca-chat-folder.component';
import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { CaHierarchyObjectSimple } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';

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
    FlPortalModule,
  ],
})
export class CaFolderChatRightPanelComponent implements OnInit {
  private state = inject(CaHierarchyObjectDetailState);

  @Input({ required: true }) folderId: string;

  folder$: Observable<CaHierarchyObjectSimple>;

  chatDetailRoute: string;

  ngOnInit(): void {
    this.folder$ = this.state.getFolder$(this.folderId);
    this.chatDetailRoute = CaRouterService.getChatFolderRoute(this.folderId);
  }
}
