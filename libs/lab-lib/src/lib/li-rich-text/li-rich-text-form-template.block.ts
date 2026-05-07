import { ApplicationRef, EnvironmentInjector, Type } from '@angular/core';
import { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TeComponentBlock, TeHelper } from '@monorepo/text-editor';

import { LiRichTextFormTemplateComponent } from './component/li-rich-text-form-template/li-rich-text-form-template.component';
import {
  LiRichTextFormTemplateBlockAdditionalData,
  LiRichTextFormTemplateBlockData,
} from './model/li-rich-text-form-block.model';

export class LiRichTextFormTemplateBlock extends TeComponentBlock<LiRichTextFormTemplateComponent> {
  public static readonly TAG_NAME = 'li-note-content-form-template';

  constructor(
    protected options: BlockToolConstructorOptions,
    protected readonly envInjector: EnvironmentInjector,
    protected readonly applicationRef: ApplicationRef,
    protected readonly additionalData: LiRichTextFormTemplateBlockAdditionalData
  ) {
    super(options, envInjector, applicationRef, additionalData);
  }

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('li.form_insert_template'),
      icon: TeHelper.getMatIconElement('description'),
    };
  }

  getComponentType(): Type<LiRichTextFormTemplateComponent> {
    return LiRichTextFormTemplateComponent;
  }

  getTagName(): string {
    return LiRichTextFormTemplateBlock.TAG_NAME;
  }

  initInputs(data: LiRichTextFormTemplateBlockData): void {
    this.componentInstance.formTemplateId = data.form_template_id;
    this.componentInstance.formTemplateVersionId = data.form_template_version_id;
    this.componentInstance.displayName = data.display_name;

    if (data.form_template_id && data.form_template_version_id) {
      this.loadVersionInfo(data);
    }
  }

  save(): BlockToolData {
    return {
      form_template_id: this.componentInstance.formTemplateId,
      form_template_version_id: this.componentInstance.formTemplateVersionId,
      display_name: this.componentInstance.displayName,
    };
  }

  validate(data: LiRichTextFormTemplateBlockData): boolean {
    return !!data.form_template_id && !!data.form_template_version_id;
  }

  override appendCallback(): void {
    this.componentInstance.selectTemplateRequested.subscribe(() => {
      this.openSelectTemplate();
    });
  }

  public async openSelectTemplate(): Promise<void> {
    const { LiSelectFormTemplateDialogComponent } = await import('@monorepo/lab-lib/li-form');
    const dialogService = this.envInjector.get(FlDialogService);
    dialogService
      .openBigDialog(LiSelectFormTemplateDialogComponent)
      .afterClosed()
      .subscribe((template) => {
        if (template == null) return;
        this.selectTemplateVersion(template);
      });
  }

  private loadVersionInfo(data: LiRichTextFormTemplateBlockData): void {
    this.componentInstance.setLoading();
    import('@monorepo/lab-lib/li-form').then(({ LiFormTemplateService }) => {
      const formTemplateService = this.envInjector.get(LiFormTemplateService);
      formTemplateService.getVersion(data.form_template_id, data.form_template_version_id).subscribe({
        next: (version) => {
          this.componentInstance.setVersionInfo(data.display_name || data.form_template_id, version.version);
        },
        error: () => {
          this.componentInstance.setError();
        },
      });
    });
  }

  private selectTemplateVersion(template: { id: string; name: string }): void {
    import('@monorepo/lab-lib/li-form').then(({ LiFormTemplateService }) => {
      const formTemplateService = this.envInjector.get(LiFormTemplateService);
      formTemplateService.getVersions(template.id).subscribe((versions) => {
        const published = versions.find((v) => v.status === 'PUBLISHED');
        const version = published ?? versions[0];
        if (!version) return;

        this.options.data = {
          form_template_id: template.id,
          form_template_version_id: version.id,
          display_name: template.name,
        };
        this.initInputs(this.data);
      });
    });
  }
}
