import {ClPageI} from '@monorepo/core-lib';
import {CaProjectService} from '../../service-api/ca-project.service';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';
import {first, mergeMap, Observable} from 'rxjs';
import {CaUser} from '../entities/ca-user.class';
import {
  TeAdditionalConfig,
  TeCleanStyleInlineTool,
  TeComponentInitData,
  TeConfig,
  TeFakeInlineTool,
  TeFigureBlockConfig,
  TeStrikethroughInlineTool,
  TeTools,
  TeUnderlineInlineTool,
  TeUploadedImage
} from '@monorepo/text-editor';


export class CaProjectCommentTextEditorImageConfig implements TeFigureBlockConfig {

  private projectId: string;

  constructor(private projectId$: Observable<string>,
              private projectService: CaProjectService) {
    // TODO TO IMPROVE
    this.projectId$.subscribe(projectId => this.projectId = projectId);
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.projectId$.pipe(
      first(),
      mergeMap(
        projectId => this.projectService.uploadCommentImage(file, projectId)
      )
    );
  }

  getImageUrl(filename: string): string {
    return this.projectService.getCommentImageUrl(filename, this.projectId);
  }


}

/**
 * Config for the text editor in the report to support view in the editor
 */
export class CaProjectCommentTextEditorConfig extends TeConfig {

  constructor(private projectId$: Observable<string>,
              private projectService: CaProjectService,
              private mode: 'create' | 'update' = 'create') {
    super({
      hideToolbar: true,
      dense: true
    });
    this.initEvent();
  }

  /**
   * Get the complete config and add the view block and configure the image block
   * @param envInjector
   * @param applicationRef
   */
  getTools(envInjector: EnvironmentInjector,
           applicationRef: ApplicationRef): TeTools {

    // configure and add the image block
    const imageConfig = new CaProjectCommentTextEditorImageConfig(this.projectId$, this.projectService);

    const config = {
      paragraph: this.getParagraphConfig(),
      list: this.getListConfig(),
      figure: this.getImageConfig(imageConfig, envInjector, applicationRef),

      underline: TeUnderlineInlineTool,
      strikethrough: TeStrikethroughInlineTool,
      inlineCode: this.getInlineCodeConfig(),
      cleanStyle: TeCleanStyleInlineTool,
      fake: TeFakeInlineTool
    };

    // only enable mention on create mode
    if (this.mode === 'create') {
      (config as any).mention = this.getMentionConfig();
    }

    return config;
  }


  getAdditionalConfig(): TeAdditionalConfig {
    return {
      emoji: true,
      mention: {
        getUsers: (name, page, pageSize) => this.getUsers(name, page, pageSize)
      }
    };
  }

  private getUsers(name: string, page: number, pageSize: number): Observable<ClPageI<CaUser>> {
    return this.projectId$.pipe(
      first(),
      mergeMap(
        projectId => this.projectService.searchProjectUser(projectId, name, page, pageSize)
      )
    );
  }

  getTunes(): string[] {
    return [];
  }

  getInlineToolbar(): string[] {
    const toolbar = ['bold', 'italic', 'underline', 'strikethrough', 'link', 'inlineCode', 'cleanStyle'];
    if (this.mode === 'create') {
      toolbar.push('mention');
    }
    return toolbar;
  }

  addFigureBlock(): void {
    this.addEvent({
      type: 'insertBlock',
      blockType: 'figure',
      data: {
        forceNewElement: true
      } as TeComponentInitData
    });
  }

}
