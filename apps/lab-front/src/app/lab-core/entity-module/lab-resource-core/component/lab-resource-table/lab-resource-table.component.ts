import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FlArrayObs,
  FlArrayObsStatus,
  FlDialogService,
  FlEntityArrayObs,
  FlTableColumnStatic,
  FlTag,
  FlTagSelectedEvent,
} from '@monorepo/front-core-lib';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { ClHelpService } from '@monorepo/core-lib';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { LabResourceDetailDialogComponent } from '../lab-resource-detail-dialog/lab-resource-detail-dialog.component';
import { Observable } from 'rxjs';
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
import { MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { RouterLink } from '@angular/router';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { TdTechnicalDocModule } from '../../../../../../../../../libs/technical-doc/src/lib/td-technical-doc.module';
import { LabTagListComponent } from '../../../lab-tag-core/component/lab-tag-list/lab-tag-list.component';
import { LabFlagButtonComponent } from '../../../lab-entity-core/component/lab-flag-button/lab-flag-button.component';
import { LabResourceActionsMenuComponent } from '../lab-resource-actions-menu/lab-resource-actions-menu.component';

import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';
import { FlColorModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-color/fl-color.module';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';
import { LabGetEntityTagsPipe } from '../../../lab-tag-core/pipe/lab-get-entity-tags.pipe';

/**
 * Table to show resource with possibility actions on resource and a select mode
 */
@Component({
  selector: 'lab-resource-table',
  templateUrl: './lab-resource-table.component.html',
  styleUrls: ['./lab-resource-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    MatIconButton,
    FlCoreDirectiveModule,
    MatTooltip,
    MatIcon,
    FlIconModule,
    FlTextIconModule,
    FlUserModule,
    TdTechnicalDocModule,
    LabTagListComponent,
    LabFlagButtonComponent,
    LabResourceActionsMenuComponent,
    MatAnchor,
    FlLoaderModule,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
    FlColorModule,
    LabDetailRoutePipe,
    LabGetEntityTagsPipe,
  ],
})
export class LabResourceTableComponent implements OnInit {
  private resourceService = inject(LabResourceService);
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) datasource: FlArrayObs<LabResource>;

  @Input() columns: FlTableColumnStatic<LabResource>[] = ['name', 'type', 'lastModification', 'viewResource'];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() selectableRow: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Input() tagSelectable: boolean = true;

  @Input() sortDisabled: boolean = false;

  @Output() resourceSelected: EventEmitter<LabResource> = new EventEmitter();

  @Output() tagSelected: EventEmitter<FlTag> = new EventEmitter();

  // column used in the sub table (for resource set)
  subTableColumns: FlTableColumnStatic<LabResource>[];

  // for parent resource only, store the current expanded resource
  expandedResource: LabResource;
  // store the children resources of the current expanded resource
  expandedChildrenResources$: FlEntityArrayObs<LabResource>;
  expandedChildrenStatus$: Observable<FlArrayObsStatus>;

  ngOnInit(): void {
    // remove the tag column from the sub table
    this.subTableColumns = this.columns.filter((c) => c !== 'tags');
  }

  rowClicked(resource: LabResource): void {
    if (this.selectableRow) {
      this.emitResourceSelected(resource);
    }
  }

  emitResourceSelected(resource: LabResource): void {
    this.resourceSelected.next(resource);
  }

  stopEventPropagation(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
  }

  onUpdate(resource: LabResource): void {
    this.datasource.updateItem(resource);
  }

  onDelete(resource: LabResource): void {
    this.datasource.removeItem(resource);
  }

  onTagSelected(tagEvent: FlTagSelectedEvent): void {
    ClHelpService.stopEventPropagation(tagEvent.event);
    this.emitTagSelected(tagEvent.tag);
  }

  emitTagSelected(tag: FlTag): void {
    this.tagSelected.next(tag);
  }

  openResourceDetail(resource: LabResource, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.dialogService.openBigDialog(LabResourceDetailDialogComponent, {
      data: resource.id,
      panelClass: 'g-dialog-main-background',
      closeOnNavigation: true,
    });
  }

  openInNewTab(event: MouseEvent): void {
    event.stopPropagation();
  }

  /**
   * Open the list of children resources of the current expanded resource
   */
  toggleResourceChildren(resource: LabResource, event: MouseEvent): void {
    this.expandedResource = this.expandedResource === resource ? null : resource;

    this.expandedChildrenResources$ = new FlEntityArrayObs(
      this.resourceService.getResourceChildren(resource.id)
    );
    this.expandedChildrenStatus$ = this.expandedChildrenResources$.getStatus$();

    ClHelpService.stopEventPropagation(event);
  }
}
