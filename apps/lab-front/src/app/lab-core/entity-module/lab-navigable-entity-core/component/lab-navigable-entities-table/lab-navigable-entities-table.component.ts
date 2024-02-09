import {Component, ComponentRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {LabEntityType} from '../../../../model/entities/lab-navigable-entity.entity';
import {
  LabExperimentTableComponent
} from '../../../lab-experiment-core/component/lab-experiment-table/lab-experiment-table.component';
import {FlEntityArrayObs} from '@monorepo/front-core-lib';
import {LabReportTableComponent} from '../../../lab-report-core/component/lab-report-table/lab-report-table.component';
import {
  LabResourceTableComponent
} from '../../../lab-resource-core/component/lab-resource-table/lab-resource-table.component';
import {
  LabViewConfigTableComponent
} from '../../../lab-view-config-core/component/lab-view-config-table/lab-view-config-table.component';

/**
 * Show a table of navigable entities based on the type
 */
@Component({
  selector: 'lab-navigable-entities-table',
  templateUrl: './lab-navigable-entities-table.component.html',
  styleUrl: './lab-navigable-entities-table.component.scss'
})
export class LabNavigableEntitiesTableComponent implements OnInit, OnDestroy {

  @Input({required: true}) type: LabEntityType;

  @Input({required: true}) entities: any[];

  @ViewChild('viewContainer', {static: true, read: ViewContainerRef}) viewContainer: ViewContainerRef;

  private componentRef: ComponentRef<any>;


  async ngOnInit(): Promise<void> {
    switch (this.type) {
      case 'EXPERIMENT':
        this.componentRef = this.experimentTable();
        break;
      case 'RESOURCE':
        this.componentRef = this.resourceTable();
        break;
      case 'VIEW':
        this.componentRef = this.viewConfigTable();
        break;
      case 'REPORT':
        this.componentRef = this.reportTable();
        break;
      default:
        throw new Error(`[LabNavigableEntitiesTableComponent] Type ${this.type} is not supported`);
    }
  }

  private experimentTable(): ComponentRef<any> {
    const componentRef = this.viewContainer.createComponent(LabExperimentTableComponent);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['title', 'status', 'createdAt'];
    componentRef.instance.rowLinkTarget = '_blank';
    return componentRef;
  }

  private resourceTable(): ComponentRef<any> {
    const componentRef = this.viewContainer.createComponent(LabResourceTableComponent);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['name', 'type', 'created', 'viewResource'];
    componentRef.instance.rowLinkTarget = '_blank';
    return componentRef;
  }

  private viewConfigTable(): ComponentRef<any> {
    const componentRef = this.viewContainer.createComponent(LabViewConfigTableComponent);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['title', 'resource', 'lastModifiedAt', 'preview'];
    componentRef.instance.rowLinkTarget = '_blank';
    return componentRef;
  }

  private reportTable(): ComponentRef<any> {
    const componentRef = this.viewContainer.createComponent(LabReportTableComponent);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['title', 'creation'];
    componentRef.instance.rowLinkTarget = '_blank';
    return componentRef;
  }

  ngOnDestroy(): void {
    this.componentRef?.destroy();
  }
}
