import { ChangeDetectionStrategy,Component, EventEmitter, inject, Injector, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSortHeader } from '@angular/material/sort';
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
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ClHelpService } from '@monorepo/core-lib';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiDetailRoutePipe, LiTagService } from '@monorepo/lab-lib/li-core';
import { LiGetEntityTagsPipe, LiTagListComponent } from '@monorepo/lab-lib/li-tag';
import { TranslatePipe } from '@ngx-translate/core';

import { LiFormTemplate } from '../../../li-core/model/entities/form/li-form-template.entity';
import {
  LiFormTemplateActionEvent,
  LiFormTemplateActionMenu,
} from '../../model/li-form-template-action-menu.class';

@Component({
  selector: 'li-form-template-table',
  templateUrl: './li-form-template-table.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    RouterLink,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatTooltip,
    LiTagListComponent,
    FlUserModule,
    MatIconButton,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    LiDetailRoutePipe,
    LiGetEntityTagsPipe,
  ],
})
export class LiFormTemplateTableComponent {
  @Input({ required: true }) datasource: FlArrayObs<LiFormTemplate>;

  @Input() columns: FlTableColumnStatic<LiFormTemplate>[] = ['name', 'tags', 'lastModification'];

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Input() rowSelectable: boolean = false;

  @Output() templateSelected: EventEmitter<LiFormTemplate> = new EventEmitter();

  private injector = inject(Injector);
  private tagService = inject(LiTagService);

  rowClicked(template: LiFormTemplate): void {
    if (this.rowSelectable) {
      this.templateSelected.next(template);
    }
  }

  openActionMenu(template: LiFormTemplate, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const actionMenu = new LiFormTemplateActionMenu(this.injector, template);

    actionMenu.openActionMenuInTable(event).subscribe((action) => this.onAction(action));
  }

  private onAction(action: LiFormTemplateActionEvent): void {
    if (action.action === 'delete') {
      this.datasource.removeItem(action.template);
    } else {
      this.datasource.updateItem(action.template);
    }
  }
}
