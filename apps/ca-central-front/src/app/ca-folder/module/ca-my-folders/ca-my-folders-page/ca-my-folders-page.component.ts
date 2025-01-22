import { Component, OnInit, inject } from '@angular/core';
import { CaFolderService } from '../../../../ca-core/service-api/ca-folder.service';
import { CaFolderWithHierarchy } from '../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaHierarchyObjectDatasource } from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaFolderActionService } from '../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlTextIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CaHierarchyObjectCardComponent } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-card/ca-hierarchy-object-card.component';
import { FlInfiniteScrollModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { CaDetailRoutePipe } from '../../../../ca-core/module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-my-folders-page',
  templateUrl: './ca-my-folders-page.component.html',
  styleUrls: ['./ca-my-folders-page.component.scss'],
  imports: [
    FlSectionModule,
    FlTextIconModule,
    MatIcon,
    MatButton,
    RouterLink,
    CaHierarchyObjectCardComponent,
    FlInfiniteScrollModule,
    CaDetailRoutePipe,
    TranslatePipe,
  ],
})
export class CaMyFoldersPageComponent implements OnInit {
  private folderService = inject(CaFolderService);
  private folderActionService = inject(CaFolderActionService);

  folderDatasource: CaHierarchyObjectDatasource;

  ngOnInit(): void {
    this.folderDatasource = this.folderService.getMyFoldersDatasource();
  }

  openCreateFolderDialog(): void {
    this.folderActionService
      .openCreateRootFolderDialog()
      .subscribe((folders) => this.onCreateFolderClosed(folders));
  }

  private onCreateFolderClosed(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      // add the folder at the beginning of the array
      // and refresh the array
      this.folderDatasource.addItem(folder.hierarchyRepresentation, () => true);
    }
  }
}
