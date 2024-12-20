import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { ActivatedRoute } from '@angular/router';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable, Subscription } from 'rxjs';
import { CaLabDetailServerState } from '../../../state/ca-lab-detail-server.state';
import { LmlLabManagerService, LmlLabManagerState } from '@monorepo/lab-manager-lib';
import { CaLabManagerService } from '../../../state/ca-lab-manager.service';

@Component({
  selector: 'ca-lab-detail-page',
  templateUrl: './ca-lab-detail-page.component.html',
  styleUrls: ['./ca-lab-detail-page.component.scss'],
  providers: [
    CaLabDetailPageState,
    CaLabDetailServerState,
    { provide: LmlLabManagerService, useClass: CaLabManagerService },
    LmlLabManagerState,
  ],
})
export class CaLabDetailPageComponent implements OnInit, OnDestroy {
  lab$: Observable<CaLab>;
  isOwner$: Observable<boolean>;

  isLoading: boolean = false;

  private state = inject(CaLabDetailPageState);
  private route = inject(ActivatedRoute);
  private labManagerState = inject(LmlLabManagerState);

  private subscription: Subscription;

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.getLab(params.id));
  }

  private getLab(id: string): void {
    this.isLoading = true;
    this.state.init(id, this.labManagerState.getStatus$());
    this.lab$ = this.state.getLab$();
    this.isOwner$ = this.state.isLabOwner$();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
