import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { LabTypeEntity } from '../../../../model/entities/lab-type/lab-type.entity';
import { LabProcessType } from '../../../../model/entities/lab-type/lab-process-type.entity';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ClHelpService } from '@monorepo/core-lib';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlDynamicFieldConfigService } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlGlobalValidators } from '@monorepo/front-core-lib/fl-core';
import { LabTransformerWithConfig } from '../../../../model/global/lab-transformer.class';
import { LabTypeService } from '../../../../entity-service/lab-type.service';
import {
  LabSelectTypeDialogComponent,
  LabSelectTypeDialogInput,
} from '../../../lab-type-core/component/lab-select-type-dialog/lab-select-type-dialog.component';
import { LabProcessDynamicFieldConfig } from '../../../lab-config-core/lab-process-dynamic-field-config.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { LabTypeShowDetailButtonComponent } from '../../../lab-type-core/component/lab-type-show-detail-button/lab-type-show-detail-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import {
  TdConfig,
  TdConfigureSpecsForm,
  TdConfigureSpecsFormComponent,
  TdTechnicalDocModule,
} from '@monorepo/technical-doc';

interface LabSelectedTransformer {
  transformer: LabProcessType;
  configData: TdConfig;
  hasConfig: boolean;
}

/**
 * Component to transform a resource using transformers.
 * Can add multiple transformer and configure them.
 */
@Component({
  selector: 'lab-transform-resource',
  templateUrl: './lab-transform-resource.component.html',
  styleUrls: ['./lab-transform-resource.component.scss'],
  providers: [
    // configure the dynamic field to support tags and other custom fields
    { provide: FlDynamicFieldConfigService, useClass: LabProcessDynamicFieldConfig },
  ],
  imports: [
    MatButton,
    MatIcon,
    MatAccordion,
    CdkDropList,
    MatExpansionPanel,
    CdkDrag,
    ReactiveFormsModule,
    MatExpansionPanelHeader,
    LabTypeShowDetailButtonComponent,
    MatIconButton,
    CdkDragHandle,
    MatTooltip,
    FlCoreComponentModule,
    FlLoaderModule,
    TranslatePipe,
    TdTechnicalDocModule,
  ],
})
export class LabTransformResourceComponent implements OnInit {
  private typeService = inject(LabTypeService);
  private controlContainer = inject(ControlContainer);
  private cdr = inject(ChangeDetectorRef);
  private dialogService = inject(FlDialogService);

  @Input() resourceTypingName: string;

  selectedTransformers: LabSelectedTransformer[] = [];

  formArray: UntypedFormArray;

  loadingProcessType: boolean = false;

  // Call this method to build the form array before using the component
  public static buildFormArray(
    transformers: LabTransformerWithConfig[] = [],
    arrayMinLength: number = 0
  ): UntypedFormArray {
    const formArray = new FormArray([], FlGlobalValidators.arrayMinLength(arrayMinLength));
    for (const transformer of transformers) {
      formArray.push(this.buildFormGroup(transformer));
    }
    return formArray;
  }

  private static buildFormGroup(transformer: LabTransformerWithConfig): UntypedFormGroup {
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

  addTransformer(transformer: LabProcessType): void {
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

  private createSelectedTransformer(transformer: LabProcessType): LabSelectedTransformer {
    const configData = TdConfig.fromSpecs(transformer.configSpecs);

    const selectedTransformer: LabSelectedTransformer = {
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

  drop(event: CdkDragDrop<LabSelectedTransformer[]>): void {
    moveItemInArray(this.selectedTransformers, event.previousIndex, event.currentIndex);
  }

  getFormGroup(index: number): UntypedFormGroup {
    return this.formArray.at(index) as any;
  }

  getConfigFormGroup(index: number): FormGroup<TdConfigureSpecsForm> {
    return this.getFormGroup(index).get('config') as any;
  }

  selectTransformer(): void {
    const data: LabSelectTypeDialogInput = {
      searchConfig: {
        mode: 'transformer',
        resourceTypingNames: [this.resourceTypingName],
      },
    };
    this.dialogService
      .openBigDialog(LabSelectTypeDialogComponent, { data: data })
      .afterClosed()
      .subscribe((processType) => this.loadAndAddTransformer(processType));
  }

  // load the process type object and add it to the form
  private loadAndAddTransformer(processType?: LabTypeEntity): void {
    if (!processType) return;

    this.loadingProcessType = true;
    this.typeService.getTyping(processType.typingName).subscribe({
      next: (processType: LabProcessType) => {
        this.loadingProcessType = false;
        this.addTransformer(processType);
      },
      error: () => (this.loadingProcessType = false),
    });
  }
}
