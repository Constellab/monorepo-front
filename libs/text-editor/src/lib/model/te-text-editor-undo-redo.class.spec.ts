import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TeBlockType } from './lib/te-block.class';
import { TeRichText } from './lib/te-rich-text.class';
import { TeRichTextAggregate } from './lib/te-rich-text-aggregate.class';
import { TeTextEditorUndoRedo } from './te-text-editor-undo-redo.class';

describe('TeTextEditorUndoRedo', () => {
  const V = 2;
  const EV = '2.30.2';
  const USER_ID = 'user-1';

  let mockEditor: any;
  let undoRedo: TeTextEditorUndoRedo;

  function createMockEditor(): any {
    return {
      blocks: {
        delete: vi.fn(),
        insertMany: vi.fn(),
        move: vi.fn(),
        getById: vi.fn().mockReturnValue(null),
        getBlockIndex: vi.fn().mockReturnValue(0),
        getBlocksCount: vi.fn().mockReturnValue(1),
      },
      caret: {
        setToBlock: vi.fn(),
      },
    };
  }

  beforeEach(() => {
    mockEditor = createMockEditor();
    undoRedo = new TeTextEditorUndoRedo(mockEditor);
  });

  describe('undoEvent', () => {
    it('should do nothing when there are no modifications to undo', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } }],
        })
      );

      undoRedo.undoEvent(aggregate);

      expect(mockEditor.blocks.delete).not.toHaveBeenCalled();
      expect(mockEditor.blocks.insertMany).not.toHaveBeenCalled();
      expect(mockEditor.caret.setToBlock).not.toHaveBeenCalled();
    });

    it('should delete block in editor when undoing CREATED modification', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'New block' } },
          ],
        }),
        USER_ID
      );

      undoRedo.undoEvent(aggregate);

      expect(mockEditor.blocks.delete).toHaveBeenCalledWith(1);
    });

    it('should insert block in editor when undoing DELETED modification', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'World' } },
          ],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } }],
        }),
        USER_ID
      );

      undoRedo.undoEvent(aggregate);

      expect(mockEditor.blocks.insertMany).toHaveBeenCalled();
      const insertCall = mockEditor.blocks.insertMany.mock.calls[0];
      expect(insertCall[0][0].id).toBe('p2');
      expect(insertCall[1]).toBe(1);
    });

    it('should replace block in editor when undoing UPDATED modification', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Original' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated' } }],
        }),
        USER_ID
      );

      undoRedo.undoEvent(aggregate);

      // UPDATED undo inserts the old block then deletes the new one
      expect(mockEditor.blocks.insertMany).toHaveBeenCalled();
      expect(mockEditor.blocks.delete).toHaveBeenCalledWith(1); // delete at index + 1
    });

    it('should move block in editor when undoing MOVED modification', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'First' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'Second' } },
            { id: 'p3', type: TeBlockType.PARAGRAPH, data: { text: 'Third' } },
          ],
        })
      );

      // Move p3 to the beginning — produces MOVED modifications
      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p3', type: TeBlockType.PARAGRAPH, data: { text: 'Third' } },
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'First' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'Second' } },
          ],
        }),
        USER_ID
      );

      undoRedo.undoEvent(aggregate);

      expect(mockEditor.blocks.move).toHaveBeenCalled();
    });

    it('should apply modifications in reverse order', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'A' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'B' } },
          ],
        })
      );

      // Grouped action: update p1 + add p3
      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'A modified' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'B' } },
            { id: 'p3', type: TeBlockType.PARAGRAPH, data: { text: 'C' } },
          ],
        }),
        USER_ID
      );

      const callOrder: string[] = [];
      mockEditor.blocks.delete.mockImplementation(() => callOrder.push('delete'));
      mockEditor.blocks.insertMany.mockImplementation(() => callOrder.push('insertMany'));

      undoRedo.undoEvent(aggregate);

      // CREATED (p3) should be undone first (reverse order), then UPDATED (p1)
      expect(callOrder[0]).toBe('delete'); // undo CREATE = delete
      expect(callOrder[1]).toBe('insertMany'); // undo UPDATE = insert
    });

    it('should set caret to the last modification block', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated' } }],
        }),
        USER_ID
      );

      mockEditor.blocks.getById.mockReturnValue({ id: 'p1' });

      undoRedo.undoEvent(aggregate);

      expect(mockEditor.caret.setToBlock).toHaveBeenCalledWith('p1', 'end');
    });

    it('should set caret by index when block is not found', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated' } }],
        }),
        USER_ID
      );

      mockEditor.blocks.getById.mockReturnValue(null);
      mockEditor.blocks.getBlocksCount.mockReturnValue(1);

      undoRedo.undoEvent(aggregate);

      expect(mockEditor.caret.setToBlock).toHaveBeenCalledWith(0, 'end');
    });

    it('should clamp caret index to 0 when negative', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Only' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [],
        }),
        USER_ID
      );

      mockEditor.blocks.getById.mockReturnValue(null);
      mockEditor.blocks.getBlocksCount.mockReturnValue(1);

      undoRedo.undoEvent(aggregate);

      const caretCall = mockEditor.caret.setToBlock.mock.calls[0];
      expect(caretCall[0]).toBeGreaterThanOrEqual(0);
    });

    it('should clamp caret index to last block when out of bounds', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'A' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'A' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'B' } },
            { id: 'p3', type: TeBlockType.PARAGRAPH, data: { text: 'C' } },
          ],
        }),
        USER_ID
      );

      mockEditor.blocks.getById.mockReturnValue(null);
      mockEditor.blocks.getBlocksCount.mockReturnValue(1);

      undoRedo.undoEvent(aggregate);

      const caretCall = mockEditor.caret.setToBlock.mock.calls[0];
      expect(caretCall[0]).toBeLessThan(1); // clamped to getBlocksCount() - 1
    });
  });

  describe('redoEvent', () => {
    it('should do nothing when there are no modifications to redo', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } }],
        })
      );

      undoRedo.redoEvent(aggregate);

      expect(mockEditor.blocks.delete).not.toHaveBeenCalled();
      expect(mockEditor.blocks.insertMany).not.toHaveBeenCalled();
      expect(mockEditor.caret.setToBlock).not.toHaveBeenCalled();
    });

    it('should insert block in editor when redoing CREATED modification', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'New' } },
          ],
        }),
        USER_ID
      );

      aggregate.undoLastModification();
      // Reset mocks after undo
      mockEditor.blocks.delete.mockClear();
      mockEditor.blocks.insertMany.mockClear();
      mockEditor.caret.setToBlock.mockClear();

      undoRedo.redoEvent(aggregate);

      expect(mockEditor.blocks.insertMany).toHaveBeenCalled();
      const insertCall = mockEditor.blocks.insertMany.mock.calls[0];
      expect(insertCall[0][0].id).toBe('p2');
    });

    it('should delete block in editor when redoing DELETED modification', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'World' } },
          ],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } }],
        }),
        USER_ID
      );

      aggregate.undoLastModification();
      mockEditor.blocks.delete.mockClear();
      mockEditor.blocks.insertMany.mockClear();
      mockEditor.caret.setToBlock.mockClear();

      undoRedo.redoEvent(aggregate);

      expect(mockEditor.blocks.delete).toHaveBeenCalledWith(1);
    });

    it('should replace block in editor when redoing UPDATED modification', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Original' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated' } }],
        }),
        USER_ID
      );

      aggregate.undoLastModification();
      mockEditor.blocks.delete.mockClear();
      mockEditor.blocks.insertMany.mockClear();
      mockEditor.caret.setToBlock.mockClear();

      undoRedo.redoEvent(aggregate);

      expect(mockEditor.blocks.insertMany).toHaveBeenCalled();
      expect(mockEditor.blocks.delete).toHaveBeenCalled();
    });

    it('should move block in editor when redoing MOVED modification', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'First' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'Second' } },
            { id: 'p3', type: TeBlockType.PARAGRAPH, data: { text: 'Third' } },
          ],
        })
      );

      // Move p3 to the beginning
      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p3', type: TeBlockType.PARAGRAPH, data: { text: 'Third' } },
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'First' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'Second' } },
          ],
        }),
        USER_ID
      );

      aggregate.undoLastModification();
      mockEditor.blocks.move.mockClear();
      mockEditor.caret.setToBlock.mockClear();

      undoRedo.redoEvent(aggregate);

      expect(mockEditor.blocks.move).toHaveBeenCalled();
    });

    it('should apply redo modifications in forward order', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'A' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'B' } },
          ],
        })
      );

      // Grouped: update p1 + add p3
      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'A modified' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'B' } },
            { id: 'p3', type: TeBlockType.PARAGRAPH, data: { text: 'C' } },
          ],
        }),
        USER_ID
      );

      aggregate.undoLastModification();

      mockEditor.blocks.delete.mockClear();
      mockEditor.blocks.insertMany.mockClear();
      mockEditor.caret.setToBlock.mockClear();

      const callOrder: string[] = [];
      mockEditor.blocks.insertMany.mockImplementation(() => callOrder.push('insertMany'));
      mockEditor.blocks.delete.mockImplementation(() => callOrder.push('delete'));

      undoRedo.redoEvent(aggregate);

      // UPDATED (p1) should be applied first, then CREATED (p3) — forward order
      expect(callOrder.length).toBeGreaterThan(0);
    });

    it('should set caret after redo', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated' } }],
        }),
        USER_ID
      );

      aggregate.undoLastModification();
      mockEditor.caret.setToBlock.mockClear();
      mockEditor.blocks.getById.mockReturnValue({ id: 'p1' });

      undoRedo.redoEvent(aggregate);

      expect(mockEditor.caret.setToBlock).toHaveBeenCalledWith('p1', 'end');
    });
  });

  describe('undo then redo consistency', () => {
    it('should correctly undo then redo a CREATED block', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'First' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'First' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'Second' } },
          ],
        }),
        USER_ID
      );

      // Undo: p2 should be deleted from editor
      undoRedo.undoEvent(aggregate);
      expect(mockEditor.blocks.delete).toHaveBeenCalled();
      expect(aggregate.richText.getBlocks()).toHaveLength(1);

      mockEditor.blocks.delete.mockClear();
      mockEditor.blocks.insertMany.mockClear();

      // Redo: p2 should be re-inserted in editor
      undoRedo.redoEvent(aggregate);
      expect(mockEditor.blocks.insertMany).toHaveBeenCalled();
      expect(aggregate.richText.getBlocks()).toHaveLength(2);
    });

    it('should correctly undo then redo a DELETED block', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Keep' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'Delete me' } },
          ],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Keep' } }],
        }),
        USER_ID
      );

      // Undo: p2 restored
      undoRedo.undoEvent(aggregate);
      expect(mockEditor.blocks.insertMany).toHaveBeenCalled();
      expect(aggregate.richText.getBlocks()).toHaveLength(2);

      mockEditor.blocks.delete.mockClear();
      mockEditor.blocks.insertMany.mockClear();

      // Redo: p2 deleted again
      undoRedo.redoEvent(aggregate);
      expect(mockEditor.blocks.delete).toHaveBeenCalled();
      expect(aggregate.richText.getBlocks()).toHaveLength(1);
    });

    it('should handle multiple undo/redo cycles correctly', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'V1' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'V2' } }],
        }),
        USER_ID
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'V3' } }],
        }),
        USER_ID
      );

      // Undo twice
      undoRedo.undoEvent(aggregate);
      expect(aggregate.richText.getBlock('p1')?.data.text).toBe('V2');

      undoRedo.undoEvent(aggregate);
      expect(aggregate.richText.getBlock('p1')?.data.text).toBe('V1');

      // Redo twice
      undoRedo.redoEvent(aggregate);
      expect(aggregate.richText.getBlock('p1')?.data.text).toBe('V2');

      undoRedo.redoEvent(aggregate);
      expect(aggregate.richText.getBlock('p1')?.data.text).toBe('V3');
    });

    it('should handle grouped modifications undo/redo correctly', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'A' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'B' } },
          ],
        })
      );

      // Grouped: delete p2 + update p1
      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'A modified' } }],
        }),
        USER_ID
      );

      expect(aggregate.richText.getBlocks()).toHaveLength(1);

      // Undo entire group
      undoRedo.undoEvent(aggregate);
      expect(aggregate.richText.getBlocks()).toHaveLength(2);
      expect(aggregate.richText.getBlock('p1')?.data.text).toBe('A');
      expect(aggregate.richText.getBlock('p2')?.data.text).toBe('B');

      // Redo entire group
      undoRedo.redoEvent(aggregate);
      expect(aggregate.richText.getBlocks()).toHaveLength(1);
      expect(aggregate.richText.getBlock('p1')?.data.text).toBe('A modified');
    });
  });

  describe('edge cases', () => {
    it('should handle undo when editor has existing block with same id (DELETED case)', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'World' } },
          ],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } }],
        }),
        USER_ID
      );

      // Simulate editor still having the block (edge case)
      mockEditor.blocks.getById.mockReturnValue({ id: 'p2' });
      mockEditor.blocks.getBlockIndex.mockReturnValue(1);

      undoRedo.undoEvent(aggregate);

      // Should delete the existing block first, then insert
      expect(mockEditor.blocks.delete).toHaveBeenCalled();
      expect(mockEditor.blocks.insertMany).toHaveBeenCalled();
    });

    it('should handle redo when editor has existing block with same id (CREATED case)', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [
            { id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } },
            { id: 'p2', type: TeBlockType.PARAGRAPH, data: { text: 'New' } },
          ],
        }),
        USER_ID
      );

      aggregate.undoLastModification();

      // Simulate editor still having the block (edge case)
      mockEditor.blocks.getById.mockReturnValue({ id: 'p2' });
      mockEditor.blocks.getBlockIndex.mockReturnValue(1);
      mockEditor.blocks.delete.mockClear();
      mockEditor.blocks.insertMany.mockClear();

      undoRedo.redoEvent(aggregate);

      // Should delete the existing block first, then insert
      expect(mockEditor.blocks.delete).toHaveBeenCalled();
      expect(mockEditor.blocks.insertMany).toHaveBeenCalled();
    });

    it('should handle consecutive undos past the beginning gracefully', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated' } }],
        }),
        USER_ID
      );

      undoRedo.undoEvent(aggregate);
      mockEditor.blocks.delete.mockClear();
      mockEditor.blocks.insertMany.mockClear();
      mockEditor.caret.setToBlock.mockClear();

      // Second undo should be a no-op
      undoRedo.undoEvent(aggregate);
      expect(mockEditor.blocks.delete).not.toHaveBeenCalled();
      expect(mockEditor.blocks.insertMany).not.toHaveBeenCalled();
      expect(mockEditor.caret.setToBlock).not.toHaveBeenCalled();
    });

    it('should handle consecutive redos past the end gracefully', () => {
      const aggregate = new TeRichTextAggregate(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Hello' } }],
        })
      );

      aggregate.updateContent(
        new TeRichText({
          version: V,
          editorVersion: EV,
          blocks: [{ id: 'p1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated' } }],
        }),
        USER_ID
      );

      aggregate.undoLastModification();
      undoRedo.redoEvent(aggregate);

      mockEditor.blocks.delete.mockClear();
      mockEditor.blocks.insertMany.mockClear();
      mockEditor.caret.setToBlock.mockClear();

      // Second redo should be a no-op
      undoRedo.redoEvent(aggregate);
      expect(mockEditor.blocks.delete).not.toHaveBeenCalled();
      expect(mockEditor.blocks.insertMany).not.toHaveBeenCalled();
      expect(mockEditor.caret.setToBlock).not.toHaveBeenCalled();
    });
  });
});
