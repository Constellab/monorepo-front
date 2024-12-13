import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { ActivatedRoute } from '@angular/router';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable, Subscription } from 'rxjs';
import { CaLabDetailServerState } from '../../../state/ca-lab-detail-server.state';
import { CaLabManagerState } from '../../../state/ca-lab-manager.state';
import { LmlLabManagerApiService, LmlLabManagerState } from '@monorepo/lab-manager-lib';
import { CaLabManagerApiService } from '../../../state/ca-lab-manager-api.service';

@Component({
  selector: 'ca-lab-detail-page',
  templateUrl: './ca-lab-detail-page.component.html',
  styleUrls: ['./ca-lab-detail-page.component.scss'],
  providers: [
    CaLabDetailPageState,
    CaLabDetailServerState,
    { provide: LmlLabManagerApiService, useClass: CaLabManagerApiService },
    { provide: LmlLabManagerState, useClass: CaLabManagerState },
  ],
})
export class CaLabDetailPageComponent implements OnInit, OnDestroy {
  lab$: Observable<CaLab>;
  isOwner$: Observable<boolean>;

  isLoading: boolean = false;

  private state = inject(CaLabDetailPageState);
  private managerState = inject(LmlLabManagerState);
  private route = inject(ActivatedRoute);
  private labManagerApiService: CaLabManagerApiService = inject(
    LmlLabManagerApiService
  ) as CaLabManagerApiService;

  private subscription: Subscription;

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.getLab(params.id));
  }

  private getLab(id: string): void {
    this.isLoading = true;
    this.state.init(id);
    this.lab$ = this.state.getLab$();
    this.isOwner$ = this.state.isLabOwner$();

    this.labManagerApiService.init(this.state.getLabId());

    this.subscription = this.managerState.getRefreshLabStatus$().subscribe(() => this.state.refreshStatus());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
