declare module '@editorjs/paragraph';
declare module '@editorjs/header';
declare module '@editorjs/nested-list';
declare module '@editorjs/inline-code';
declare module '@editorjs/quote';
declare module '@editorjs/underline';
declare module '@editorjs/table';

// Types the runner-neutral `testMock` global that `src/test-setup.ts` binds to Vitest's `vi`, for
// the specs of `src/lib/model/lib` that are shared with the upstream Jest-based repo. Without it
// those calls fail to typecheck, since this project declares only the Vitest globals.
declare const testMock: typeof import('vitest').vi;
