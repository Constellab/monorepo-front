import { ComponentType } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  inject,
  Injectable,
  Injector,
  OnDestroy,
} from '@angular/core';
import {
  DcComponentData,
  DcDynamicComponent,
  DcDynamicComponentEnum,
  DcDynamicComponentEvent,
} from '../../../core/model/dc-dynamic-component.class';
import { DcLoadedComponent } from '../model/dc-loaded-component.class';

/**
 * Service to dynamically create the component at the specified location
 * For now we use the deprecated ComponentFactoryResolver because this is the
 * only way to create a component at a specified location in the DOM (without using viewContainerRef).
 * If this is not working, we will use the custom element approach.
 *
 * In prod mode, it has access to main streamlit app and it manages multiple components.
 * In dev mode, it is in the iframe and it creates only one component.
 */
@Injectable()
export class DcComponentLoaderService implements OnDestroy {
  private resolver = inject(ComponentFactoryResolver);
  private injector = inject(Injector);
  private app = inject(ApplicationRef);
  private document: Document = inject(DOCUMENT);

  private components: DcLoadedComponent[] = [];

  /**
   * Dynamically create the component at the specified location
   * @param data
   * @param element
   * @param componentEvent
   * @param listenToElementRemoval if true, listen to the element removal to destroy the component
   */
  public async createOrUpdateComponent(
    data: DcComponentData,
    element: HTMLElement,
    componentEvent: DcDynamicComponentEvent,
    listenToElementRemoval: boolean
  ): Promise<void> {
    const id: string = data.container_class;
    const component = this.findById(id);
    if (component) {
      // if the component already exists, we update its data
      component.setInput(data);
      return;
    } else {
      // if the component does not exist, we create it
      await this.createComponent(id, data, element, componentEvent, listenToElementRemoval);
    }
  }

  /**
   * Dynamically create the component at the specified location
   * @param data
   * @param element
   * @param componentEvent
   * @param listenToElementRemoval if true, listen to the element removal to destroy the component
   */
  private async createComponent(
    id: string,
    data: DcComponentData,
    element: HTMLElement,
    componentEvent: DcDynamicComponentEvent,
    listenToElementRemoval: boolean
  ): Promise<void> {
    const componentType = await this.getComponentType(data.component);
    const factory = this.resolver.resolveComponentFactory(componentType);

    // create the component container, we need to create a new container because it deletes
    // all the container content when we create the component
    const container = this.document.createElement('div');
    container.classList.add('dc-component-container');
    element.appendChild(container);

    const componentRef = factory.create(this.injector, [], container);
    const loadedComponent = new DcLoadedComponent(id, container, componentRef, componentEvent);

    loadedComponent.setInput(data);
    loadedComponent.listenToComponentOutput();

    // as this is not created in angular context, we need to manually check if the element is removed
    if (listenToElementRemoval) {
      loadedComponent.listenToElementRemoval();
    }
    this.app.attachView(componentRef.hostView);
    this.addComponent(loadedComponent);
  }

  private addComponent(component: DcLoadedComponent): void {
    this.components.push(component);
    // refresh the list of components
    this.components = this.components.filter((c) => c.id != null);
  }

  private async getComponentType(
    dynamicComponent: DcDynamicComponentEnum
  ): Promise<ComponentType<DcDynamicComponent>> {
    switch (dynamicComponent) {
      case DcDynamicComponentEnum.SELECT_RESOURCE:
        const { DcSelectResourceComponent } = await import(
          '../../dc-components/dc-select-resource/dc-select-resource.component'
        );
        return DcSelectResourceComponent;
      case DcDynamicComponentEnum.TEXT_EDITOR:
        const { DcTextEditorComponent } = await import(
          '../../dc-components/dc-text-editor/dc-text-editor.component'
        );
        return DcTextEditorComponent;

      case DcDynamicComponentEnum.PROCESS_CONFIG:
        const { DcProcessConfigComponent } = await import(
          '../../dc-components/dc-process-config/dc-process-config.component'
        );
        return DcProcessConfigComponent;
      case DcDynamicComponentEnum.MENU_BUTTON:
        const { DcMenuComponent } = await import('../../dc-components/dc-menu/dc-menu.component');
        return DcMenuComponent;
      case DcDynamicComponentEnum.TREE_MENU:
        const { DcTreeMenuComponent } = await import(
          '../../dc-components/dc-tree-menu/dc-tree-menu.component'
        );
        return DcTreeMenuComponent;
      default:
        throw new Error(`Unknown component type: ${dynamicComponent}`);
    }
  }

  private findById(id: string): DcLoadedComponent | undefined {
    return this.components.find((component) => component.id === id);
  }

  ngOnDestroy(): void {
    for (const component of this.components) {
      component.destroyComponent();
    }
  }
}
