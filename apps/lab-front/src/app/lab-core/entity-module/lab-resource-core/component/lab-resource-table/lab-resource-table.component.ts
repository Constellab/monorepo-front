import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  FlArrayObs,
  FlArrayObsStatus,
  FlDialogService,
  FlEntityArrayObs,
  FlTableColumnStatic,
  FlTag,
  FlTagSelectedEvent
} from '@monorepo/front-core-lib';
import {LabResource} from '../../../../model/entities/resource/lab-resource.entity';
import {ClHelpService} from '@monorepo/core-lib';
import {LabResourceService} from '../../../../entity-service/lab-resource.service';
import {LabResourceDetailDialogComponent} from '../lab-resource-detail-dialog/lab-resource-detail-dialog.component';
import {Observable} from 'rxjs';

/**
 * Table to show resource with possibility actions on resource and a select mode
 */
@Component({
  selector: 'lab-resource-table',
  templateUrl: './lab-resource-table.component.html',
  styleUrls: ['./lab-resource-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabResourceTableComponent implements OnInit {

  @Input() datasource: FlArrayObs<LabResource>;

  @Input() columns: FlTableColumnStatic<LabResource>[] = ['name', 'type', 'created', 'viewResource'];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() selectableRow: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Input() tagSelectable: boolean = true;

  @Output() resourceSelected: EventEmitter<LabResource> = new EventEmitter();

  @Output() tagSelected: EventEmitter<FlTag> = new EventEmitter();

  // column used in the sub table (for resource set)
  subTableColumns: FlTableColumnStatic<LabResource>[];

  // for parent resource only, store the current expanded resource
  expandedResource: LabResource;
  // store the children resources of the current expanded resource
  expandedChildrenResources$: FlEntityArrayObs<LabResource>;
  expandedChildrenStatus$: Observable<FlArrayObsStatus>;

  constructor(private resourceService: LabResourceService,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    // remove the tag column from the sub table
    this.subTableColumns = this.columns.filter(c => c !== 'tags');
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
      closeOnNavigation: true
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

    this.expandedChildrenResources$ = new FlEntityArrayObs(this.resourceService.getResourceChildren(resource.id));
    this.expandedChildrenStatus$ = this.expandedChildrenResources$.getStatus$();

    ClHelpService.stopEventPropagation(event);
  }

}
