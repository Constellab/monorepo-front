import {ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Type} from '@angular/core';
import {
  BlockTool,
  BlockToolConstructable,
  BlockToolConstructorOptions
} from '@editorjs/editorjs/types/tools/block-tool';
import {ToolboxConfig} from '@editorjs/editorjs/types/tools/tool-settings';
import {BlockToolData} from '@editorjs/editorjs/types/tools/block-tool-data';
import {TeElementDirective} from '../model/te-element.directive';
import {flRootInjector, FlTranslateService} from '@monorepo/front-core-lib';
import {PasteConfig} from '@editorjs/editorjs/types/configs/paste-config';

/**
 * Custom abstract class for editor js block to support angular component
 */
export abstract class TeComponentBlock<T extends TeElementDirective> implements BlockTool {

  protected htmlElement: HTMLElement;

  protected componentRef: ComponentRef<T>;

  constructor(protected options: BlockToolConstructorOptions,
              protected readonly envInjector: EnvironmentInjector,
              protected readonly applicationRef: ApplicationRef,
              protected readonly additionalData?: any) {
  }

  static get toolbox(): ToolboxConfig {
    return null;
  }

  static get isReadOnlySupported(): boolean {
    return true;
  }

  static get pasteConfig(): PasteConfig {
    return false;
  }

  static get translateService(): FlTranslateService {
    return flRootInjector.get(FlTranslateService);
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

  get translateService(): FlTranslateService {
    return TeComponentBlock.translateService;
  }

  render(): HTMLElement {
    this.htmlElement = document.createElement(this.getTagName());
    this.htmlElement.classList.add('g-te-block');
    this.componentRef = createComponent(this.getComponentType(), {
      environmentInjector: this.envInjector,
      hostElement: this.htmlElement,
    });
    this.applicationRef.attachView(this.componentRef.hostView);
    this.componentInstance.disabled = this.disabled;

    this.initInputs(this.data);
    return this.htmlElement;
  }


  destroy(): void {
    this.componentRef?.destroy();
  }

  // call by editorjs when the block is added manually (not called when the editor is initialized with this block)
  appendCallback(): void {
  }
}

/**
 * Factory function to create a block tool constructor for editor js configuration
 * This creates a dynamic class to pass the environment injector and application ref class
 * @param blockType
 * @param environmentInjector
 * @param applicationRef
 * @param additionalData
 */
export function teComponentBlockFactory<T extends TeElementDirective = TeElementDirective>(
  blockType: Type<TeComponentBlock<T>>,
  environmentInjector: EnvironmentInjector,
  applicationRef: ApplicationRef,
  additionalData?: any): any {


  // this class implement the BlockToolConstructable interface (but because of constructor it is not recognized as such)
  return class TeClass {
    static toolbox = (blockType as BlockToolConstructable).toolbox;
    static pasteConfig = (blockType as BlockToolConstructable).pasteConfig;
    static conversionConfig = (blockType as BlockToolConstructable).conversionConfig;
    static isReadOnlySupported = (blockType as BlockToolConstructable).isReadOnlySupported;

    constructor(config: BlockToolConstructorOptions) {
      return new blockType(config, environmentInjector, applicationRef, additionalData) as any;
    }
  };
}
