import { Component, EventEmitter, inject, Injector, Input, Output } from '@angular/core';
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

import { LiForm } from '../../model/li-form.entity';
import { LiFormActionEvent, LiFormActionMenu } from '../../model/li-form-action-menu.class';

@Component({
  selector: 'li-form-table',
  templateUrl: './li-form-table.component.html',
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
export class LiFormTableComponent {
  @Input({ required: true }) datasource: FlArrayObs<LiForm>;

  @Input() columns: FlTableColumnStatic<LiForm>[] = ['name', 'status', 'tags', 'lastModification'];

  @Input() rowSelectable: boolean = false;

  @Output() formSelected: EventEmitter<LiForm> = new EventEmitter();

  private injector = inject(Injector);
  private tagService = inject(LiTagService);

  rowClicked(form: LiForm): void {
    if (this.rowSelectable) {
      this.formSelected.next(form);
    }
  }

  openActionMenu(form: LiForm, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const actionMenu = new LiFormActionMenu(
      this.injector,
      form,
      this.tagService.getEntityTagsDatasource('FORM', form.id)
    );

    actionMenu.openActionMenuInTable(event).subscribe((action) => this.onAction(action));
  }

  private onAction(action: LiFormActionEvent): void {
    if (action.action === 'delete') {
      this.datasource.removeItem(action.form);
    } else {
      this.datasource.updateItem(action.form);
    }
  }
}
