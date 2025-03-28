import {
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';
import { LiEntityType } from '@monorepo/lab-lib/li-core';

/**
 * Show a table of navigable entities based on the type
 */
@Component({
  selector: 'li-navigable-entities-table',
  templateUrl: './li-navigable-entities-table.component.html',
  styleUrl: './li-navigable-entities-table.component.scss',
})
export class LiNavigableEntitiesTableComponent implements OnInit, OnDestroy {
  @Input({ required: true }) type: LiEntityType;

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
        throw new Error(`[LiNavigableEntitiesTableComponent] Type ${this.type} is not supported`);
    }
  }

  private async scenarioTable(): Promise<ComponentRef<any>> {
    // use lazy loading to avoid circular dependencies
    const componentType = await import(
      '../../../li-scenario/component/li-scenario-table/li-scenario-table.component'
    ).then((c) => c.LiScenarioTableComponent);
    const componentRef = this.viewContainer.createComponent(componentType);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['title', 'status', 'lastModification'];
    componentRef.instance.rowLinkTarget = '_blank';
    return componentRef;
  }

  private async resourceTable(): Promise<ComponentRef<any>> {
    // use lazy loading to avoid circular dependencies
    const componentType = await import(
      '../../../li-resource/component/li-resource-table/li-resource-table.component'
    ).then((c) => c.LiResourceTableComponent);
    const componentRef = this.viewContainer.createComponent(componentType);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['name', 'type', 'lastModification', 'viewResource'];
    componentRef.instance.rowLinkTarget = '_blank';
    return componentRef;
  }

  private async viewConfigTable(): Promise<ComponentRef<any>> {
    // use lazy loading to avoid circular dependencies
    const componentType = await import(
      '../../../li-view-config/component/li-view-config-table/li-view-config-table.component'
    ).then((c) => c.LiViewConfigTableComponent);
    const componentRef = this.viewContainer.createComponent(componentType);
    componentRef.instance.datasource = new FlEntityArrayObs(this.entities);
    componentRef.instance.columns = ['title', 'resource', 'lastModifiedAt', 'preview'];
    componentRef.instance.rowLinkTarget = '_blank';
    return componentRef;
  }

  private async noteTable(): Promise<ComponentRef<any>> {
    // use lazy loading to avoid circular dependencies
    const componentType = await import(
      '../../../li-note/component/li-note-table/li-note-table.component'
    ).then((c) => c.LiNoteTableComponent);
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
