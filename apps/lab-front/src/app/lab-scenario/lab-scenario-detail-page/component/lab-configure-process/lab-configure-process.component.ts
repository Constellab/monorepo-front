import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  OutputRefSubscription,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LabConfigureProtocolComponent } from '../lab-configure-protocol/lab-configure-protocol.component';
import { LabConfigureTaskComponent } from '../lab-configure-task/lab-configure-task.component';
import { LabProcessDashboardConfigState } from '../../state/lab-process-dashboard-config-state.service';
import { LabProcess } from '../../../../lab-core/model/entities/process/lab-process.entity';
import { FlDynamicFieldConfigService } from '@monorepo/front-core-lib';
import {
  LabProcessDashboardDynamicFieldConfig,
} from '../../../../lab-core/entity-module/lab-config-core/lab-process-dynamic-field-config.service';
import { TdAbstractDynamicParamSpecState } from '@monorepo/technical-doc';
import {
  LabDynamicParamSpecState,
} from '../../../../lab-core/entity-module/lab-config-core/state/lab-dynamic-param-spec.state';

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
    { provide: FlDynamicFieldConfigService, useClass: LabProcessDashboardDynamicFieldConfig },
    // configure the dynamic param spec state for dynamic config
    // create the instance at this level so there is only 1 instance per dashboard (even in protocol config)
    // and it is not destroyed when the process changes (if yes it closes the edit dynamic config dialog)
    { provide: TdAbstractDynamicParamSpecState, useClass: LabDynamicParamSpecState },
  ],
})
export class LabConfigureProcessComponent implements OnInit, OnDestroy {
  @Input({ required: true }) process$: Observable<LabProcess>;

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private subscription: Subscription;

  private visibilitySubscription: OutputRefSubscription;

  private dashboardState = inject(LabProcessDashboardConfigState);

  ngOnInit(): void {
    this.subscription = this.process$.subscribe((process) => this.showProcessConfig(process));
  }

  private showProcessConfig(process: LabProcess): void {
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
