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
import { FlEntityArrayObs } from '@monorepo/front-core-lib';

/**
 * Show a table of navigable entities based on the type
 */
@Component({
  selector: 'lab-navigable-entities-table',
  templateUrl: './lab-navigable-entities-table.component.html',
  styleUrl: './lab-navigable-entities-table.component.scss',
})
export class LabNavigableEntitiesTableComponent implements OnInit, OnDestroy {
  @Input({ required: true }) type: LabEntityType;

  @Input({ required: true }) entities: any[];

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private componentRef: ComponentRef<any>;

  async ngOnInit(): Promise<void> {
    switch (this.type) {
      case 'SCENARIO':
        this.componentRef = await this.scenarioTable();
        break;
      case 'RESOURCE':
        this.componentRef = await this.resourceTable();
        break;
      case 'VIEW':
        this.componentRef = await this.viewConfigTable();
        break;
      case 'NOTE':
        this.componentRef = await this.noteTable();
        break;
      default:
        throw new Error(`[LabNavigableEntitiesTableComponent] Type ${this.type} is not supported`);
    }
  }

  private async scenarioTable(): Promise<ComponentRef<any>> {
    // use lazy loading to avoid circular dependencies
    const componentType = await import(
      '../../../lab-scenario-core/component/lab-scenario-table/lab-scenario-table.component'
    ).then((c) => c.LabScenarioTableComponent);
    const componentRef = this.viewContainer.createComponent(componentType);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['title', 'status', 'lastModification'];
    componentRef.instance.rowLinkTarget = '_blank';
    return componentRef;
  }

  private async resourceTable(): Promise<ComponentRef<any>> {
    // use lazy loading to avoid circular dependencies
    const componentType = await import(
      '../../../lab-resource-core/component/lab-resource-table/lab-resource-table.component'
    ).then((c) => c.LabResourceTableComponent);
    const componentRef = this.viewContainer.createComponent(componentType);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['name', 'type', 'lastModification', 'viewResource'];
    componentRef.instance.rowLinkTarget = '_blank';
    return componentRef;
  }

  private async viewConfigTable(): Promise<ComponentRef<any>> {
    // use lazy loading to avoid circular dependencies
    const componentType = await import(
      '../../../lab-view-config-core/component/lab-view-config-table/lab-view-config-table.component'
    ).then((c) => c.LabViewConfigTableComponent);
    const componentRef = this.viewContainer.createComponent(componentType);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['title', 'resource', 'lastModifiedAt', 'preview'];
    componentRef.instance.rowLinkTarget = '_blank';
    return componentRef;
  }

  private async noteTable(): Promise<ComponentRef<any>> {
    // use lazy loading to avoid circular dependencies
    const componentType = await import(
      '../../../lab-note-core/component/lab-note-table/lab-note-table.component'
    ).then((c) => c.LabNoteTableComponent);
    const componentRef = this.viewContainer.createComponent(componentType);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['title', 'creation'];
    componentRef.instance.rowLinkTarget = '_blank';
    return componentRef;
  }

  ngOnDestroy(): void {
    this.componentRef?.destroy();
  }
}
