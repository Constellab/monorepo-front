import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaNoteCardComponent } from './component/ca-note-card/ca-note-card.component';
import { CaCoreModule } from '../../../ca-core/ca-core.module';
import { CaNotesListComponent } from './component/ca-notes-list/ca-notes-list.component';
import { RouterModule } from '@angular/router';
import { CaNoteContentViewComponent } from './component/ca-note-content-view/ca-note-content-view.component';
import { CaNoteTableComponent } from './component/ca-note-table/ca-note-table.component';
import { CaFolderHierarchyCoreModule } from '../ca-folder-hierarchy-core/ca-folder-hierarchy-core.module';
import { CaNoteContentComponent } from './component/ca-note-content/ca-note-content.component';
import { FormsModule } from '@angular/forms';
import {
  CaNotificationCoreModule
} from '../../../ca-core/entity-module/ca-notification-core/ca-notification-core.module';

/**
 * Core module for Note entity
 */
@NgModule({
  declarations: [
    CaNoteCardComponent,
    CaNotesListComponent,
    CaNoteContentViewComponent,
    CaNoteTableComponent,
    CaNoteContentComponent,
  ],
  exports: [
    CaNoteCardComponent,
    CaNotesListComponent,
    CaNoteContentViewComponent,
    CaNoteTableComponent,
    CaNoteContentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    CaCoreModule,
    CaFolderHierarchyCoreModule,
    CaNotificationCoreModule,
  ]
})
export class CaNoteCoreModule {
}
