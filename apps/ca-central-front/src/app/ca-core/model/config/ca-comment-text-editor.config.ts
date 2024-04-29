import {ClStringHelper} from '@monorepo/core-lib';
import {CaProjectService} from '../../service-api/ca-project.service';
import {EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';
import {CaUser} from '../entities/ca-user.class';
import 'quill-mention';
import {CaTextEditorConfig} from '../../../ca-project/module/ca-text-editor/model/ca-text-editor-config.class';
import {CaTextEditorImageLoader} from '../../../ca-project/module/ca-text-editor/model/ca-text-editor-image.class';
import {CaTextEditorState} from '../../../ca-project/module/ca-text-editor/state/ca-text-editor.state';
import {
  CaTextEditorBlockAddButton,
  CaTextEditorSnowButton
} from '../../../ca-project/module/ca-text-editor/model/ca-text-editor.class';

export class CaCommentTextEditorConfig extends CaTextEditorConfig implements CaTextEditorImageLoader {

  sendButtonEvent$: EventEmitter<boolean> = new EventEmitter<boolean>();
  sendEmojiButtonEvent$: EventEmitter<HTMLElement> = new EventEmitter<HTMLElement>();
  userList: CaUser[] = [];

  private projectId: string;

  constructor(private projectService: CaProjectService, private projectId$: Observable<string>, userList?: CaUser[]) {
    super();
    this.projectId$.subscribe(projectId => this.projectId = projectId);
    if (userList) {
      this.userList = userList;
    }
  }

  setUsers(userList: CaUser[]): void {
    this.userList = userList;
  }


  onPasteImage(imgFile: File, state: CaTextEditorState): any {
    return this.insertImageFromFile(imgFile, state);
  }

  public getImageUrl(filename: string): string {
    return this.projectService.getCommentImageUrl(filename, this.projectId);
  }

  getBlockAddButtons(): CaTextEditorBlockAddButton[] {
    return [];
  }

  getExtraModules(): any {
    // force loading of quill-mention module, only when needed
    return {
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        mentionDenotationChars: ['@'],
        source: (searchTerm: string, renderList: any) => {
          const values: any[] = [{id: '0', value: 'everyone'}];
          values.push(...this.userList.map(user => {
            return {id: user.id, value: user.fullname};
          }));
          renderList(values.filter(v => v.value.toLowerCase().includes(searchTerm.toLowerCase())), searchTerm);
        },
        mentionContainerClass: 'mat-elevation-z5'
      }
    };
  }


  getToolbarConfig(): any {
    return {
      container: [
        ['bold', 'italic'],
        // ['link'],
        [{list: 'ordered'}, {list: 'bullet'}],
        ['blockquote'],
        ['code']
      ]
    };
  }

  getSnowButtons(): CaTextEditorSnowButton[] {
    return [
      {
        icon: 'image',
        type: 'fileExplorer',
        onAction: (imgFile: File, state: CaTextEditorState) =>
          this.insertImageFromFile(
            new File([imgFile], ClStringHelper.generateUUID() + '.' + imgFile.name.split('.').pop(),
              {type: imgFile.type}),
            state
          )
      },
      {
        icon: 'sentiment_satisfied',
        type: 'button',
        onAction: (e) => this.openEmojiPanel(e)
      },
      {
        icon: 'send',
        type: 'button',
        tooltip: 'ctrl + return',
        onAction: () => this.sendComment()
      }
    ];
  }

  insertImageFromFile(file: File, state: CaTextEditorState): void {
    const index = state.getCurrentSelectionIndex();
    this.projectService.uploadCommentImage(file, this.projectId).subscribe(
      fileUrl => state.insertImageFromUrl(fileUrl, index)
    );
  }

  openEmojiPanel(event: Event): void {
    this.sendEmojiButtonEvent$.emit(event.target as HTMLElement);
  }

  private sendComment(): void {
    this.sendButtonEvent$.emit(true);
  }

  public destroy(): void {
    this.sendButtonEvent$.complete();
    this.sendEmojiButtonEvent$.complete();
  }
}


export class CaEditCommentTextEditorConfig extends CaCommentTextEditorConfig {

  getSnowButtons(): CaTextEditorSnowButton[] {
    return [
      {
        icon: 'image',
        type: 'fileExplorer',
        onAction: (imgBlob: Blob, state: CaTextEditorState) => this.insertImageFromFile(
          new File([imgBlob], ClStringHelper.generateUUID(), {type: imgBlob.type}),
          state
        )
      },
      {
        icon: 'sentiment_satisfied',
        type: 'button',
        onAction: (e) => this.openEmojiPanel(e)
      },
      {
        icon: 'cancel',
        type: 'button',
        onAction: () => this.sendCancelEditEvent()
      },
      {
        icon: 'save',
        type: 'button',
        onAction: () => this.sendEditEvent()
      }
    ];
  }

  private sendCancelEditEvent(): void {
    this.sendButtonEvent$.emit(false);
  }

  private sendEditEvent(): void {
    this.sendButtonEvent$.emit(true);
  }
}
