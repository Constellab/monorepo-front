import { TeBlockType } from './te-block.class';
import { TeHTMLEditorJSON,TeRichText } from './te-rich-text.class';
import {
  TeNewFullRichTextDTO,
  TeOldRichTextContentWithModificationsI,
  TeRichTextAggregate,
} from './te-rich-text-aggregate.class';
import {
  TeRichTextBlockModification,
  TeRichTextModificationType,
} from './te-rich-text-block-modification.class';
import {
  TeRichTextBlockModificationWithUser,
  TeRichTextGetUserFunction,
} from './te-rich-text-block-modification.dto';
import { TeRichTextModifications } from './te-rich-text-modifications.class';
import { TeUser } from './te-user.class';

describe('TeRichTextAggregate', () => {
  const mockUserId = 'user-123';
  const mockUser: TeUser = {
    id: mockUserId,
    alias: 'testuser',
    photo: 'photo.jpg',
    firstname: 'Test',
    lastname: 'User',
  };

  let mockGetUser: TeRichTextGetUserFunction;

  beforeEach(() => {
    mockGetUser = jest.fn().mockResolvedValue(mockUser);
  });

  describe('constructor', () => {
    it('should create instance with default parameters', () => {
      const aggregate = new TeRichTextAggregate();

      expect(aggregate.richText).toBeInstanceOf(TeRichText);
      expect(aggregate.modifications).toBeInstanceOf(TeRichTextModifications);
      expect(aggregate.version).toBe(1);
      expect(aggregate.richText.isEmpty()).toBe(true);
      expect(aggregate.modifications.isEmpty()).toBe(true);
    });

    it('should create instance with provided rich text', () => {
      const richText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Test' } }],
      });

      const aggregate = new TeRichTextAggregate(richText);

      expect(aggregate.richText).toBe(richText);
      expect(aggregate.richText.isEmpty()).toBe(false);
    });

    it('should create instance with provided modifications', () => {
      const modification = new TeRichTextBlockModification(
        'block-1',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId
      );
      const modifications = new TeRichTextModifications([modification]);

      const aggregate = new TeRichTextAggregate(undefined, modifications);

      expect(aggregate.modifications).toBe(modifications);
      expect(aggregate.modifications.isEmpty()).toBe(false);
    });

    it('should create instance with custom version', () => {
      const aggregate = new TeRichTextAggregate(undefined, undefined, 2);

      expect(aggregate.version).toBe(2);
    });
  });

  describe('fromJson', () => {
    it('should create from TeHTMLEditorJSON (old format)', () => {
      const htmlEditorJson: TeHTMLEditorJSON = {
        version: '2.30.2',
        time: Date.now(),
        blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Test' } }],
      };

      const aggregate = TeRichTextAggregate.fromJson(htmlEditorJson);

      expect(aggregate).toBeInstanceOf(TeRichTextAggregate);
      expect(aggregate.richText.getBlocks()).toHaveLength(1);
      expect(aggregate.modifications.isEmpty()).toBe(true);
    });

    it('should create from TeOldRichTextContentWithModificationsI', () => {
      const oldContent: TeOldRichTextContentWithModificationsI = {
        content: {
          version: '2.30.2',
          time: Date.now(),
          blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Test' } }],
        },
        modifications: {
          version: 2,
          modifications: [
            {
              id: 'mod-1',
              time: '2023-01-01T10:00:00.000Z',
              blockId: 'block-1',
              blockType: TeBlockType.PARAGRAPH,
              type: TeRichTextModificationType.CREATED,
              index: 0,
              userId: mockUserId,
              blockValue: { text: 'Test' },
            },
          ],
        },
      };

      const aggregate = TeRichTextAggregate.fromJson(oldContent);

      expect(aggregate).toBeInstanceOf(TeRichTextAggregate);
      expect(aggregate.richText.getBlocks()).toHaveLength(1);
      expect(aggregate.modifications.isEmpty()).toBe(false);
    });

    it('should create from TeNewFullRichTextDTO (new format)', () => {
      const newContent: TeNewFullRichTextDTO = {
        version: 1,
        richText: {
          version: 2,
          editorVersion: '2.30.2',
          blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Test' } }],
        },
        modifications: {
          version: 2,
          modifications: [
            {
              id: 'mod-1',
              time: '2023-01-01T10:00:00.000Z',
              blockId: 'block-1',
              blockType: TeBlockType.PARAGRAPH,
              type: TeRichTextModificationType.CREATED,
              index: 0,
              userId: mockUserId,
              blockValue: { text: 'Test' },
            },
          ],
        },
      };

      const aggregate = TeRichTextAggregate.fromJson(newContent);

      expect(aggregate).toBeInstanceOf(TeRichTextAggregate);
      expect(aggregate.version).toBe(1);
      expect(aggregate.richText.getBlocks()).toHaveLength(1);
      expect(aggregate.modifications.isEmpty()).toBe(false);
    });

    it('should handle new format without modifications', () => {
      const newContent: TeNewFullRichTextDTO = {
        version: 1,
        richText: {
          version: 2,
          editorVersion: '2.30.2',
          blocks: [],
        },
      };

      const aggregate = TeRichTextAggregate.fromJson(newContent);

      expect(aggregate).toBeInstanceOf(TeRichTextAggregate);
      expect(aggregate.modifications.isEmpty()).toBe(true);
    });
  });

  describe('updateContent', () => {
    let aggregate: TeRichTextAggregate;

    beforeEach(() => {
      const initialRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Original' } }],
      });
      aggregate = new TeRichTextAggregate(initialRichText);
    });

    it('should update content and generate modifications', () => {
      const newRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [
          { id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated' } },
          { id: 'block-2', type: TeBlockType.PARAGRAPH, data: { text: 'New block' } },
        ],
      });

      aggregate.updateContent(newRichText, mockUserId);

      expect(aggregate.richText).toBe(newRichText);
      expect(aggregate.modifications.isEmpty()).toBe(false);
      expect(aggregate.modifications.getModifications().length).toBeGreaterThan(0);
    });

    it('should handle content without changes', () => {
      const sameRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Original' } }],
      });

      aggregate.updateContent(sameRichText, mockUserId);

      expect(aggregate.richText).toBe(sameRichText);
    });
  });

  describe('getRichTextAsJson', () => {
    it('should return rich text as JSON', () => {
      const richText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Test' } }],
      });
      const aggregate = new TeRichTextAggregate(richText);

      const result = aggregate.getRichTextAsJson();

      expect(result).toEqual({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Test' } }],
      });
    });
  });

  describe('compareWithCurrent', () => {
    let aggregate: TeRichTextAggregate;

    beforeEach(() => {
      const initialRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [
          { id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Block 1' } },
          { id: 'block-2', type: TeBlockType.PARAGRAPH, data: { text: 'Block 2' } },
        ],
      });
      aggregate = new TeRichTextAggregate(initialRichText);
    });

    it('should detect created blocks', () => {
      const newRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [
          { id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Block 1' } },
          { id: 'block-2', type: TeBlockType.PARAGRAPH, data: { text: 'Block 2' } },
          { id: 'block-3', type: TeBlockType.PARAGRAPH, data: { text: 'New Block' } },
        ],
      });

      const result = aggregate.compareWithCurrent(newRichText, mockUserId);

      expect(result.getModifications().length).toBeGreaterThan(0);
      const createdModification = result
        .getModifications()
        .find((mod) => mod.type === TeRichTextModificationType.CREATED && mod.blockId === 'block-3');
      expect(createdModification).toBeDefined();
      expect(createdModification.type).toBe(TeRichTextModificationType.CREATED);
    });

    it('should detect deleted blocks', () => {
      const newRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Block 1' } }],
      });

      const result = aggregate.compareWithCurrent(newRichText, mockUserId);

      expect(result.getModifications().length).toBeGreaterThan(0);
      const deletedModification = result
        .getModifications()
        .find((mod) => mod.type === TeRichTextModificationType.DELETED && mod.blockId === 'block-2');
      expect(deletedModification).toBeDefined();
      expect(deletedModification.type).toBe(TeRichTextModificationType.DELETED);
    });

    it('should detect updated blocks', () => {
      const newRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [
          { id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated Block 1' } },
          { id: 'block-2', type: TeBlockType.PARAGRAPH, data: { text: 'Block 2' } },
        ],
      });

      const result = aggregate.compareWithCurrent(newRichText, mockUserId);

      expect(result.getModifications().length).toBeGreaterThan(0);
      const updatedModification = result
        .getModifications()
        .find((mod) => mod.type === TeRichTextModificationType.UPDATED && mod.blockId === 'block-1');
      expect(updatedModification).toBeDefined();
      expect(updatedModification.type).toBe(TeRichTextModificationType.UPDATED);
      expect(updatedModification.differences).toBeDefined();
    });

    it('should detect moved blocks', () => {
      // Create a test with 3 blocks and move one to a different position
      const initialRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [
          { id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Block 1' } },
          { id: 'block-2', type: TeBlockType.PARAGRAPH, data: { text: 'Block 2' } },
          { id: 'block-3', type: TeBlockType.PARAGRAPH, data: { text: 'Block 3' } },
        ],
      });
      const threeBlockAggregate = new TeRichTextAggregate(initialRichText);

      const newRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [
          { id: 'block-2', type: TeBlockType.PARAGRAPH, data: { text: 'Block 2' } },
          { id: 'block-3', type: TeBlockType.PARAGRAPH, data: { text: 'Block 3' } },
          { id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Block 1' } },
        ],
      });

      const result = threeBlockAggregate.compareWithCurrent(newRichText, mockUserId);

      // When a block is moved to the end, it should be detected as a move
      expect(result.getModifications().length).toBeGreaterThan(0);
      const moveModifications = result
        .getModifications()
        .filter((mod) => mod.type === TeRichTextModificationType.MOVED);
      expect(moveModifications.length).toBeGreaterThan(0);

      // Verify that at least one move has different old and new positions
      const hasMoveWithDifferentPosition = moveModifications.some((mod) => mod.index !== mod.oldIndex);
      expect(hasMoveWithDifferentPosition).toBe(true);
    });

    it('should handle LIST blocks with meta removal', () => {
      const initialRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [
          {
            id: 'list-1',
            type: TeBlockType.LIST,
            data: {
              items: [{ content: 'Item 1', items: [] }],
              meta: { someMetaData: true },
            },
          },
        ],
      });
      aggregate = new TeRichTextAggregate(initialRichText);

      const newRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [
          {
            id: 'list-1',
            type: TeBlockType.LIST,
            data: {
              items: [{ content: 'Updated Item 1', items: [] }],
              meta: { differentMeta: true },
            },
          },
        ],
      });

      const result = aggregate.compareWithCurrent(newRichText, mockUserId);

      expect(result.getModifications()).toHaveLength(1);
      expect(result.getModifications()[0].type).toBe(TeRichTextModificationType.UPDATED);
    });

    it('should handle empty comparison', () => {
      const emptyAggregate = new TeRichTextAggregate();
      const emptyRichText = new TeRichText();

      const result = emptyAggregate.compareWithCurrent(emptyRichText, mockUserId);

      expect(result.getModifications()).toHaveLength(0);
    });
  });

  describe('undo functionality', () => {
    let aggregate: TeRichTextAggregate;

    beforeEach(() => {
      const initialRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Original' } }],
      });
      aggregate = new TeRichTextAggregate(initialRichText);

      const updatedRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated' } }],
      });
      aggregate.updateContent(updatedRichText, mockUserId);
    });

    describe('undoLastModification', () => {
      it('should undo last modification and return it', () => {
        const lastModification = aggregate.undoLastModification();

        expect(lastModification).toBeDefined();
        expect(lastModification.type).toBe(TeRichTextModificationType.UPDATED);
        expect(aggregate.richText.getBlock('block-1').data.text).toBe('Original');
      });

      it('should return null when no modifications exist', () => {
        const emptyAggregate = new TeRichTextAggregate();
        const result = emptyAggregate.undoLastModification();

        expect(result).toBeNull();
      });
    });

    describe('undoModifications', () => {
      it('should undo modifications from specified ID', () => {
        const modifications = aggregate.modifications.getModifications();
        const modificationId = modifications[0].id;

        aggregate.undoModifications(modificationId);

        expect(aggregate.richText.getBlock('block-1').data.text).toBe('Original');
      });

      it('should handle CREATED modification undo', () => {
        const richTextWithNewBlock = new TeRichText({
          version: 2,
          editorVersion: '2.30.2',
          blocks: [
            { id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated' } },
            { id: 'block-2', type: TeBlockType.PARAGRAPH, data: { text: 'New Block' } },
          ],
        });
        aggregate.updateContent(richTextWithNewBlock, mockUserId);

        const modifications = aggregate.modifications.getModifications();
        const createModification = modifications.find((m) => m.type === TeRichTextModificationType.CREATED);

        if (createModification) {
          aggregate.undoModifications(createModification.id);
          expect(aggregate.richText.getBlocks()).toHaveLength(1);
        }
      });

      it('should handle DELETED modification undo', () => {
        const richTextWithDeletedBlock = new TeRichText({
          version: 2,
          editorVersion: '2.30.2',
          blocks: [],
        });
        aggregate.updateContent(richTextWithDeletedBlock, mockUserId);

        const modifications = aggregate.modifications.getModifications();
        const deleteModification = modifications.find((m) => m.type === TeRichTextModificationType.DELETED);

        if (deleteModification) {
          aggregate.undoModifications(deleteModification.id);
          expect(aggregate.richText.getBlocks()).toHaveLength(1);
        }
      });

      it('should handle MOVED modification undo', () => {
        const richTextWithMovedBlocks = new TeRichText({
          version: 2,
          editorVersion: '2.30.2',
          blocks: [
            { id: 'block-2', type: TeBlockType.PARAGRAPH, data: { text: 'Block 2' } },
            { id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated' } },
          ],
        });

        aggregate.richText = new TeRichText({
          version: 2,
          editorVersion: '2.30.2',
          blocks: [
            { id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated' } },
            { id: 'block-2', type: TeBlockType.PARAGRAPH, data: { text: 'Block 2' } },
          ],
        });

        aggregate.updateContent(richTextWithMovedBlocks, mockUserId);

        const modifications = aggregate.modifications.getModifications();
        const moveModification = modifications.find((m) => m.type === TeRichTextModificationType.MOVED);

        if (moveModification) {
          aggregate.undoModifications(moveModification.id);
        }
      });
    });
  });

  describe('redo functionality', () => {
    let aggregate: TeRichTextAggregate;

    beforeEach(() => {
      const initialRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Original' } }],
      });
      aggregate = new TeRichTextAggregate(initialRichText);

      const updatedRichText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Updated' } }],
      });
      aggregate.updateContent(updatedRichText, mockUserId);
      aggregate.undoLastModification();
    });

    describe('redoLastModification', () => {
      it('should redo last modification and return it', () => {
        const redoneModification = aggregate.redoLastModification();

        expect(redoneModification).toBeDefined();
        expect(redoneModification.type).toBe(TeRichTextModificationType.UPDATED);
        expect(aggregate.richText.getBlock('block-1').data.text).toBe('Updated');
      });

      it('should return null when no redo modifications exist', () => {
        const emptyAggregate = new TeRichTextAggregate();
        const result = emptyAggregate.redoLastModification();

        expect(result).toBeNull();
      });

      it('should handle CREATED modification redo', () => {
        const richTextWithNewBlock = new TeRichText({
          version: 2,
          editorVersion: '2.30.2',
          blocks: [
            { id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Original' } },
            { id: 'block-2', type: TeBlockType.PARAGRAPH, data: { text: 'New Block' } },
          ],
        });

        const newAggregate = new TeRichTextAggregate(
          new TeRichText({
            version: 2,
            editorVersion: '2.30.2',
            blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Original' } }],
          })
        );

        newAggregate.updateContent(richTextWithNewBlock, mockUserId);
        newAggregate.undoLastModification();

        const redoneModification = newAggregate.redoLastModification();

        expect(redoneModification.type).toBe(TeRichTextModificationType.CREATED);
        expect(newAggregate.richText.getBlocks()).toHaveLength(2);
      });

      it('should handle DELETED modification redo', () => {
        const newAggregate = new TeRichTextAggregate(
          new TeRichText({
            version: 2,
            editorVersion: '2.30.2',
            blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Original' } }],
          })
        );

        const emptyRichText = new TeRichText({
          version: 2,
          editorVersion: '2.30.2',
          blocks: [],
        });

        newAggregate.updateContent(emptyRichText, mockUserId);
        newAggregate.undoLastModification();

        const redoneModification = newAggregate.redoLastModification();

        expect(redoneModification.type).toBe(TeRichTextModificationType.DELETED);
        expect(newAggregate.richText.getBlocks()).toHaveLength(0);
      });

      it('should handle MOVED modification redo', () => {
        const newAggregate = new TeRichTextAggregate(
          new TeRichText({
            version: 2,
            editorVersion: '2.30.2',
            blocks: [
              { id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Block 1' } },
              { id: 'block-2', type: TeBlockType.PARAGRAPH, data: { text: 'Block 2' } },
            ],
          })
        );

        const movedRichText = new TeRichText({
          version: 2,
          editorVersion: '2.30.2',
          blocks: [
            { id: 'block-2', type: TeBlockType.PARAGRAPH, data: { text: 'Block 2' } },
            { id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Block 1' } },
          ],
        });

        newAggregate.updateContent(movedRichText, mockUserId);
        const modifications = newAggregate.modifications.getModifications();
        const moveModification = modifications.find((m) => m.type === TeRichTextModificationType.MOVED);

        if (moveModification) {
          newAggregate.undoModifications(moveModification.id);
          const redoneModification = newAggregate.redoLastModification();
          expect(redoneModification.type).toBe(TeRichTextModificationType.MOVED);
        }
      });
    });
  });

  describe('getModificationsDTO', () => {
    it('should return modifications with user information', async () => {
      const modification = new TeRichTextBlockModification(
        'block-1',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId
      );
      const modifications = new TeRichTextModifications([modification]);
      const aggregate = new TeRichTextAggregate(undefined, modifications);

      const result = await aggregate.getModificationsDTO(mockGetUser);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(TeRichTextBlockModificationWithUser);
      expect(mockGetUser).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('getModificationsAsString', () => {
    it('should return modifications as JSON string', () => {
      const modification = new TeRichTextBlockModification(
        'block-1',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId
      );
      const modifications = new TeRichTextModifications([modification]);
      const aggregate = new TeRichTextAggregate(undefined, modifications);

      const result = aggregate.getModificationsAsString();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);

      const parsed = JSON.parse(result);
      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('modifications');
    });

    it('should return empty string for null modifications', () => {
      const aggregate = new TeRichTextAggregate();
      (aggregate as any).modifications = null;

      const result = aggregate.getModificationsAsString();

      expect(result).toBe('');
    });
  });

  describe('toJson', () => {
    it('should convert to JSON format', () => {
      const richText = new TeRichText({
        version: 2,
        editorVersion: '2.30.2',
        blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Test' } }],
      });
      const modification = new TeRichTextBlockModification(
        'block-1',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId
      );
      const modifications = new TeRichTextModifications([modification]);
      const aggregate = new TeRichTextAggregate(richText, modifications, 1);

      const result = aggregate.toJson();

      expect(result).toEqual({
        version: 1,
        richText: {
          version: 2,
          editorVersion: '2.30.2',
          blocks: [{ id: 'block-1', type: TeBlockType.PARAGRAPH, data: { text: 'Test' } }],
        },
        modifications: {
          version: 2,
          modifications: [
            expect.objectContaining({
              blockId: 'block-1',
              type: TeRichTextModificationType.CREATED,
            }),
          ],
        },
      });
    });

    it('should handle null modifications', () => {
      const aggregate = new TeRichTextAggregate();
      (aggregate as any).modifications = null;

      const result = aggregate.toJson();

      expect(result.modifications).toBeUndefined();
    });
  });
});
