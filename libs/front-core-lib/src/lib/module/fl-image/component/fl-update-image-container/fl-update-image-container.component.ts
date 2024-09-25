import {Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewChild} from '@angular/core';
import {
  FlUploadImageDialogComponent,
  FlUploadImageDialogConfig,
  FlUploadImageDialogInput,
  FlUploadImageDialogOutput
} from '../fl-upload-image-dialog/fl-upload-image-dialog.component';
import {FlDialogService} from '../../../fl-dialog/fl-dialog.service';
import {FlMenuDynamicService} from '../../../fl-menu-dynamic/fl-menu-dynamic.service';
import {FlConfirmDialogInput, FlConfirmDialogResult} from '../../../fl-dialog/model/fl-confirm-dialog.class';
import {FlMenuDynamic} from '../../../fl-menu-dynamic/model/fl-menu-dynamic.class';

/**
 * Container component (an image should be place inside it with ng-content) top
 * allow update and delete the image.
 */
@Component({
  selector: 'fl-update-image-container',
  templateUrl: './fl-update-image-container.component.html',
  styleUrl: './fl-update-image-container.component.scss'
})
export class FlUpdateImageContainerComponent {

  @Input({required: true}) uploadConfig: FlUploadImageDialogConfig;

  /**
   * If the delete config is set and the showDelete is true, the delete button will be shown
   */
  @Input() deleteConfig: FlConfirmDialogInput;
  @Input() showDelete: boolean = true;

  @HostBinding('class.disabled')
  @Input() disabled: boolean = false;

  @Output() imageChanged: EventEmitter<any> = new EventEmitter<any>();

  @Output() imageDeleted: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('input', {static: true, read: ElementRef}) inputImage: ElementRef<HTMLInputElement>;

  constructor(private dialogService: FlDialogService,
              private menuDynamic: FlMenuDynamicService) {
  }

  onClick(event: MouseEvent): void {
    if (this.disabled) return;

    const menu: FlMenuDynamic[] = [
      {
        text: this.uploadConfig.title,
        icon: 'add_a_photo',
        type: 'button',
        onClick: () => this.openFileSelector()
      },
    ];

    if (this.showDelete && this.deleteConfig) {
      menu.push({
        text: this.deleteConfig.title,
        icon: 'delete',
        type: 'button',
        onClick: () => this.deleteImage()
      });
    }
    this.menuDynamic.openDynamicMenuFromMouseEvent(menu, event);
  }

  private openFileSelector(): void {
    this.inputImage.nativeElement.click();
  }

  onFileSelected(file: File): void {
    const input: FlUploadImageDialogInput = {
      file: file,
      config: this.uploadConfig
    };
    this.dialogService.openMediumDialog(FlUploadImageDialogComponent, {
      data: input
    }).afterClosed().subscribe(
      (result: FlUploadImageDialogOutput) => this.onDialogClosed(result)
    );

  }

  private onDialogClosed(result?: FlUploadImageDialogOutput): void {
    if (result?.choice) {
      this.imageChanged.emit(result.result);
    }
  }

  private deleteImage(): void {
    this.dialogService.openConfirmDialog(this.deleteConfig).afterClosed().subscribe(
      result => this.onDeleteClosed(result)
    );
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.imageDeleted.emit(result.result);
    }
  }
}
