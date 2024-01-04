import {Component, Input} from '@angular/core';
import {LabSharedEntity, LabShareLink, LabShareLinkDatasource} from '../../../../model/entities/lab-share.entity';
import {FlClipboardService, FlTableColumnStatic} from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-share-link-table',
  templateUrl: './lab-share-link-table.component.html',
  styleUrls: ['./lab-share-link-table.component.scss']
})
export class LabShareLinkTableComponent {

  @Input() datasource: LabShareLinkDatasource;

  @Input() columns: FlTableColumnStatic<LabSharedEntity>[];

  constructor(private clipboardService: FlClipboardService) {
  }

  onLinkUpdated(entity: LabShareLink): void {
    this.datasource.updateItem(entity);
  }

  onLinkDeleted(entity: LabShareLink): void {
    this.datasource.removeItem(entity);
  }


  copyDownloadLink(shareLink: LabShareLink): void {
    this.clipboardService.copy(shareLink.link, {text: 'biox.share_link_copied', translateText: true});
  }


}
