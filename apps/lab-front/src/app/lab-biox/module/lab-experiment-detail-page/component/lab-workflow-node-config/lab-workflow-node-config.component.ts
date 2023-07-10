import {ChangeDetectionStrategy, Component, computed, OnInit, signal, Signal} from '@angular/core';
import {A, LabWorkflowNodeDetailState} from '../../state/lab-workflow-node-detail.state';
import {LabProcess} from '../../../../../lab-core/model/entities/process/lab-process.entity';


/**
 * Show the config current values as json
 */
@Component({
  selector: 'lab-workflow-node-config',
  templateUrl: './lab-workflow-node-config.component.html',
  styleUrls: ['./lab-workflow-node-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabWorkflowNodeConfigComponent implements OnInit {

  // configValue$: Observable<any> = toObservable(computed(() => this.nodeDetailState.process2()?.config.mergeConfigWithDefault() ?? null));
  configValue: Signal<any> = computed(() => {
    const process = this.nodeDetailState.process2();
    return process?.instanceName ?? null;
  }, {equal: (a, b) => false});
  configValue2: Signal<any> = computed(() => this.process().instanceName);

  process: Signal<LabProcess> = this.nodeDetailState.process2;

  node = this.nodeDetailState.node2;
  x = computed(() => this.nodeDetailState.node2().x)



  c = this.nodeDetailState.getC();
  cComputed = computed(() => this.nodeDetailState.getA()().a());
  c2 = computed(() => this.nodeDetailState.getC()() + 12)
  cProblem = computed(() => this.nodeDetailState.getC()())
  cLate: Signal<number>;
  a = signal(new A(1));
  aComputed = computed(() => this.a().a());
  a2 = computed(() => this.aComputed())

  constructor(private nodeDetailState: LabWorkflowNodeDetailState) {
  }

  ngOnInit(): void {
    console.log('init');
    // this.configValue$.pipe(clRxjsDebug()).subscribe()
  }

  change(): void {
    // if(this.nodeDetailState.a == null){
    //   this.nodeDetailState.a = signal(new A(1));
    // }
    // this.nodeDetailState.a.set(new A(2));
    this.nodeDetailState.a().a.set(2);
    this.a().a.set(2);
    this.cLate = computed(() => this.nodeDetailState.getC()());
    // this.c().a.set(2);
  }

  change2(): void {
    // this.nodeDetailState.a.set(new A(3));
    this.nodeDetailState.a().a.set(3);
    this.a().a.set(3);
    // this.c().a.set(3);
  }


}
