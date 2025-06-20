import { Duration } from 'luxon';
import { TeRichTextModifications } from './te-rich-text-modifications.class';
import {
  TeRichTextBlockModification,
  TeRichTextModificationType,
} from './te-rich-text-block-modification.class';
import { TeBlockType } from './te-block.class';
import {
  TeRichTextBlockModificationsDTO,
  TeRichTextBlockModificationWithUser,
  TeRichTextGetUserFunction,
} from './te-rich-text-block-modification.dto';
import { TeUser } from './te-user.class';

describe('TeRichTextModifications', () => {
  const mockUserId = 'user-123';
  const mockBlockId = 'block-123';
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

  describe('static configuration methods', () => {
    describe('setFrontTimeDifference', () => {
      it('should set front time difference', () => {
        TeRichTextModifications.setFrontTimeDifference();

        expect((TeRichTextModifications as any).MAX_TIME_DIFFERENCE).toEqual(
          Duration.fromObject({ seconds: 5 })
        );
      });
    });

    describe('setBackTimeDifference', () => {
      it('should set back time difference', () => {
        TeRichTextModifications.setBackTimeDifference();

        expect((TeRichTextModifications as any).MAX_TIME_DIFFERENCE).toEqual(
          Duration.fromObject({ minutes: 3 })
        );
      });
    });
  });

  describe('fromJsonObjectString', () => {
    it('should create instance from valid JSON string', () => {
      const dto: TeRichTextBlockModificationsDTO = {
        version: 2,
        modifications: [],
      };
      const jsonString = JSON.stringify(dto);

      const result = TeRichTextModifications.fromJsonObjectString(jsonString);

      expect(result).toBeInstanceOf(TeRichTextModifications);
      expect(result.isEmpty()).toBe(true);
    });

    it('should return empty instance for null/undefined string', () => {
      const result1 = TeRichTextModifications.fromJsonObjectString(null);
      const result2 = TeRichTextModifications.fromJsonObjectString(undefined);

      expect(result1).toBeInstanceOf(TeRichTextModifications);
      expect(result1.isEmpty()).toBe(true);
      expect(result2).toBeInstanceOf(TeRichTextModifications);
      expect(result2.isEmpty()).toBe(true);
    });

    it('should return empty instance for empty string', () => {
      const result = TeRichTextModifications.fromJsonObjectString('');

      expect(result).toBeInstanceOf(TeRichTextModifications);
      expect(result.isEmpty()).toBe(true);
    });
  });

  describe('fromJsonObject', () => {
    it('should create instance from valid JSON object', () => {
      const dto: TeRichTextBlockModificationsDTO = {
        version: 2,
        modifications: [
          {
            id: 'mod-1',
            time: '2023-01-01T10:00:00.000Z',
            blockId: mockBlockId,
            blockType: TeBlockType.PARAGRAPH,
            type: TeRichTextModificationType.CREATED,
            index: 0,
            userId: mockUserId,
            blockValue: { text: 'Test' },
          },
        ],
      };

      const result = TeRichTextModifications.fromJsonObject(dto);

      expect(result).toBeInstanceOf(TeRichTextModifications);
      expect(result.getModifications()).toHaveLength(1);
      expect(result.getModifications()[0].blockId).toBe(mockBlockId);
    });

    it('should return empty instance for null/undefined JSON', () => {
      const result1 = TeRichTextModifications.fromJsonObject(null);
      const result2 = TeRichTextModifications.fromJsonObject(undefined);

      expect(result1).toBeInstanceOf(TeRichTextModifications);
      expect(result1.isEmpty()).toBe(true);
      expect(result2).toBeInstanceOf(TeRichTextModifications);
      expect(result2.isEmpty()).toBe(true);
    });

    it('should handle custom target version', () => {
      const dto: TeRichTextBlockModificationsDTO = {
        version: 1,
        modifications: [],
      };

      const result = TeRichTextModifications.fromJsonObject(dto, 1);

      expect(result).toBeInstanceOf(TeRichTextModifications);
    });
  });

  describe('constructor', () => {
    it('should create instance with default parameters', () => {
      const modifications = new TeRichTextModifications();

      expect(modifications.getModifications()).toEqual([]);
      expect(modifications.isEmpty()).toBe(true);
    });

    it('should create instance with modifications array', () => {
      const modification = new TeRichTextBlockModification(
        mockBlockId,
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId
      );
      const modifications = new TeRichTextModifications([modification]);

      expect(modifications.getModifications()).toHaveLength(1);
      expect(modifications.isEmpty()).toBe(false);
    });

    it('should create instance with custom version', () => {
      const modifications = new TeRichTextModifications([], 1);

      expect((modifications as any).version).toBe(1);
    });

    it('should handle null modifications array', () => {
      const modifications = new TeRichTextModifications(null);

      expect(modifications.getModifications()).toEqual([]);
      expect(modifications.isEmpty()).toBe(true);
    });
  });

  describe('getModifications', () => {
    it('should return modifications array', () => {
      const modification = new TeRichTextBlockModification(
        mockBlockId,
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId
      );
      const modifications = new TeRichTextModifications([modification]);

      const result = modifications.getModifications();

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(modification);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty modifications', () => {
      const modifications = new TeRichTextModifications();

      expect(modifications.isEmpty()).toBe(true);
    });

    it('should return false for non-empty modifications', () => {
      const modification = new TeRichTextBlockModification(
        mockBlockId,
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId
      );
      const modifications = new TeRichTextModifications([modification]);

      expect(modifications.isEmpty()).toBe(false);
    });

    it('should return false for null modifications', () => {
      const modifications = new TeRichTextModifications();
      (modifications as any).modifications = null;

      expect(modifications.isEmpty()).toBe(false);
    });
  });

  describe('fusion', () => {
    let modifications: TeRichTextModifications;

    beforeEach(() => {
      modifications = new TeRichTextModifications();
    });

    it('should fusion with empty modifications when current is empty', () => {
      const newModifications = new TeRichTextModifications();

      modifications.fusion(newModifications);

      expect(modifications.isEmpty()).toBe(true);
    });

    it('should replace current modifications when current is empty', () => {
      const newModification = new TeRichTextBlockModification(
        mockBlockId,
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId
      );
      const newModifications = new TeRichTextModifications([newModification]);

      modifications.fusion(newModifications);

      expect(modifications.getModifications()).toHaveLength(1);
      expect(modifications.getModifications()[0].blockId).toBe(mockBlockId);
    });

    it('should append modifications when current is not empty', () => {
      const existingModification = new TeRichTextBlockModification(
        'existing-block',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId
      );
      modifications = new TeRichTextModifications([existingModification]);

      const newModification = new TeRichTextBlockModification(
        mockBlockId,
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        1,
        mockUserId
      );
      const newModifications = new TeRichTextModifications([newModification]);

      modifications.fusion(newModifications);

      expect(modifications.getModifications()).toHaveLength(2);
    });

    it('should filter out single MOVED modifications', () => {
      const moveModification = new TeRichTextBlockModification(
        mockBlockId,
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.MOVED,
        1,
        mockUserId
      );
      moveModification.oldIndex = 0;
      moveModification.blockValue = { text: 'Test' };

      const createdModification = new TeRichTextBlockModification(
        'other-block',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        2,
        mockUserId
      );

      const newModifications = new TeRichTextModifications([moveModification, createdModification]);

      modifications.fusion(newModifications);

      expect(modifications.getModifications()).toHaveLength(1);
      expect(modifications.getModifications()[0].type).toBe(TeRichTextModificationType.CREATED);
    });

    it('should keep the move with largest movement when all are MOVED', () => {
      const move1 = new TeRichTextBlockModification(
        'block-1',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.MOVED,
        5,
        mockUserId
      );
      move1.oldIndex = 0;
      move1.blockValue = { text: 'Small' };

      const move2 = new TeRichTextBlockModification(
        'block-2',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.MOVED,
        10,
        mockUserId
      );
      move2.oldIndex = 0;
      move2.blockValue = { text: 'Large movement' };

      const newModifications = new TeRichTextModifications([move1, move2]);

      modifications.fusion(newModifications);

      expect(modifications.getModifications()).toHaveLength(1);
      expect(modifications.getModifications()[0].blockId).toBe('block-2');
    });

    it('should filter out slash command modifications', () => {
      const slashModification = new TeRichTextBlockModification(
        mockBlockId,
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId
      );
      slashModification.blockValue = { text: '/' };

      const normalModification = new TeRichTextBlockModification(
        'other-block',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        1,
        mockUserId
      );
      normalModification.blockValue = { text: 'Normal text' };

      const newModifications = new TeRichTextModifications([slashModification, normalModification]);

      modifications.fusion(newModifications);

      expect(modifications.getModifications()).toHaveLength(1);
      expect(modifications.getModifications()[0].blockId).toBe('other-block');
    });
  });

  describe('modification management', () => {
    let modifications: TeRichTextModifications;

    beforeEach(() => {
      modifications = new TeRichTextModifications();
    });

    describe('addModification', () => {
      it('should add modification to the list', () => {
        const modification = new TeRichTextBlockModification(
          mockBlockId,
          TeBlockType.PARAGRAPH,
          TeRichTextModificationType.CREATED,
          0,
          mockUserId
        );

        modifications.addModification(modification);

        expect(modifications.getModifications()).toHaveLength(1);
        expect(modifications.getModifications()[0]).toBe(modification);
      });
    });

    describe('getLastModification', () => {
      it('should return undefined for empty modifications', () => {
        const result = modifications.getLastModification();

        expect(result).toBeUndefined();
      });

      it('should return last modification', () => {
        const modification1 = new TeRichTextBlockModification(
          'block-1',
          TeBlockType.PARAGRAPH,
          TeRichTextModificationType.CREATED,
          0,
          mockUserId
        );
        const modification2 = new TeRichTextBlockModification(
          'block-2',
          TeBlockType.PARAGRAPH,
          TeRichTextModificationType.CREATED,
          1,
          mockUserId
        );

        modifications.addModification(modification1);
        modifications.addModification(modification2);

        const result = modifications.getLastModification();

        expect(result).toBe(modification2);
      });
    });
  });

  describe('getModificationsFromModificationId', () => {
    let modifications: TeRichTextModifications;

    beforeEach(() => {
      const modification1 = new TeRichTextBlockModification(
        'block-1',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId,
        'mod-1'
      );
      const modification2 = new TeRichTextBlockModification(
        'block-2',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        1,
        mockUserId,
        'mod-2'
      );
      const modification3 = new TeRichTextBlockModification(
        'block-3',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        2,
        mockUserId,
        'mod-3'
      );

      modifications = new TeRichTextModifications([modification1, modification2, modification3]);
    });

    it('should return modifications from specified ID', () => {
      const result = modifications.getModificationsFromModificationId('mod-2');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('mod-2');
      expect(result[1].id).toBe('mod-3');
    });

    it('should throw error for non-existent modification ID', () => {
      expect(() => {
        modifications.getModificationsFromModificationId('non-existent');
      }).toThrow('Modification not found');
    });

    it('should return single modification when ID is the last one', () => {
      const result = modifications.getModificationsFromModificationId('mod-3');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('mod-3');
    });
  });

  describe('removeModificationsAfterUndo', () => {
    let modifications: TeRichTextModifications;

    beforeEach(() => {
      const modification1 = new TeRichTextBlockModification(
        'block-1',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId,
        'mod-1'
      );
      const modification2 = new TeRichTextBlockModification(
        'block-2',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        1,
        mockUserId,
        'mod-2'
      );
      const modification3 = new TeRichTextBlockModification(
        'block-3',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        2,
        mockUserId,
        'mod-3'
      );

      modifications = new TeRichTextModifications([modification1, modification2, modification3]);
    });

    it('should remove modifications after specified ID and return count', () => {
      const removedCount = modifications.removeModificationsAfterUndo('mod-2');

      expect(removedCount).toBe(2);
      expect(modifications.getModifications()).toHaveLength(1);
      expect(modifications.getModifications()[0].id).toBe('mod-1');
    });

    it('should throw error for non-existent modification ID', () => {
      expect(() => {
        modifications.removeModificationsAfterUndo('non-existent');
      }).toThrow('Modification not found');
    });

    it('should add removed modifications to redo stack', () => {
      modifications.removeModificationsAfterUndo('mod-1');

      const lastRedo = modifications.getLastRedoModification();
      expect(lastRedo).toBeDefined();
      expect(lastRedo.id).toBe('mod-3');
    });
  });

  describe('redo functionality', () => {
    let modifications: TeRichTextModifications;

    beforeEach(() => {
      const modification1 = new TeRichTextBlockModification(
        'block-1',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId,
        'mod-1'
      );
      const modification2 = new TeRichTextBlockModification(
        'block-2',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        1,
        mockUserId,
        'mod-2'
      );

      modifications = new TeRichTextModifications([modification1, modification2]);
      modifications.removeModificationsAfterUndo('mod-1');
    });

    describe('getLastRedoModification', () => {
      it('should return last redo modification', () => {
        const result = modifications.getLastRedoModification();

        expect(result).toBeDefined();
        expect(result.id).toBe('mod-2');
      });

      it('should return null when no redo modifications exist', () => {
        const emptyModifications = new TeRichTextModifications();
        const result = emptyModifications.getLastRedoModification();

        expect(result).toBeNull();
      });
    });

    describe('removeLastRedoModification', () => {
      it('should remove last redo modification', () => {
        expect(modifications.getLastRedoModification()).toBeDefined();

        modifications.removeLastRedoModification();

        expect(modifications.getLastRedoModification().id).toBe('mod-1');
      });
    });
  });

  describe('JSON conversion', () => {
    let modifications: TeRichTextModifications;

    beforeEach(() => {
      const modification = new TeRichTextBlockModification(
        mockBlockId,
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId,
        'test-id'
      );
      modifications = new TeRichTextModifications([modification]);
    });

    describe('toJsonObject', () => {
      it('should convert to JSON object', () => {
        const result = modifications.toJsonObject();

        expect(result).toHaveProperty('version');
        expect(result).toHaveProperty('modifications');
        expect(result.modifications).toHaveLength(1);
        expect(result.modifications[0].id).toBe('test-id');
      });
    });

    describe('toJsonString', () => {
      it('should convert to JSON string', () => {
        const result = modifications.toJsonString();

        expect(typeof result).toBe('string');
        const parsed = JSON.parse(result);
        expect(parsed).toHaveProperty('version');
        expect(parsed).toHaveProperty('modifications');
      });
    });
  });

  describe('toModificationsDTO', () => {
    let modifications: TeRichTextModifications;

    beforeEach(() => {
      const modification1 = new TeRichTextBlockModification(
        'block-1',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        'user-1',
        'mod-1'
      );
      const modification2 = new TeRichTextBlockModification(
        'block-2',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        1,
        'user-2',
        'mod-2'
      );

      modifications = new TeRichTextModifications([modification1, modification2]);
    });

    it('should return empty array for empty modifications', async () => {
      const emptyModifications = new TeRichTextModifications();
      const result = await emptyModifications.toModificationsDTO(mockGetUser);

      expect(result).toEqual([]);
    });

    it('should return empty array for null modifications', async () => {
      const nullModifications = new TeRichTextModifications();
      (nullModifications as any).modifications = null;
      const result = await nullModifications.toModificationsDTO(mockGetUser);

      expect(result).toEqual([]);
    });

    it('should convert modifications to DTO with user information', async () => {
      const mockUser1: TeUser = {
        id: 'user-1',
        alias: 'user1',
        photo: 'photo1.jpg',
        firstname: 'User',
        lastname: 'One',
      };
      const mockUser2: TeUser = {
        id: 'user-2',
        alias: 'user2',
        photo: 'photo2.jpg',
        firstname: 'User',
        lastname: 'Two',
      };

      const mockGetUserFn = jest.fn().mockImplementation((userId: string) => {
        if (userId === 'user-1') return Promise.resolve(mockUser1);
        if (userId === 'user-2') return Promise.resolve(mockUser2);
        return Promise.resolve(null);
      });

      const result = await modifications.toModificationsDTO(mockGetUserFn);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(TeRichTextBlockModificationWithUser);
      expect(result[1]).toBeInstanceOf(TeRichTextBlockModificationWithUser);
      expect(mockGetUserFn).toHaveBeenCalledTimes(2);
      expect(mockGetUserFn).toHaveBeenCalledWith('user-1');
      expect(mockGetUserFn).toHaveBeenCalledWith('user-2');
    });

    it('should reuse cached user data', async () => {
      const modification1 = new TeRichTextBlockModification(
        'block-1',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        0,
        mockUserId,
        'mod-1'
      );
      const modification2 = new TeRichTextBlockModification(
        'block-2',
        TeBlockType.PARAGRAPH,
        TeRichTextModificationType.CREATED,
        1,
        mockUserId,
        'mod-2'
      );

      const sameUserModifications = new TeRichTextModifications([modification1, modification2]);

      const result = await sameUserModifications.toModificationsDTO(mockGetUser);

      expect(result).toHaveLength(2);
      expect(mockGetUser).toHaveBeenCalledTimes(1);
      expect(mockGetUser).toHaveBeenCalledWith(mockUserId);
    });
  });
});
