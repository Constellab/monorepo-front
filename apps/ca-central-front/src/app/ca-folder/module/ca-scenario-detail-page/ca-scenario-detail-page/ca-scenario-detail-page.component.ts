import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaScenario } from '../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaScenarioService } from '../../../../ca-core/service-api/ca-scenario.service';
import { Observable } from 'rxjs';
import { CaNote } from '../../../../ca-core/model/entities/folder/ca-note.class';
import { CaNoteService } from '../../../../ca-core/service-api/ca-note.service';
import { map } from 'rxjs/operators';
import { FlArrayObs, FlEntityArrayObs } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-scenario-detail-page',
  templateUrl: './ca-scenario-detail-page.component.html',
  styleUrls: ['./ca-scenario-detail-page.component.scss'],
  standalone: false,
})
export class CaScenarioDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private scenarioService = inject(CaScenarioService);
  private noteService = inject(CaNoteService);

  scenarioId$: Observable<string>;
  scenario: CaScenario;

  isLoading: boolean = true;

  notes: FlArrayObs<CaNote>;

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.init(params.id));
    this.scenarioId$ = this.route.params.pipe(map((params) => params.id));
  }

  private init(id: string): void {
    this.getScenario(id);
    this.notes = new FlEntityArrayObs(this.noteService.getNotesByScenario(id));
  }

  private getScenario(id: string): void {
    this.isLoading = true;
    this.scenarioService.findById(id).subscribe({
      next: (scenario) => this.getScenarioSuccess(scenario),
      error: () => (this.isLoading = false),
    });
  }

  private getScenarioSuccess(scenario: CaScenario): void {
    this.scenario = scenario;
    this.isLoading = false;
  }
}
