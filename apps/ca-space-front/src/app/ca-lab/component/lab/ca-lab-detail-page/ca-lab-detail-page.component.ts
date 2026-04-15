import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LmlBrickService, LmlLabManagerService, LmlLabManagerState } from '@monorepo/lab-manager-lib';
import { Observable, Subscription } from 'rxjs';

import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabDetailConfigPageState } from '../../../state/ca-lab-detail-config-page.state';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabDetailServerState } from '../../../state/ca-lab-detail-server.state';
import { CaLabManagerService } from '../../../state/ca-lab-manager.service';
import { CaLabManagerBrickService } from '../../../state/ca-lab-manager-brick.service';
import { CaLabHeaderComponent } from '../ca-lab-header/ca-lab-header.component';

@Component({
  selector: 'ca-lab-detail-page',
  templateUrl: './ca-lab-detail-page.component.html',
  styleUrls: ['./ca-lab-detail-page.component.scss'],
  providers: [
    CaLabDetailPageState,
    CaLabDetailServerState,
    { provide: LmlLabManagerService, useClass: CaLabManagerService },
    { provide: LmlBrickService, useClass: CaLabManagerBrickService },
    LmlLabManagerState,
    CaLabDetailConfigPageState,
  ],
  imports: [FlSectionModule, CaLabHeaderComponent, RouterOutlet],
})
export class CaLabDetailPageComponent implements OnInit, OnDestroy {
  lab$: Observable<CaLab>;
  isOwner$: Observable<boolean>;

  isLoading: boolean = false;

  private state = inject(CaLabDetailPageState);
  private route = inject(ActivatedRoute);
  private labManagerState = inject(LmlLabManagerState);
  private labManagerBrickService = inject(LmlBrickService) as CaLabManagerBrickService;

  private subscription: Subscription;

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.getLab(params.id));
  }

  private getLab(id: string): void {
    this.isLoading = true;
    this.state.init(id, this.labManagerState.getStatus$());
    this.lab$ = this.state.getLab$();
    this.isOwner$ = this.state.isLabOwner$();
    this.labManagerBrickService.setLabId(id);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
