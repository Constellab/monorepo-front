import { TeRichTextAggregate, TeRichTextBlockModification, TeRichTextModificationType } from './lib';

export class TeTextEditorUndoRedo {
  constructor(private editor: any) {}

  public undoEvent(richTextAggregate: TeRichTextAggregate): void {
    const undoResults: TeRichTextBlockModification[] = richTextAggregate.undoLastModification();

    if (undoResults.length === 0) return;

    // Apply in reverse order to undo correctly
    for (const undoResult of undoResults.slice().reverse()) {
      this.applyUndoToEditor(undoResult, richTextAggregate);
    }

    const lastResult = undoResults[undoResults.length - 1];
    this.setCaret(lastResult.blockId, lastResult.index);
  }

  public redoEvent(richTextAggregate: TeRichTextAggregate): void {
    const redoResults: TeRichTextBlockModification[] = richTextAggregate.redoLastModification();

    if (redoResults.length === 0) return;

    for (const redoResult of redoResults) {
      this.applyRedoToEditor(redoResult, richTextAggregate);
    }

    const lastResult = redoResults[redoResults.length - 1];
    this.setCaret(lastResult.blockId, lastResult.index);
  }

  private applyUndoToEditor(
    undoResult: TeRichTextBlockModification,
    richTextAggregate: TeRichTextAggregate
  ): void {
    switch (undoResult.type) {
      case TeRichTextModificationType.CREATED:
        this.editor.blocks.delete(undoResult.index);
        break;
      case TeRichTextModificationType.DELETED:
        if (this.editor.blocks.getById(undoResult.blockId) != null) {
          this.editor.blocks.delete(this.editor.blocks.getBlockIndex(undoResult.blockId));
        }
        const deletedBlock = richTextAggregate.richText.getBlock(undoResult.blockId);
        this.editor.blocks.insertMany([deletedBlock], undoResult.index);
        break;
      case TeRichTextModificationType.UPDATED:
        const updatedBlock = richTextAggregate.richText.getBlock(undoResult.blockId);
        this.editor.blocks.insertMany([updatedBlock], undoResult.index);
        this.editor.blocks.delete(undoResult.index + 1);
        break;
      case TeRichTextModificationType.MOVED:
        this.editor.blocks.move(undoResult.oldIndex, undoResult.index);
        break;
    }
  }

  private applyRedoToEditor(
    redoResult: TeRichTextBlockModification,
    richTextAggregate: TeRichTextAggregate
  ): void {
    switch (redoResult.type) {
      case TeRichTextModificationType.CREATED:
        if (this.editor.blocks.getById(redoResult.blockId) != null) {
          this.editor.blocks.delete(this.editor.blocks.getBlockIndex(redoResult.blockId));
        }
        const createdBlock = richTextAggregate.richText.getBlock(redoResult.blockId);
        this.editor.blocks.insertMany([createdBlock], redoResult.index);
        break;
      case TeRichTextModificationType.DELETED:
        this.editor.blocks.delete(redoResult.index);
        break;
      case TeRichTextModificationType.UPDATED:
        const updatedBlock = richTextAggregate.richText.getBlock(redoResult.blockId);
        this.editor.blocks.insertMany([updatedBlock], redoResult.index);
        this.editor.blocks.delete(redoResult.index + 1);
        break;
      case TeRichTextModificationType.MOVED:
        this.editor.blocks.move(redoResult.index, redoResult.oldIndex);
        break;
    }
  }

  private setCaret(blockId: string, index: number): void {
    const block = this.editor.blocks.getById(blockId);
    if (block) {
      this.editor.caret.setToBlock(blockId, 'end');
    } else {
      if (index < 0) {
        index = 0;
      }

      if (index >= this.editor.blocks.getBlocksCount()) {
        index = this.editor.blocks.getBlocksCount() - 1;
      }
      this.editor.caret.setToBlock(index, 'end');
    }
  }
}
