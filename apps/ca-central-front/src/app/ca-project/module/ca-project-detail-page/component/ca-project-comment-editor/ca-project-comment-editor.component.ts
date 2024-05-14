import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TeRichText, TeRichTextContent} from '@monorepo/text-editor';
import {CaProjectCommentTextEditorConfig} from '../../../../../ca-core/model/config/ca-comment-text-editor.config';
import {CaProjectDetailState} from '../../state/ca-project-detail.state';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';

@Component({
  selector: 'ca-project-comment-editor',
  templateUrl: './ca-project-comment-editor.component.html',
  styleUrl: './ca-project-comment-editor.component.scss'
})
export class CaProjectCommentEditorComponent implements OnInit, OnDestroy {

  @Input({required: true}) mode: 'create' | 'update';

  @Input() commentContent: TeRichTextContent;

  @Output() send = new EventEmitter<TeRichTextContent>();
  @Output() cancel = new EventEmitter<void>();

  textEditorConfig: CaProjectCommentTextEditorConfig;

  contentForm: TeRichTextContent;

  constructor(private state: CaProjectDetailState,
              private projectService: CaProjectService) {
  }

  ngOnInit(): void {
    this.textEditorConfig = new CaProjectCommentTextEditorConfig(
      this.state.getProjectId$(), this.projectService, this.mode);
    this.contentForm = this.commentContent;
  }

  enterEvent(event: Event): void {
    event.preventDefault();
    this.sendComment();
  }

  sendComment(): void {
    // timeout to let the value this.newComment be updated
    setTimeout(() => {
      if (!TeRichText.isEmpty(this.contentForm)) {
        this.send.emit(this.contentForm);
        this.contentForm = null;
      }
    }, 100);
  }

  cancelEdit(): void {
    this.cancel.emit();
  }

  addFigureBlock(): void {
    this.textEditorConfig.addFigureBlock();
  }

  ngOnDestroy(): void {
    this.textEditorConfig?.destroy();
  }


}
