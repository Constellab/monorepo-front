import { Component, OnInit } from '@angular/core';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { ActivatedRoute } from '@angular/router';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';
import { CaLabDetailServerState } from '../../../state/ca-lab-detail-server.state';
import { CaLabDetailManagerState } from '../../../state/ca-lab-detail-manager.state';

@Component({
  selector: 'ca-lab-detail-page',
  templateUrl: './ca-lab-detail-page.component.html',
  styleUrls: ['./ca-lab-detail-page.component.scss'],
  providers: [CaLabDetailPageState,
    CaLabDetailServerState, CaLabDetailManagerState]
})
export class CaLabDetailPageComponent implements OnInit {

  lab$: Observable<CaLab>;
  isOwner$: Observable<boolean>;

  isLoading: boolean = false;

  constructor(private state: CaLabDetailPageState,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => this.getLab(params.id)
    );
  }

  private getLab(id: string): void {
    this.isLoading = true;
    this.state.init(id);
    this.lab$ = this.state.getLab$();
    this.isOwner$ = this.state.isLabOwner$();
  }
}
