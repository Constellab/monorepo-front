import {Component, Inject, OnInit} from '@angular/core';
import {LabResourceViewSpecWithConfig} from '../../../../../lab-core/model/entities/resource/lab-resource-view.entity';
import {ClHelpService} from '@monorepo/core-lib';
import {TdTaskViewerConfig} from '@monorepo/technical-doc';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LabTypeEntity} from '../../../../../lab-core/model/entities/lab-type/lab-type.entity';


export type LabConfigureViewerDialogInput = TdTaskViewerConfig;

/**
 * Component used in the workflow to configure the ViewTask
 */
@Component({
  selector: 'lab-configure-viewer-dialog',
  templateUrl: './lab-configure-viewer-dialog.component.html',
  styleUrls: ['./lab-configure-viewer-dialog.component.scss']
})
export class LabConfigureViewerDialogComponent implements OnInit {

  taskConfig: TdTaskViewerConfig;

  resourceType: Partial<LabTypeEntity>;

  constructor(@Inject(MAT_DIALOG_DATA) private input: LabConfigureViewerDialogInput,
              private dialogRef: MatDialogRef<LabConfigureViewerDialogComponent>) {
    this.taskConfig = ClHelpService.deepClone(input);
    this.resourceType = {
      typingName: input.resource_typing_name
    };
  }

  ngOnInit(): void {
  }

  onResourceTypingChange(resourceType: LabTypeEntity): void {
    this.taskConfig.view_config = null;
    this.taskConfig.resource_typing_name = resourceType?.typingName ?? null;
  }

  onViewConfigured(configuration: LabResourceViewSpecWithConfig): void {
    this.taskConfig.view_config = {
      view_method_name: configuration.viewMethodName,
      config_values: configuration.viewConfigValues,
    };
  }

  save(): void {
    this.dialogRef.close(this.taskConfig);
  }

}
