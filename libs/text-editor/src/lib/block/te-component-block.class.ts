import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Type } from '@angular/core';
import { PasteConfig } from '@editorjs/editorjs/types/configs/paste-config';
import { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';

import { TeElementBlockDirective } from '../model/te-element.directive';

/**
 * Specific data that can be passed when creating the block to pass config to the component,
 * the data is not saved in the editor
 */
export interface TeComponentInitData {
  /**
   * Useful when creating the block programmatically to force the component to be marked as new element.
   * If not provided, the block is not considered as new when added programmatically
   */
  forceNewElement: boolean;
}

/**
 * Custom abstract class for editor js block to support angular component
 */
export abstract class TeComponentBlock<T extends TeElementBlockDirective> implements BlockTool {
  protected htmlElement: HTMLElement;

  protected componentRef: ComponentRef<T>;

  constructor(
    protected options: BlockToolConstructorOptions,
    protected readonly envInjector: EnvironmentInjector,
    protected readonly applicationRef: ApplicationRef,
    protected readonly additionalData?: any
  ) {}

  static get toolbox(): ToolboxConfig | null {
    return null;
  }

  static get isReadOnlySupported(): boolean {
    return true;
  }

  static get pasteConfig(): PasteConfig {
    return false;
  }

  abstract getComponentType(): Type<T>;

  abstract save(): BlockToolData;

  abstract initInputs(data: BlockToolData): void;

  abstract getTagName(): string;

  get data(): BlockToolData {
    return this.options.data;
  }

  get componentInstance(): T {
    return this.componentRef.instance;
  }

  get disabled(): boolean {
    return this.options.readOnly;
  }

  render(): HTMLElement {
    this.htmlElement = document.createElement(this.getTagName());
    this.htmlElement.classList.add(...this.blockClasses());
    this.componentRef = createComponent(this.getComponentType(), {
      environmentInjector: this.envInjector,
      hostElement: this.htmlElement,
    });
    this.applicationRef.attachView(this.componentRef.hostView);
    this.componentInstance.disabled = this.disabled;

    // specific case for the data to force the block to be marked as new element
    const data = this.data as TeComponentInitData;
    if (data?.forceNewElement) {
      this.componentInstance.newElement = true;
      this.options.data = null;
    }

    this.initInputs(this.data);
    return this.htmlElement;
  }

  /**
   * Define the list of classes applied to the block
   */
  blockClasses(): string[] {
    return ['g-te-block'];
  }

  destroy(): void {
    this.componentRef?.destroy();
  }

  // call by editorjs when the block is added manually (not called when the editor is initialized with
  // this block)
  appendCallback(): void {
    this.componentInstance.newElement = true;
  }
}
