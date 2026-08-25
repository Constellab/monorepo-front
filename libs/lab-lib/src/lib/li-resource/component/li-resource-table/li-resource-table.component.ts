import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatAnchor, MatIconButton } from '@angular/material/button';
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
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import {
  FlArrayObs,
  FlArrayObsStatus,
  FlEntityArrayObs,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTag, FlTagSelectedEvent } from '@monorepo/front-core-lib/fl-tag';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiDetailRoutePipe, LiResource, LiResourceService } from '@monorepo/lab-lib/li-core';
import { LiFlagButtonComponent } from '@monorepo/lab-lib/li-entity';
import { LiGetEntityTagsPipe, LiTagListComponent } from '@monorepo/lab-lib/li-tag';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LiResourceActionEvent, LiResourceActionMenu } from '../../model/li-resource-action-menu';
import { LiResourceDetailDialogComponent } from '../li-resource-detail-dialog/li-resource-detail-dialog.component';

/**
 * Table to show resource with possibility actions on resource and a select mode
 */
@Component({
  selector: 'li-resource-table',
  templateUrl: './li-resource-table.component.html',
  styleUrls: ['./li-resource-table.component.scss'],
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
    LiTagListComponent,
    LiFlagButtonComponent,
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
    LiDetailRoutePipe,
    LiGetEntityTagsPipe,
  ],
})
export class LiResourceTableComponent implements OnInit {
  private injector = inject(Injector);
  private resourceService = inject(LiResourceService);
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) datasource: FlArrayObs<LiResource>;

  @Input() columns: FlTableColumnStatic<LiResource>[] = ['name', 'type', 'lastModification', 'viewResource'];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() selectableRow: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Input() tagSelectable: boolean = true;

  @Input() sortDisabled: boolean = false;

  @Output() resourceSelected: EventEmitter<LiResource> = new EventEmitter();

  @Output() tagSelected: EventEmitter<FlTag> = new EventEmitter();

  // column used in the sub table (for resource set)
  subTableColumns: FlTableColumnStatic<LiResource>[];

  // for parent resource only, store the current expanded resource
  expandedResource: LiResource | null;
  // store the children resources of the current expanded resource
  expandedChildrenResources$: FlEntityArrayObs<LiResource>;
  expandedChildrenStatus$: Observable<FlArrayObsStatus>;

  ngOnInit(): void {
    // remove the tag column from the sub table
    this.subTableColumns = this.columns.filter((c) => c !== 'tags');
  }

  rowClicked(resource: LiResource): void {
    if (this.selectableRow) {
      this.emitResourceSelected(resource);
    }
  }

  emitResourceSelected(resource: LiResource): void {
    this.resourceSelected.next(resource);
  }

  openResourceMenu(resource: LiResource, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    new LiResourceActionMenu(this.injector, resource)
      .openActionMenu(event)
      .subscribe((result) => this.onResourceAction(result));
  }

  stopEventPropagation(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
  }

  private onResourceAction(result: LiResourceActionEvent): void {
    if (result.action === 'update') {
      this.onUpdate(result.resource);
    } else if (result.action === 'delete') {
      this.onDelete(result.resource);
    }
  }

  onUpdate(resource: LiResource): void {
    this.datasource.updateItem(resource);
  }

  onDelete(resource: LiResource): void {
    this.datasource.removeItem(resource);
  }

  onTagSelected(tagEvent: FlTagSelectedEvent): void {
    ClHelpService.stopEventPropagation(tagEvent.event);
    this.emitTagSelected(tagEvent.tag);
  }

  emitTagSelected(tag: FlTag): void {
    this.tagSelected.next(tag);
  }

  openResourceDetail(resource: LiResource, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.dialogService.openBigDialog(LiResourceDetailDialogComponent, {
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
  toggleResourceChildren(resource: LiResource, event: MouseEvent): void {
    this.expandedResource = this.expandedResource === resource ? null : resource;

    this.expandedChildrenResources$ = new FlEntityArrayObs(
      this.resourceService.getResourceChildren(resource.id)
    );
    this.expandedChildrenStatus$ = this.expandedChildrenResources$.getStatus$();

    ClHelpService.stopEventPropagation(event);
  }
}
