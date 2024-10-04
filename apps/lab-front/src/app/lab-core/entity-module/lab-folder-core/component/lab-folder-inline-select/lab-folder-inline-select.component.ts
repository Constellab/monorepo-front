import {Component, EventEmitter, Input, Optional, Output, Self} from '@angular/core';
import {FlFormFieldDirective, FlPortalService} from '@monorepo/front-core-lib';
import {LabFolder} from '../../../../model/entities/lab-folder.class';
import {NgControl} from '@angular/forms';
import {
  LabFolderSelectPortalComponent,
  LabFolderSelectPortalInput,
  LabFolderSelectPortalResult
} from '../lab-folder-select-portal/lab-folder-select-portal.component';

/**
 * Component to show a folder inline with possibility to select another folder
 */
@Component({
  selector: 'lab-folder-inline-select',
  templateUrl: './lab-folder-inline-select.component.html',
  styleUrls: ['./lab-folder-inline-select.component.scss'],
  providers: [{provide: FlFormFieldDirective, useExisting: LabFolderInlineSelectComponent}]
})
export class LabFolderInlineSelectComponent extends FlFormFieldDirective<LabFolder> {

  @Input() updateFolderHelpText?: string;

  @Output() selectionChange: EventEmitter<LabFolder | null> = new EventEmitter();


  constructor(@Optional() @Self() ngControl: NgControl,
              private portalService: FlPortalService) {
    super(ngControl);
  }

  callChangeEvent(value: LabFolder): void {
    this.selectionChange.emit(value);
  }

  onDisableChange(): void {
  }

  writeValue(obj: LabFolder): void {
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

    const data: LabFolderSelectPortalInput = {
      folder: this.value,
      helpText: this.updateFolderHelpText
    };

    this.portalService.createPortal(LabFolderSelectPortalComponent, config, data).detachments().subscribe(
      folder => this.onPortalClosed(folder)
    );
  }

  private onPortalClosed(result: LabFolderSelectPortalResult): void {
    if (result == null) return;

    const folder = result.folder;
    if (this.value?.id === folder?.id || this.value == null && folder == null) return;
    this.setAndEmitValue(folder);
  }


}

