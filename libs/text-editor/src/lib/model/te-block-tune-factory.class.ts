import { ApplicationRef, EnvironmentInjector, Type } from '@angular/core';
import { API, BlockAPI, SanitizerConfig, ToolConfig } from '@editorjs/editorjs';
import { BlockTune, BlockTuneConstructable } from '@editorjs/editorjs/types/block-tunes/block-tune';
import { BlockTuneData } from '@editorjs/editorjs/types/block-tunes/block-tune-data';
import { MenuConfig } from '@editorjs/editorjs/types/tools';

export interface TeBlockTuneConstructorConfig {
  api: API;
  config?: ToolConfig;
  block: BlockAPI;
  data: BlockTuneData;
}

export abstract class TeBlockTune implements BlockTune {
  constructor(
    protected config: TeBlockTuneConstructorConfig,
    protected readonly envInjector: EnvironmentInjector,
    protected readonly applicationRef: ApplicationRef,
    protected additionalData: any
  ) {}

  static get isTune(): boolean {
    return true;
  }

  static get sanitize(): SanitizerConfig {
    return null;
  }

  abstract render(): HTMLElement | MenuConfig;
}

/**
 * Factory function to create a block tune tool constructor for editor js configuration
 * This allow to pass environment injector, application ref and additional data to constructor
 * @param blockType
 * @param environmentInjector
 * @param applicationRef
 * @param additionalData
 */
export function teBlockTuneFactory(
  blockType: Type<TeBlockTune>,
  environmentInjector: EnvironmentInjector,
  applicationRef: ApplicationRef,
  additionalData?: any
): any {
  // this class implement the BlockToolConstructable interface (but because of constructor it is not recognized as such)
  return class TeClass {
    static isTune = (blockType as unknown as BlockTuneConstructable).isTune;
    static sanitize = (blockType as unknown as BlockTuneConstructable).sanitize;

    constructor(config: TeBlockTuneConstructorConfig) {
      return new blockType(config, environmentInjector, applicationRef, additionalData) as any;
    }
  };
}
