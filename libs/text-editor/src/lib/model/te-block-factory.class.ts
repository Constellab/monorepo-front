import {ApplicationRef, EnvironmentInjector, Type} from '@angular/core';
import {TeElementBlockDirective} from './te-element.directive';
import {TeComponentBlock} from '../block/te-component-block.class';
import {
  BlockTool,
  BlockToolConstructable,
  BlockToolConstructorOptions
} from '@editorjs/editorjs/types/tools/block-tool';


/**
 * Factory function to create a block tool constructor for editor js configuration
 * This allows to pass additional data to block constructor
 * @param blockType
 * @param additionalData
 */
export function teSimpleBlockFactory(
  blockType: Type<BlockTool>,
  additionalData?: any): any {


  // this class implement the BlockToolConstructable interface (but because of constructor it is not recognized as such)
  return class TeClass {
    static toolbox = (blockType as BlockToolConstructable).toolbox;
    static pasteConfig = (blockType as BlockToolConstructable).pasteConfig;
    static conversionConfig = (blockType as BlockToolConstructable).conversionConfig;
    static isReadOnlySupported = (blockType as BlockToolConstructable).isReadOnlySupported;

    constructor(config: BlockToolConstructorOptions) {
      return new blockType(config, additionalData) as any;
    }
  };
}


/**
 * Factory function to create a block tool constructor for editor js configuration
 * This allow to pass environment injector, application ref and additional data to block constructor
 * @param blockType
 * @param environmentInjector
 * @param applicationRef
 * @param additionalData
 */
export function teComponentBlockFactory<T extends TeElementBlockDirective = TeElementBlockDirective>(
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
