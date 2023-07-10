import {PrWorkflowPort} from '../pr-workflow-port.class';
import {PrWorkflowNodeIo} from './pr-workflow-node-io.class';
import {PrProcess} from '../pr-process.class';
import {TdTaskViewerConfig, TdTypingName} from '@monorepo/technical-doc';
import {computed, Signal} from '@angular/core';

export class PrWorkflowNodeViewer extends PrWorkflowNodeIo {

  getHTML(): string {
    return `<pr-workflow-node-viewer name="${this.nodeName}"></pr-workflow-node-viewer>`;
  }

  getClassName(): string {
    return 'task-viewer';
  }

  // return the only port (output for source and input for output)
  protected getPort(): PrWorkflowPort {
    return this.inputPorts[0];
  }

  protected getResourceId(process: PrProcess): string | null {
    return process.inputs.ports[TdTypingName.task.output.resourceInput].resource_id ?? null;
  }

  public get configValues(): Signal<TdTaskViewerConfig> {
    return computed(() => this.objectSignal().config.values as TdTaskViewerConfig);
  }


}
