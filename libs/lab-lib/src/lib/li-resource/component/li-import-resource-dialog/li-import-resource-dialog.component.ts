import { Component, inject,OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlFormHelper } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlDynamicFieldConfigService } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { LiProcessDynamicFieldConfig } from '@monorepo/lab-lib/li-config';
import {
  LiProcessType,
  LiResource,
  LiResourceService,
  LiRouterService,
  LiTypeEntity,
  LiTypeService,
} from '@monorepo/lab-lib/li-core';
import {
  LiSelectTypeDialogComponent,
  LiSelectTypeDialogInput,
  LiTypeShowDetailButtonComponent,
} from '@monorepo/lab-lib/li-type';
import {
  TdConfig,
  TdConfigureSpecsForm,
  TdConfigureSpecsFormComponent,
  TdIOSpec,
  TdParamSpecsValues,
  TdTechnicalDocModule,
  TdTypingName,
} from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

export interface LiImportResourceDialogInput {
  resourceId: string;
  resourceHumanName: string;
  resourceTypingName: string;
  nodeExtension: string;
}

/**
 * Dialog to config a resource import and call import
 */
@Component({
  selector: 'li-import-resource-dialog',
  templateUrl: './li-import-resource-dialog.component.html',
  styleUrls: ['./li-import-resource-dialog.component.scss'],
  providers: [
    // configure the dynamic field to support tags and other custom fields
    { provide: FlDynamicFieldConfigService, useClass: LiProcessDynamicFieldConfig },
  ],
  imports: [
    FlDialogModule,
    MatDialogContent,
    MatButton,
    FlLoaderModule,
    ReactiveFormsModule,
    MatDivider,
    LiTypeShowDetailButtonComponent,
    TdTechnicalDocModule,
    MatIcon,
    MatTooltip,
    TranslatePipe,
  ],
})
export class LiImportResourceDialogComponent implements OnInit, OnDestroy {
  formGp: FormGroup<TdConfigureSpecsForm>;

  selectedImporterType: LiProcessType = null;
  sourceSpec: TdIOSpec;
  targetSpec: TdIOSpec;

  configData: TdConfig;

  processTypeIsLoading: boolean = false;
  callIsLoading: boolean = false;

  communityHelpUrl: string;

  private detailOverlayRef: FlOverlayRef;

  private input: LiImportResourceDialogInput = inject(MAT_DIALOG_DATA);
  private dialogService = inject(FlDialogService);
  private dialogRef = inject(MatDialogRef);
  private resourceService = inject(LiResourceService);
  private typingService = inject(LiTypeService);
  private routerService = inject(LiRouterService);
  private snackBarService = inject(FlSnackBarService);
  private communityHelper = inject(CoCommunityHelperService);

  ngOnInit(): void {
    this.communityHelpUrl = this.communityHelper.getImportResourceDocUrl();

    const defaultImporter = this.getDefaultImporterTypingName(this.input.nodeExtension);

    if (defaultImporter) {
      this.loadImporterType(defaultImporter);
    } else {
      this.openImportSelectDialog();
    }
  }

  openImportSelectDialog(): void {
    const input: LiSelectTypeDialogInput = {
      searchConfig: {
        mode: 'importer',
        resourceTypingName: this.input.resourceTypingName,
        extension: this.input.nodeExtension,
      },
      title: 'li.select_importer',
      helpText: { text: 'li.select_importer_help', translateText: true },
    };

    this.dialogService
      .openBigDialog(LiSelectTypeDialogComponent, { data: input })
      .afterClosed()
      .subscribe((importer: LiTypeEntity) => this.loadImporterType(importer?.typingName ?? null));
  }

  private loadImporterType(importerTypingName: string): void {
    if (importerTypingName == null || importerTypingName === this.selectedImporterType?.typingName) return;

    this.setImporterType(null);
    this.processTypeIsLoading = true;

    // timeout is useful to let the page refresh to the is recreated even if
    // the observable finished quickly
    setTimeout(
      () =>
        this.typingService.getTyping(importerTypingName).subscribe({
          next: (importer: LiProcessType) => this.selectImporter(importer),
          error: () => (this.processTypeIsLoading = false),
        }),
      0
    );
  }

  selectImporter(importer: LiProcessType): void {
    this.processTypeIsLoading = false;
    this.setImporterType(importer);
  }

  private setImporterType(importer?: LiProcessType): void {
    if (importer == null) {
      this.selectedImporterType = null;
      this.sourceSpec = null;
      this.targetSpec = null;
      this.formGp = null;
      this.configData = null;
    } else {
      this.selectedImporterType = importer;
      this.sourceSpec = importer.getSourceInputSpec();
      this.targetSpec = importer.getTargetOutputSpec();
      this.configData = TdConfig.fromSpecs(importer.configSpecs);
      this.formGp = TdConfigureSpecsFormComponent.buildFormGroup(this.configData);
    }
  }

  get showNoConfigMessage(): boolean {
    return this.selectedImporterType && !this.selectedImporterType.hasConfigSpecs();
  }

  submit(): void {
    if (this.callIsLoading) return;
    if (this.formGp.valid) {
      const value: TdParamSpecsValues = TdConfigureSpecsFormComponent.buildValues(this.formGp);
      this.callImport(value);
    } else {
      FlFormHelper.markAllAsTouched(this.formGp);
    }
  }

  private callImport(configValue: TdParamSpecsValues): void {
    this.callIsLoading = true;
    this.resourceService
      .callImporter(this.input.resourceId, this.selectedImporterType.typingName, configValue)
      .subscribe({
        next: (resource) => this.callImportSuccess(resource),
        error: () => (this.callIsLoading = false),
      });
  }

  private callImportSuccess(resource: LiResource): void {
    this.snackBarService.openSuccessMessage({ text: 'li.resource_imported', translateText: true });
    this.routerService.navigateToResourceDetail(resource.id);
    this.dialogRef.close();
  }

  // get default importer typing name based on file extension
  private getDefaultImporterTypingName(extension: string): string | null {
    if (['csv', 'tsv', 'xls', 'xlsx'].includes(extension)) {
      return TdTypingName.importer.tableImporter;
    } else if (extension === 'json') {
      return TdTypingName.importer.jsonImporter;
    } else if (extension === 'txt') {
      return TdTypingName.importer.textImporter;
    } else if (['zip', 'tar', 'tar.gz', 'gz'].includes(extension)) {
      return TdTypingName.importer.decompressImporter;
    }

    return null;
  }

  ngOnDestroy(): void {
    // on dialog close, close the overlay ref
    this.detailOverlayRef?.dispose();
  }
}
