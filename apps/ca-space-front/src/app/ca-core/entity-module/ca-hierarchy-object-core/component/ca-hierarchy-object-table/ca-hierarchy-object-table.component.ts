import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
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
import { FlMouseButton, FlTableColumnStatic, FlViewContext } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../../../model/entities/folder/ca-hierarchy-object.class';
import { CaDetailRoutePipe } from '../../../../module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { CaNotificationMarkDirective } from '../../../ca-notification-core/directive/ca-notification-mark/ca-notification-mark.directive';
import { CaHierarchyObjectAncestorPortalDirective } from '../ca-hierarchy-object-ancestor-portal/ca-hierarchy-object-ancestor-portal.directive';
import { CaHierarchyObjectInlineComponent } from '../ca-hierarchy-object-inline/ca-hierarchy-object-inline.component';

export interface CaHierarchyObjectTableEvent {
  action: 'click' | 'dblClick' | 'rightClick' | 'middleClick' | 'openChat' | 'openDescription';
  hierarchyObject: CaHierarchyObject;
  event: MouseEvent;
}

@Component({
  selector: 'ca-hierarchy-object-table',
  templateUrl: './ca-hierarchy-object-table.component.html',
  styleUrl: './ca-hierarchy-object-table.component.scss',
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
    CaHierarchyObjectInlineComponent,
    FlDateModule,
    FlUserModule,
    MatIcon,
    FlIconModule,
    MatTooltip,
    MatIconButton,
    CaNotificationMarkDirective,
    NgTemplateOutlet,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    NgClass,
    FlCoreDirectiveModule,
    CaDetailRoutePipe,
    FlCorePipeModule,
    TranslatePipe,
    FlTagModule,
    CaHierarchyObjectAncestorPortalDirective,
  ],
})
export class CaHierarchyObjectTableComponent {
  @Input({ required: true }) datasource: CaHierarchyObjectDatasource<any>;

  @Input() columns: FlTableColumnStatic<CaHierarchyObject>[] = ['name', 'user', 'lastModifiedAt'];

  // when true, the row become clickable and selectedFolderChange and folderDblClicked event is trigger
  @Input() rowSelectable: boolean = false;

  @Input() selectedObject: CaHierarchyObject | null;

  @Input() showTrashIcon: boolean = false;

  @Output() rowEvent: EventEmitter<CaHierarchyObjectTableEvent> = new EventEmitter();

  // to support custom column
  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  onClick(object: CaHierarchyObject, event: MouseEvent): void {
    if (this.rowSelectable) {
      this.selectedObject = object;
      this.rowEvent.emit({
        action: 'click',
        hierarchyObject: object,
        event: event,
      });
    }
  }

  onDblClick(object: CaHierarchyObject, event: MouseEvent): void {
    if (this.rowSelectable) {
      this.rowEvent.emit({ action: 'dblClick', hierarchyObject: object, event: event });
    }
  }

  rightClick(object: CaHierarchyObject, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.rowEvent.emit({ action: 'rightClick', hierarchyObject: object, event: event });
  }

  mouseUp(object: CaHierarchyObject, event: MouseEvent): void {
    if (this.rowSelectable && event.button === FlMouseButton.MIDDLE) {
      this.rowEvent.emit({
        action: 'middleClick',
        hierarchyObject: object,
        event: event,
      });
    }
  }

  openChat(object: CaHierarchyObject, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.rowEvent.emit({ action: 'openChat', hierarchyObject: object, event: event });
  }

  openDescription(object: CaHierarchyObject, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.rowEvent.emit({ action: 'openDescription', hierarchyObject: object, event: event });
  }

  getViewContent(object: CaHierarchyObject): FlViewContext<CaHierarchyObject> {
    return { $implicit: object };
  }
}
