import {Component, OnDestroy, OnInit} from '@angular/core';
import {firstValueFrom, Observable, of, Subscription} from 'rxjs';
import {FlDialogService, FlStatusEvent} from '@monorepo/front-core-lib';
import {
  CaLabStatusDialogComponent
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-status-dialog/ca-lab-status-dialog.component';
import {CaLabDetailPageState} from '../../../state/ca-lab-detail-page.state';
import {CaLabDetailServerState} from '../../../state/ca-lab-detail-server.state';
import {CaLabDetailManagerState} from '../../../state/ca-lab-detail-manager.state';
import {catchError, map} from 'rxjs/operators';
import {
  CaLabConfigDialogComponent,
  CaLabConfigDialogInput
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-config-dialog/ca-lab-config-dialog.component';
import {CaLabService} from '../../../../ca-core/service-api/ca-lab.service';

/**
 * Component only accessible by the admin
 */
@Component({
  selector: 'ca-lab-manager',
  templateUrl: './ca-lab-manager.component.html',
  styleUrls: ['./ca-lab-manager.component.scss']
})
export class CaLabManagerComponent implements OnInit, OnDestroy {

  labId: string = this.state.getLabId();

  labManagerStatus$: Observable<FlStatusEvent> = this.managerState.getStatusEvent$();

  refreshIsLoading: boolean = false;

  private subscription: Subscription;

  constructor(private dialogService: FlDialogService,
              private state: CaLabDetailPageState,
              private serverState: CaLabDetailServerState,
              private managerState: CaLabDetailManagerState,
              private labService: CaLabService) {
  }

  ngOnInit(): void {
    this.managerState.init();

    this.subscription = this.managerState.getStatusEvent$().subscribe(
      statusEvent => {
        if (statusEvent.status === 'success' || statusEvent.status === 'error') {
          this.refreshIsLoading = false;
        }
      }
    );
  }

  refresh(): void {
    this.refreshIsLoading = true;
    this.managerState.refreshStatus();
  }

  openStatusDialog(): void {
    this.dialogService.openMediumDialog(CaLabStatusDialogComponent, {data: this.state.getLabId()});
  }

  async updateLabManager(): Promise<void> {
    const recommendedVersion = await firstValueFrom(
      this.managerState.getLabManagerRecommendedVersion$().pipe(
        catchError(() => of(null))
      ));

    const managerVersion = await firstValueFrom(this.managerState.getStatusEvent$()
      .pipe(
        map(statusEvent => {
          if(statusEvent.status !== 'success') {
            return null;
          }else{
            return statusEvent.object.version;
          }
        }),
        catchError(() => of(null))
      ));

    this.serverState.updateLabManager(managerVersion, recommendedVersion);
  }

  openLabConfig(): void {
    const input: CaLabConfigDialogInput = {
      labConfig:  this.labService.getConfig(this.state.getLabId()),
      title: {text: 'lab_installed_brick', translateText: true},
      helpText: {text: 'lab_installed_brick_help', translateText: true}
    }

    this.dialogService.openSmallDialog(CaLabConfigDialogComponent, {data: input});
  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
