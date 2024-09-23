import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaExperiment } from '../../../../../ca-core/model/entities/folder/ca-experiment.class';
import { CaExperimentService } from '../../../../../ca-core/service-api/ca-experiment.service';
import { Observable } from 'rxjs';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { map } from 'rxjs/operators';
import { FlArrayObs, FlEntityArrayObs } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-experiment-detail-page',
  templateUrl: './ca-experiment-detail-page.component.html',
  styleUrls: ['./ca-experiment-detail-page.component.scss']
})
export class CaExperimentDetailPageComponent implements OnInit {

  experimentId$: Observable<string>;
  experiment: CaExperiment;

  isLoading: boolean = true;

  notes: FlArrayObs<CaNote>;

  constructor(private route: ActivatedRoute,
              private experimentService: CaExperimentService,
              private noteService: CaNoteService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => this.init(params.id)
    );
    this.experimentId$ = this.route.params.pipe(
      map(params => params.id)
    );
  }

  private init(id: string): void {
    this.getExperiment(id);
    this.notes = new FlEntityArrayObs(this.noteService.getNotesByExperiment(id));
  }

  private getExperiment(id: string): void {
    this.isLoading = true;
    this.experimentService.findById(id).subscribe({
      next: experiment => this.getExperimentSuccess(experiment),
      error: () => this.isLoading = false
    });
  }

  private getExperimentSuccess(experiment: CaExperiment): void {
    this.experiment = experiment;
    this.isLoading = false;
  }
}
