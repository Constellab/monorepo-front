import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  OutputRefSubscription,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { FlDynamicFieldConfigService } from '@monorepo/front-core-lib/fl-dynamic-field';
import { LabConfigureProtocolComponent } from '../lab-configure-protocol/lab-configure-protocol.component';
import { LabConfigureTaskComponent } from '../lab-configure-task/lab-configure-task.component';
import { LabProcessDashboardConfigState } from '../../state/lab-process-dashboard-config-state.service';
import { LiProcessDashboardDynamicFieldConfig } from '@monorepo/lab-lib/li-config';
import { LiProcess } from '@monorepo/lab-lib/li-core';
import { Observable, Subscription } from 'rxjs';
import { TdAbstractDynamicParamSpecState } from '@monorepo/technical-doc';
import { LabDynamicParamSpecState } from '../../state/lab-dynamic-param-spec.state';

/**
 * Component inside LabConfigureProtocol to configure a process.
 * If the process is a task, it calls LabConfigureTask.
 * If the process is a protocol, it calls LabConfigureProtocol (it will be recursive).
 */
@Component({
  selector: 'lab-configure-process',
  templateUrl: './lab-configure-process.component.html',
  styleUrls: ['./lab-configure-process.component.scss'],
  providers: [
    // configure the dynamic field to support tags and other custom fields
    // enable dynamic config
    { provide: FlDynamicFieldConfigService, useClass: LiProcessDashboardDynamicFieldConfig },
    // configure the dynamic param spec state for dynamic config
    // create the instance at this level so there is only 1 instance per dashboard (even in protocol config)
    // and it is not destroyed when the process changes (if yes it closes the edit dynamic config dialog)
    { provide: TdAbstractDynamicParamSpecState, useClass: LabDynamicParamSpecState },
  ],
})
export class LabConfigureProcessComponent implements OnInit, OnDestroy {
  @Input({ required: true }) process$: Observable<LiProcess>;

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private subscription: Subscription;

  private visibilitySubscription: OutputRefSubscription;

  private dashboardState = inject(LabProcessDashboardConfigState);

  ngOnInit(): void {
    this.subscription = this.process$.subscribe((process) => this.showProcessConfig(process));
  }

  private showProcessConfig(process: LiProcess): void {
    // Check if the config has changed since the last process to avoid reloading the component
    if (!this.dashboardState.configHasChanged(process)) return;
    this.clearViewRef();

    if (process.isProtocol) {
      const componentRef = this.viewContainer.createComponent(LabConfigureProtocolComponent);
      componentRef.instance.protocolId = process.id;
    } else {
      const componentRef = this.viewContainer.createComponent(LabConfigureTaskComponent);
      componentRef.instance.task = process;
    }
  }

  private clearViewRef(): void {
    this.viewContainer?.clear();
  }

  ngOnDestroy(): void {
    this.clearViewRef();
    this.subscription?.unsubscribe();
    this.visibilitySubscription?.unsubscribe();
  }
}
