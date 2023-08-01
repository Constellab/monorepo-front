import {Component, EventEmitter, Optional, Output, Self} from '@angular/core';
import {FlFormFieldDirective, FlPortalService} from '@monorepo/front-core-lib';
import {LabProject} from '../../../../model/entities/lab-project.class';
import {NgControl} from '@angular/forms';
import {
  LabProjectSelectPortalComponent,
  LabProjectSelectPortalResult
} from '../lab-project-select-portal/lab-project-select-portal.component';

/**
 * Component to show a project inline with possibility to select another project
 */
@Component({
  selector: 'lab-project-inline-select',
  templateUrl: './lab-project-inline-select.component.html',
  styleUrls: ['./lab-project-inline-select.component.scss'],
  providers: [{provide: FlFormFieldDirective, useExisting: LabProjectInlineSelectComponent}]
})
export class LabProjectInlineSelectComponent extends FlFormFieldDirective<LabProject> {

  @Output() selectionChange: EventEmitter<LabProject | null> = new EventEmitter();


  constructor(@Optional() @Self() ngControl: NgControl,
              private portalService: FlPortalService) {
    super(ngControl);
  }

  callChangeEvent(value: LabProject): void {
    this.selectionChange.emit(value);
  }

  onDisableChange(): void {
  }

  writeValue(obj: LabProject): void {
    this.value = obj;
  }

  openPortal(event: MouseEvent): void {
    if (this.disabled) return;

    const config = this.portalService.configureRelativePortalFromMouseEvent(event,
      ['bottom'],
      {
        disposeOnNavigation: true,
        disposeOnOutsideClick: true
      });

    this.portalService.createPortal(LabProjectSelectPortalComponent, config, this.value).detachments().subscribe(
      project => this.onPortalClosed(project)
    );
  }

  private onPortalClosed(result: LabProjectSelectPortalResult): void {
    if (result == null) return;

    const project = result.project;
    if (this.value?.id === project?.id || this.value == null && project == null) return;
    this.setAndEmitValue(project);
  }


}

