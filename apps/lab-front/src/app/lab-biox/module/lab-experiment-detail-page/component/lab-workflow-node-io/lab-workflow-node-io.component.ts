import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {FlTranslatableText} from '@monorepo/front-core-lib';
import {LabWorkflowPortResource} from '../../model/lab-workflow-port-resource.class';
import {map} from 'rxjs/operators';

/**
 * Component inside the node dashboard that display the input/output port name
 * (and the resource name if it exists) vertically to open the resource panel
 */
@Component({
  selector: 'lab-workflow-node-io',
  templateUrl: './lab-workflow-node-io.component.html',
  styleUrls: ['./lab-workflow-node-io.component.scss'],
})
export class LabWorkflowNodeIoComponent implements OnInit {

  @Input() resource$: Observable<LabWorkflowPortResource>;

  @Input() mode: 'input' | 'output';

  // emit the name of the selected port
  @Output() selectPort: EventEmitter<string> = new EventEmitter();

  text$: Observable<FlTranslatableText>;

  ngOnInit(): void {
    this.text$ = this.resource$.pipe(
      map(resource => {
        if (resource.resource && resource.resource.status === 'success') {
          return resource.resource.object?.name;
        }
        return resource.port.humanName;
      })
    );
  }

  onResourceClick(resource: LabWorkflowPortResource): void {
    this.selectPort.emit(resource.port.name);
  }


}
