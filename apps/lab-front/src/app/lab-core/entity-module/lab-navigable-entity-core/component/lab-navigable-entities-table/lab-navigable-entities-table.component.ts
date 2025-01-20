import {
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { LabEntityType } from '../../../../model/entities/lab-navigable-entity.entity';
import { LabScenarioTableComponent } from '../../../lab-scenario-core/component/lab-scenario-table/lab-scenario-table.component';
import { FlEntityArrayObs } from '@monorepo/front-core-lib';
import { LabNoteTableComponent } from '../../../lab-note-core/component/lab-note-table/lab-note-table.component';
import { LabResourceTableComponent } from '../../../lab-resource-core/component/lab-resource-table/lab-resource-table.component';
import { LabViewConfigTableComponent } from '../../../lab-view-config-core/component/lab-view-config-table/lab-view-config-table.component';

/**
 * Show a table of navigable entities based on the type
 */
@Component({
    selector: 'lab-navigable-entities-table',
    templateUrl: './lab-navigable-entities-table.component.html',
    styleUrl: './lab-navigable-entities-table.component.scss',
    standalone: false
})
export class LabNavigableEntitiesTableComponent implements OnInit, OnDestroy {
  @Input({ required: true }) type: LabEntityType;

  @Input({ required: true }) entities: any[];

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private componentRef: ComponentRef<any>;

  async ngOnInit(): Promise<void> {
    switch (this.type) {
      case 'SCENARIO':
        this.componentRef = this.scenarioTable();
        break;
      case 'RESOURCE':
        this.componentRef = this.resourceTable();
        break;
      case 'VIEW':
        this.componentRef = this.viewConfigTable();
        break;
      case 'NOTE':
        this.componentRef = this.noteTable();
        break;
      default:
        throw new Error(`[LabNavigableEntitiesTableComponent] Type ${this.type} is not supported`);
    }
  }

  private scenarioTable(): ComponentRef<any> {
    const componentRef = this.viewContainer.createComponent(LabScenarioTableComponent);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['title', 'status', 'lastModification'];
    componentRef.instance.rowLinkTarget = '_blank';
    return componentRef;
  }

  private resourceTable(): ComponentRef<any> {
    const componentRef = this.viewContainer.createComponent(LabResourceTableComponent);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['name', 'type', 'lastModification', 'viewResource'];
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

  private noteTable(): ComponentRef<any> {
    const componentRef = this.viewContainer.createComponent(LabNoteTableComponent);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['title', 'creation'];
    componentRef.instance.rowLinkTarget = '_blank';
    return componentRef;
  }

  ngOnDestroy(): void {
    this.componentRef?.destroy();
  }
}
