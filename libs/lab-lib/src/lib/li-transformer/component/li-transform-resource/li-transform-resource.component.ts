import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ClHelpService } from '@monorepo/core-lib';
import { FlGlobalValidators } from '@monorepo/front-core-lib/fl-core';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlDynamicFieldConfigService } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { LiProcessDynamicFieldConfig } from '@monorepo/lab-lib/li-config';
import {
  LiProcessType,
  LiTransformerWithConfig,
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
  TdTechnicalDocModule,
} from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

interface LiSelectedTransformer {
  transformer: LiProcessType;
  configData: TdConfig;
  hasConfig: boolean;
}

/**
 * Component to transform a resource using transformers.
 * Can add multiple transformer and configure them.
 */
@Component({
  selector: 'li-transform-resource',
  templateUrl: './li-transform-resource.component.html',
  styleUrls: ['./li-transform-resource.component.scss'],
  providers: [
    // configure the dynamic field to support tags and other custom fields
    { provide: FlDynamicFieldConfigService, useClass: LiProcessDynamicFieldConfig },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatButton,
    MatIcon,
    MatAccordion,
    CdkDropList,
    MatExpansionPanel,
    CdkDrag,
    ReactiveFormsModule,
    MatExpansionPanelHeader,
    LiTypeShowDetailButtonComponent,
    MatIconButton,
    CdkDragHandle,
    MatTooltip,
    FlCoreComponentModule,
    FlLoaderModule,
    TranslatePipe,
    TdTechnicalDocModule,
  ],
})
export class LiTransformResourceComponent implements OnInit {
  private typeService = inject(LiTypeService);
  private controlContainer = inject(ControlContainer);
  private cdr = inject(ChangeDetectorRef);
  private dialogService = inject(FlDialogService);

  @Input() resourceTypingName: string;

  selectedTransformers: LiSelectedTransformer[] = [];

  formArray: UntypedFormArray;

  loadingProcessType: boolean = false;

  // Call this method to build the form array before using the component
  public static buildFormArray(
    transformers: LiTransformerWithConfig[] = [],
    arrayMinLength: number = 0
  ): UntypedFormArray {
    const formArray = new UntypedFormArray([], FlGlobalValidators.arrayMinLength(arrayMinLength));
    for (const transformer of transformers) {
      formArray.push(this.buildFormGroup(transformer));
    }
    return formArray;
  }

  private static buildFormGroup(transformer: LiTransformerWithConfig): UntypedFormGroup {
    const configData = TdConfig.fromSpecs(transformer.transformer.configSpecs, transformer.config);
    return new FormBuilder().group({
      transformer: [transformer.transformer],
      config: TdConfigureSpecsFormComponent.buildFormGroup(configData),
    });
  }

  ngOnInit(): void {
    this.formArray = this.controlContainer.control as any;

    // init the selected transformers with form value
    for (const transformer of this.formArray.value) {
      this.createSelectedTransformer(transformer.transformer);
    }
  }

  addTransformer(transformer: LiProcessType): void {
    const selectedTransformer = this.createSelectedTransformer(transformer);

    this.formArray.push(
      new FormGroup({
        transformer: new FormControl(transformer),
        config: TdConfigureSpecsFormComponent.buildFormGroup(selectedTransformer.configData),
      })
    );

    // force the cdr because it can alter the form status, so we need to refresh
    this.cdr.detectChanges();
  }

  private createSelectedTransformer(transformer: LiProcessType): LiSelectedTransformer {
    const configData = TdConfig.fromSpecs(transformer.configSpecs);

    const selectedTransformer: LiSelectedTransformer = {
      transformer: transformer,
      configData: configData,
      hasConfig: transformer.hasConfigSpecs(),
    };

    this.selectedTransformers.push(selectedTransformer);
    return selectedTransformer;
  }

  removeTransformer(index: number, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.selectedTransformers.splice(index, 1);
    this.formArray.removeAt(index);
  }

  drop(event: CdkDragDrop<LiSelectedTransformer[]>): void {
    moveItemInArray(this.selectedTransformers, event.previousIndex, event.currentIndex);
  }

  getFormGroup(index: number): UntypedFormGroup {
    return this.formArray.at(index) as any;
  }

  getConfigFormGroup(index: number): FormGroup<TdConfigureSpecsForm> {
    return this.getFormGroup(index).get('config') as any;
  }

  selectTransformer(): void {
    const data: LiSelectTypeDialogInput = {
      searchConfig: {
        mode: 'transformer',
        resourceTypingNames: [this.resourceTypingName],
      },
    };
    this.dialogService
      .openBigDialog(LiSelectTypeDialogComponent, { data: data })
      .afterClosed()
      .subscribe((processType) => this.loadAndAddTransformer(processType));
  }

  // load the process type object and add it to the form
  private loadAndAddTransformer(processType?: LiTypeEntity): void {
    if (!processType) return;

    this.loadingProcessType = true;
    this.typeService.getTyping(processType.typingName).subscribe({
      next: (processType: LiProcessType) => {
        this.loadingProcessType = false;
        this.addTransformer(processType);
      },
      error: () => (this.loadingProcessType = false),
    });
  }
}
