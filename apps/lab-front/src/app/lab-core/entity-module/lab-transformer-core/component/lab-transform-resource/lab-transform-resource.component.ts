import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { LabTypeEntity } from '../../../../model/entities/lab-type/lab-type.entity';
import { LabConfig } from '../../../../model/entities/lab-config.entity';
import { LabProcessType } from '../../../../model/entities/lab-type/lab-process-type.entity';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ClHelpService } from '@monorepo/core-lib';
import {
  LabConfigureSpecsForm,
  LabConfigureSpecsFormComponent,
} from '../../../lab-config-core/component/lab-configure-specs-form/lab-configure-specs-form.component';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';
import { FlDialogService, FlDynamicFieldConfigService, FlGlobalValidators } from '@monorepo/front-core-lib';
import { LabTransformerWithConfig } from '../../../../model/global/lab-transformer.class';
import { LabTypeService } from '../../../../entity-service/lab-type.service';
import {
  LabSelectTypeDialogComponent,
  LabSelectTypeDialogInput,
} from '../../../lab-type-core/component/lab-select-type-dialog/lab-select-type-dialog.component';
import { LabProcessDynamicFieldConfig } from '../../../lab-config-core/lab-process-dynamic-field-config.service';

interface LabSelectedTransformer {
  transformer: LabProcessType;
  configData: LabConfig;
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
    standalone: false
})
export class LabTransformResourceComponent implements OnInit {
  @Input() resourceTypingName: string;

  selectedTransformers: LabSelectedTransformer[] = [];

  formArray: UntypedFormArray;

  loadingProcessType: boolean = false;

  constructor(
    private typeService: LabTypeService,
    private controlContainer: ControlContainer,
    private cdr: ChangeDetectorRef,
    private dialogService: FlDialogService
  ) {}

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
    const configData = LabConfig.fromSpecs(transformer.transformer.configSpecs, transformer.config);
    return new FormBuilder().group({
      transformer: [transformer.transformer],
      config: LabConfigureSpecsFormComponent.buildFormGroup(configData),
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
        config: LabConfigureSpecsFormComponent.buildFormGroup(selectedTransformer.configData),
      })
    );

    // force the cdr because it can alter the form status, so we need to refresh
    this.cdr.detectChanges();
  }

  private createSelectedTransformer(transformer: LabProcessType): LabSelectedTransformer {
    const configData = LabConfig.fromSpecs(transformer.configSpecs);

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

  getConfigFormGroup(index: number): FormGroup<LabConfigureSpecsForm> {
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
