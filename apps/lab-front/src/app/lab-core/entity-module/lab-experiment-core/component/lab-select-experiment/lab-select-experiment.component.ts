import {Component, EventEmitter, OnInit, Optional, Output, Self} from '@angular/core';
import {FlDialogService, FlFormFieldDirective, FlInputSearchAdvancedButton} from '@monorepo/front-core-lib';
import {LabExperiment, LabExperimentDatasource} from '../../../../model/entities/lab-experiment.entity';
import {NgControl} from '@angular/forms';
import {LabExperimentService} from '../../../../entity-service/lab-experiment.service';
import {Observable} from 'rxjs';
import {
  LabSelectExperimentDialogComponent
} from '../lab-select-experiment-dialog/lab-select-experiment-dialog.component';

@Component({
  selector: 'lab-select-experiment',
  templateUrl: './lab-select-experiment.component.html',
  styleUrls: ['./lab-select-experiment.component.scss'],
  providers: [{provide: FlFormFieldDirective, useExisting: LabSelectExperimentComponent}]
})
export class LabSelectExperimentComponent extends FlFormFieldDirective<LabExperiment>
  implements OnInit {

  @Output() experimentChange: EventEmitter<LabExperiment> = new EventEmitter();

  selectedExperiment: LabExperiment | Observable<LabExperiment>;

  datasource: LabExperimentDatasource;

  advancedButton: FlInputSearchAdvancedButton<LabExperiment>;


  constructor(@Optional() @Self() ngControl: NgControl,
              private experimentService: LabExperimentService,
              private dialogService: FlDialogService) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.experimentService.searchByTitleDatasource();

    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LabSelectExperimentDialogComponent).afterClosed()
    };
  }

  writeValue(obj: LabExperiment): void {
    if (obj == null || obj.id == null) {
      this.selectedExperiment = null;
      this.value = null;
      return;
    }

    // if the provided object is not an instance of LabExperiment, load it from the api
    if (!(obj instanceof LabExperiment)) {
      this.selectedExperiment = this.experimentService.getExperiment((obj as any).id);
    } else {
      this.selectedExperiment = obj;
    }
    this.value = obj;
  }

  callChangeEvent(value: LabExperiment): void {
    this.experimentChange.next(value);
    this.selectedExperiment = value;
  }

  onDisableChange(): void {
  }


}
