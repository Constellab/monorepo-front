import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaExperiment } from '../../../../../ca-core/model/entities/folder/ca-experiment.class';
import { CaExperimentService } from '../../../../../ca-core/service-api/ca-experiment.service';

/**
 * Preview of the experiment in the folder detail page right section
 */
@Component({
  selector: 'ca-folder-experiment-preview',
  templateUrl: './ca-folder-experiment-preview.component.html',
  styleUrls: ['./ca-folder-experiment-preview.component.scss']
})
export class CaFolderExperimentPreviewComponent implements OnInit {

  @Input() experimentId: string;

  experiment$: Observable<CaExperiment>;

  constructor(private experimentService: CaExperimentService) {
  }

  ngOnInit(): void {
    this.experiment$ = this.experimentService.findById(this.experimentId);
  }

}
