import { TeRichTextAggregate, TeRichTextBlockModification, TeRichTextModificationType } from './lib';

export class TeTextEditorUndoRedo {
  constructor(private editor: any) {}

  public undoEvent(richTextAggregate: TeRichTextAggregate): void {
    const undoResult: TeRichTextBlockModification = richTextAggregate.undoLastModification();

    if (undoResult == null) return;

    switch (undoResult.type) {
      case TeRichTextModificationType.CREATED:
        this.editor.blocks.delete(undoResult.index);
        this.setCaret(undoResult.index - 1);
        break;
      case TeRichTextModificationType.DELETED:
        if (this.editor.blocks.getById(undoResult.blockId) != null) {
          this.editor.blocks.delete(this.editor.blocks.getBlockIndex(undoResult.blockId));
        }
        const deletedBlock = richTextAggregate.richText.getBlock(undoResult.blockId);
        this.editor.blocks.insertMany([deletedBlock], undoResult.index);
        this.setCaret(undoResult.index);
        break;
      case TeRichTextModificationType.UPDATED:
        const updatedBlock = richTextAggregate.richText.getBlock(undoResult.blockId);
        this.editor.blocks.insertMany([updatedBlock], undoResult.index);
        this.editor.blocks.delete(undoResult.index + 1);
        break;
      case TeRichTextModificationType.MOVED:
        this.editor.blocks.move(undoResult.oldIndex, undoResult.index);
        this.setCaret(undoResult.oldIndex);
        break;
    }
  }

  public redoEvent(richTextAggregate: TeRichTextAggregate): void {
    const redoResult: TeRichTextBlockModification = richTextAggregate.redoLastModification();

    if (redoResult == null) return;

    switch (redoResult.type) {
      case TeRichTextModificationType.CREATED:
        if (this.editor.blocks.getById(redoResult.blockId) != null) {
          this.editor.blocks.delete(this.editor.blocks.getBlockIndex(redoResult.blockId));
        }
        const createdBlock = richTextAggregate.richText.getBlock(redoResult.blockId);
        this.editor.blocks.insertMany([createdBlock], redoResult.index);
        this.setCaret(redoResult.index);
        break;
      case TeRichTextModificationType.DELETED:
        this.editor.blocks.delete(redoResult.index);
        this.setCaret(redoResult.index - 1);
        break;
      case TeRichTextModificationType.UPDATED:
        const updatedBlock = richTextAggregate.richText.getBlock(redoResult.blockId);
        this.editor.blocks.insertMany([updatedBlock], redoResult.index);
        this.editor.blocks.delete(redoResult.index + 1);
        break;
      case TeRichTextModificationType.MOVED:
        this.editor.blocks.move(redoResult.index, redoResult.oldIndex);
        this.setCaret(redoResult.index);
        break;
    }
  }

  private setCaret(index: number): void {
    if (index < 0) {
      index = 0;
    }

    if (index >= this.editor.blocks.getBlocksCount()) {
      index = this.editor.blocks.getBlocksCount() - 1;
    }

    this.editor.caret.setToBlock(index, 'end');
  }
}
