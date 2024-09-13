import { Component, Input } from '@angular/core';


@Component({
  selector: 'ca-folder-chat-right-panel',
  templateUrl: './ca-folder-chat-right-panel.component.html',
  styleUrls: ['./ca-folder-chat-right-panel.component.scss']
})
export class CaFolderChatRightPanelComponent {

  @Input({ required: true }) folderId: string;

}
