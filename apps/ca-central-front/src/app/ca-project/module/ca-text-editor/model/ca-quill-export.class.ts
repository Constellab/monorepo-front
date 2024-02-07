import BlockBlot from 'parchment/dist/src/blot/block';
import EmbedBlot from 'parchment/dist/src/blot/embed';

import Quill from 'quill';

//Import quill only if document is defined (for server side rendering)
// let quillImport: any;

// if (typeof document === 'object' && document !== null) {
  // @ts-ignore
  // quillImport = Quill;
  // Quill = require('quill');
// }

/**
 * File to export different quill objects
 */
// export const Parchment = Quill.import('parchment');
// export const ParchmentClass = Parchment.Attributor.Class as typeof ClassAttributor;
// export const ParchmentAttribute = Parchment.Attributor.Attribute;
export const CaQuillBlock = Quill ? Quill.import('blots/block') as typeof BlockBlot : Object;
//export const FlQuillBlock =  document != null ? Quill.import('blots/block') as typeof BlockBlot: Object;

// export const Container = Quill.import('blots/container') as typeof ContainerBlot;
//export const FlQuillEmbed = null as typeof EmbedBlot;
export const CaQuillEmbed = Quill ? Quill.import('blots/block/embed') as typeof EmbedBlot : Object;
export const CaQuillHeader = Quill ? Quill.import('formats/header') as typeof BlockBlot : Object;
export const CaQuillLink = Quill ? Quill.import('formats/link') as typeof BlockBlot : Object;
// export const Break = Quill.import('blots/break') as typeof Parchment.Container;
// export const Cursor = Quill.import('blots/cursor') as typeof Parchment.Container;
// export const CodeBlock = Quill.import('formats/code-block') as typeof BlockBlot;
// export const TextBlot = Quill.import('blots/text') as typeof Parchment.Container;

