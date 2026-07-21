import { ChangeDetectionStrategy,Component, computed, inject, Injector, OnInit, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlDrawerModule } from '@monorepo/front-core-lib/fl-drawer';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlStatus, FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import {
  LiForm,
  LiFormTemplate,
  LiFormTemplateVersion,
  LiFormTemplateVersionStatus,
  LiFormTemplateVersionSummary,
  LiRouterService,
  LiTagDatasource,
  LiTagService,
} from '@monorepo/lab-lib/li-core';
import { LiObjectCreationInfoComponent } from '@monorepo/lab-lib/li-entity';
import {
  LiCreateFormDialogComponent,
  LiCreateFormDialogInput,
  LiFormTemplateActionEvent,
  LiFormTemplateActionMenu,
  LiFormTemplateDuplicateDialogComponent,
  LiFormTemplateDuplicateDialogInput,
  LiFormTemplateDynamicParamSpecState,
  LiFormTemplateService,
  LiFormTemplateVersionEditorComponent,
  LiFormTestVersionDialogComponent,
  LiFormTestVersionDialogInput,
  liGetFormTemplateVersionStatus,
} from '@monorepo/lab-lib/li-form';
import { LiTagListComponent } from '@monorepo/lab-lib/li-tag';
import { TdAbstractDynamicParamSpecState } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-form-template-detail-page',
  templateUrl: './lab-form-template-detail-page.component.html',
  styleUrl: './lab-form-template-detail-page.component.scss',
  imports: [
    FlSectionModule,
    FlTextIconModule,
    FlCardModule,
    FlDrawerModule,
    FlFormModule,
    FlIconModule,
    FlStatusModule,
    MatIconButton,
    MatButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    RouterLink,
    LiTagListComponent,
    LiObjectCreationInfoComponent,
    LiFormTemplateVersionEditorComponent,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    LiFormTemplateDynamicParamSpecState,
    { provide: TdAbstractDynamicParamSpecState, useExisting: LiFormTemplateDynamicParamSpecState },
  ],
})
export class LabFormTemplateDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private injector = inject(Injector);
  private routerService = inject(LiRouterService);
  private formTemplateService = inject(LiFormTemplateService);
  private dialogService = inject(FlDialogService);
  private tagService = inject(LiTagService);
  private dynamicState = inject(LiFormTemplateDynamicParamSpecState);

  template = signal<LiFormTemplate>(null);
  versions = signal<LiFormTemplateVersionSummary[]>([]);
  selectedVersion = signal<LiFormTemplateVersion>(null);
  tags$ = signal<LiTagDatasource>(null);
  isLoading = signal(false);
  isVersionLoading = signal(false);

  isReadonly = computed(() => this.selectedVersion()?.status !== 'DRAFT');

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.init(params));
  }

  private init(params: Record<string, string>): void {
    const templateId = params['templateId'];
    const versionId = params['versionId'];

    // Same template already loaded — just switch version
    if (this.template()?.id === templateId) {
      const targetVersionId = versionId || this.resolveDefaultVersionId();
      if (targetVersionId) {
        this.loadVersion(templateId, targetVersionId);
      }
      return;
    }

    this.isLoading.set(true);
    this.formTemplateService.getById(templateId).subscribe({
      next: (template) => {
        this.template.set(template);
        this.tags$.set(this.tagService.getEntityTagsDatasource('FORM_TEMPLATE', template.id));
        this.isLoading.set(false);

        this.loadVersions(template.id, versionId);
      },
      error: () => this.isLoading.set(false),
    });
  }

  private loadVersion(templateId: string, versionId: string): void {
    this.isVersionLoading.set(true);
    this.formTemplateService.getVersion(templateId, versionId).subscribe({
      next: (version) => {
        this.selectedVersion.set(version);
        this.isVersionLoading.set(false);
      },
      error: () => this.isVersionLoading.set(false),
    });
  }

  getVersionStatus(version: LiFormTemplateVersionSummary): FlStatus<LiFormTemplateVersionStatus> {
    return liGetFormTemplateVersionStatus(version.status);
  }

  getVersionRoute(version: LiFormTemplateVersionSummary): string {
    return LiRouterService.getFormTemplateVersionRoute(this.template().id, version.id);
  }

  isSelectedVersion(version: LiFormTemplateVersionSummary): boolean {
    return this.selectedVersion()?.id === version.id;
  }

  updateName(name: string): void {
    this.formTemplateService.update(this.template().id, { name }).subscribe((updated) => {
      const t = this.template();
      t.name = updated.name;
      this.template.set(t);
    });
  }

  updateDescription(description: string): void {
    this.formTemplateService.update(this.template().id, { description }).subscribe((updated) => {
      const t = this.template();
      t.description = updated.description;
      this.template.set(t);
    });
  }

  openActionMenu(event: MouseEvent): void {
    const actionMenu = new LiFormTemplateActionMenu(this.injector, this.template(), this.tags$());
    actionMenu.openDetailActionMenu(event).subscribe((action) => this.onTemplateAction(action));
  }

  private onTemplateAction(action: LiFormTemplateActionEvent): void {
    switch (action.action) {
      case 'delete':
        this.routerService.navigateToFormTemplateDetail('');
        break;
      case 'archive':
      case 'unarchive':
        this.template.set(action.template);
        break;
    }
  }

  createNewDraft(): void {
    const template = this.template();
    this.formTemplateService.createVersion(template.id, {}).subscribe((version) => {
      this.reloadTemplate(version.id);
    });
  }

  publishVersion(): void {
    const input: FlConfirmDialogInput = {
      title: 'li.form_publish_version',
      content: 'li.form_publish_version_confirmation',
      observable: this.formTemplateService.publishVersion(this.template().id, this.selectedVersion().id),
      successMessage: 'li.form_version_published',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult<LiFormTemplateVersion>) => {
        if (result?.choice) {
          this.reloadTemplate(this.selectedVersion().id);
        }
      });
  }

  archiveVersion(): void {
    const input: FlConfirmDialogInput = {
      title: 'li.form_archive_version',
      content: 'li.form_archive_version_confirmation',
      observable: this.formTemplateService.archiveVersion(this.template().id, this.selectedVersion().id),
      successMessage: 'li.form_version_archived',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult<LiFormTemplateVersion>) => {
        if (result?.choice) {
          this.reloadTemplate(this.selectedVersion().id);
        }
      });
  }

  unarchiveVersion(): void {
    const input: FlConfirmDialogInput = {
      title: 'li.form_unarchive_version',
      content: 'li.form_unarchive_version_confirmation',
      observable: this.formTemplateService.unarchiveVersion(this.template().id, this.selectedVersion().id),
      successMessage: 'li.form_version_unarchived',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult<LiFormTemplateVersion>) => {
        if (result?.choice) {
          this.reloadTemplate(this.selectedVersion().id);
        }
      });
  }

  testVersion(): void {
    const data: LiFormTestVersionDialogInput = {
      templateId: this.template().id,
      versionId: this.selectedVersion().id,
      specs: this.dynamicState.getParamSpecs(),
    };
    this.dialogService.openMediumDialog(LiFormTestVersionDialogComponent, { data });
  }

  createFormFromVersion(): void {
    const data: LiCreateFormDialogInput = {
      mode: 'create',
      object: {
        name: null,
        template: this.template(),
        versionId: this.selectedVersion().id,
      },
    };

    this.dialogService
      .openSmallDialog(LiCreateFormDialogComponent, { data })
      .afterClosed()
      .subscribe((form: LiForm) => {
        if (form) {
          this.routerService.navigateToFormDetail(form.id);
        }
      });
  }

  createDraftFromVersion(): void {
    const dto = { copy_from_version_id: this.selectedVersion().id };
    this.formTemplateService.createVersion(this.template().id, dto).subscribe((version) => {
      this.reloadTemplate(version.id);
    });
  }

  duplicateFromVersion(): void {
    const data: LiFormTemplateDuplicateDialogInput = {
      mode: 'create',
      object: null,
      template: this.template(),
      version: this.selectedVersion(),
    };

    this.dialogService
      .openSmallDialog(LiFormTemplateDuplicateDialogComponent, { data })
      .afterClosed()
      .subscribe((newTemplate: LiFormTemplate) => {
        if (newTemplate) {
          this.routerService.navigateToFormTemplateDetail(newTemplate.id);
        }
      });
  }

  deleteVersion(): void {
    const input: FlConfirmDialogInput = {
      title: 'li.form_delete_version',
      content: 'li.form_delete_version_confirmation',
      observable: this.formTemplateService.deleteVersion(this.template().id, this.selectedVersion().id),
      successMessage: 'li.form_version_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult<void>) => {
        if (result?.choice) {
          this.reloadTemplate();
        }
      });
  }

  onVersionUpdated(version: LiFormTemplateVersion): void {
    this.selectedVersion.set(version);
  }

  private resolveDefaultVersionId(): string | null {
    const versions = this.versions();
    if (versions.length > 0) return versions[0].id;
    return null;
  }

  private loadVersions(templateId: string, targetVersionId?: string): void {
    this.formTemplateService.getVersions(templateId).subscribe((versions) => {
      this.versions.set(versions);
      const versionId = targetVersionId || (versions.length > 0 ? versions[0].id : null);
      if (versionId) {
        this.loadVersion(templateId, versionId);
      }
    });
  }

  private reloadTemplate(keepVersionId?: string): void {
    this.formTemplateService.getById(this.template().id).subscribe((template) => {
      this.template.set(template);
      this.formTemplateService.getVersions(template.id).subscribe((versions) => {
        this.versions.set(versions);
        const targetVersionId = keepVersionId || (versions.length > 0 ? versions[0].id : null);
        if (targetVersionId) {
          this.loadVersion(template.id, targetVersionId);
          this.routerService.navigateToFormTemplateVersion(template.id, targetVersionId);
        }
      });
    });
  }
}
