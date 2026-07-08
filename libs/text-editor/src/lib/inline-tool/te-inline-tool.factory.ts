import {
  InlineToolConstructable,
  InlineToolConstructorOptions,
} from '@editorjs/editorjs/types/tools/inline-tool';

/**
 * Factory function to create a block tool constructor for editor js configuration
 * This allow to pass environment injector, application ref and additional data to block constructor
 * @param blockType
 * @param additionalData
 */
export function teInlineToolFactory(blockType: any, additionalData?: any): any {
  // this class implement the BlockToolConstructable interface (but because of constructor it is not
  // recognized as such)
  return class TeClass {
    static isInline = (blockType as InlineToolConstructable).isInline;
    static title = (blockType as InlineToolConstructable).title;
    static sanitize = (blockType as InlineToolConstructable).sanitize;

    constructor(config: InlineToolConstructorOptions) {
      return new blockType(config, additionalData) as any;
    }
  };
}
