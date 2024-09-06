import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaExperiment } from '../../../../../ca-core/model/entities/project/ca-experiment.class';
import { CaExperimentService } from '../../../../../ca-core/service-api/ca-experiment.service';

/**
 * Preview of the experiment in the project detail page right section
 */
@Component({
  selector: 'ca-project-experiment-preview',
  templateUrl: './ca-project-experiment-preview.component.html',
  styleUrls: ['./ca-project-experiment-preview.component.scss']
})
export class CaProjectExperimentPreviewComponent implements OnInit {

  @Input() experimentId: string;

  experiment$: Observable<CaExperiment>;

  constructor(private experimentService: CaExperimentService) {
  }

  ngOnInit(): void {
    this.experiment$ = this.experimentService.findById(this.experimentId);
  }

}
