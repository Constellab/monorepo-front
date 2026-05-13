import { Component, EventEmitter, inject, Injector, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ClHelpService } from '@monorepo/core-lib';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import {
  LiDetailRoutePipe,
  LiNoteTemplate,
  LiNoteTemplateDatasource,
  LiTagService,
} from '@monorepo/lab-lib/li-core';
import { LiGetEntityTagsPipe, LiTagListComponent } from '@monorepo/lab-lib/li-tag';
import { TranslatePipe } from '@ngx-translate/core';

import {
  LiNoteTemplateActionEvent,
  LiNoteTemplateActionMenu,
} from '../../model/li-note-template-action-menu.class';

@Component({
  selector: 'li-note-template-table',
  templateUrl: './li-note-template-table.component.html',
  styleUrls: ['./li-note-template-table.component.scss'],
  imports: [
    MatTable,
    MatSort,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    RouterLink,
    FlUserModule,
    LiTagListComponent,
    LiGetEntityTagsPipe,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatIconButton,
    MatIcon,
    TranslatePipe,
    LiDetailRoutePipe,
  ],
})
export class LiNoteTemplateTableComponent {
  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Input({ required: true }) datasource: LiNoteTemplateDatasource<any>;

  @Input() columns: FlTableColumnStatic<LiNoteTemplate>[] = ['title', 'tags', 'lastModification', 'actions'];

  @Output() noteTemplateSelected: EventEmitter<LiNoteTemplate> = new EventEmitter();

  private injector = inject(Injector);
  private tagService = inject(LiTagService);

  rowClicked(noteTemplate: LiNoteTemplate): void {
    if (this.rowSelectable) {
      this.noteTemplateSelected.next(noteTemplate);
    }
  }

  openActionMenu(noteTemplate: LiNoteTemplate, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const actionMenu = new LiNoteTemplateActionMenu(
      this.injector,
      noteTemplate,
      this.tagService.getEntityTagsDatasource('NOTE_TEMPLATE', noteTemplate.id)
    );

    actionMenu.openActionMenuInTable(event).subscribe((action) => this.onAction(action));
  }

  private onAction(action: LiNoteTemplateActionEvent): void {
    if (action.action === 'delete') {
      this.datasource.removeItem(action.noteTemplate);
    }
  }
}
