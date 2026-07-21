import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  input,
  Output,
  ViewChild} from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlConfirmDialogInput, FlConfirmDialogResult } from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';

import {
  FlUploadImageDialogComponent,
  FlUploadImageDialogConfig,
  FlUploadImageDialogInput,
  FlUploadImageDialogOutput,
} from '../fl-upload-image-dialog/fl-upload-image-dialog.component';

/**
 * Container component (an image should be place inside it with ng-content) top
 * allow update and delete the image.
 */
@Component({
  selector: 'fl-update-image-container',
  templateUrl: './fl-update-image-container.component.html',
  styleUrl: './fl-update-image-container.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlUpdateImageContainerComponent {
  private dialogService = inject(FlDialogService);
  private menuDynamic = inject(FlMenuDynamicService);

  @Input({ required: true }) uploadConfig: FlUploadImageDialogConfig;

  /**
   * If the delete config is set and the showDelete is true, the delete button will be shown
   */
  @Input() deleteConfig: FlConfirmDialogInput;
  @Input() showDelete: boolean = true;

  /**
   * Additional menu actions to display in the context menu
   */
  @Input() additionalActions: FlMenuDynamic[] = [];

  @HostBinding('class.disabled')
  @Input()
  disabled: boolean = false;

  showEditIcon = input<boolean>(true);

  @Output() imageChanged: EventEmitter<any> = new EventEmitter<any>();

  @Output() imageDeleted: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('input', { static: true, read: ElementRef }) inputImage: ElementRef<HTMLInputElement>;

  onClick(event: Event): void {
    if (this.disabled) return;

    const menu: FlMenuDynamic[] = [
      {
        text: this.uploadConfig.title,
        icon: 'add_a_photo',
        type: 'button',
        onClick: () => this.openFileSelector(),
      },
    ];

    if (this.showDelete && this.deleteConfig) {
      menu.push({
        text: this.deleteConfig.title,
        icon: 'delete',
        type: 'button',
        color: 'warn',
        onClick: () => this.deleteImage(),
      });
    }

    // Add additional actions if provided
    if (this.additionalActions && this.additionalActions.length > 0) {
      menu.push(...this.additionalActions);
    }

    // Position the menu at the mouse pointer for clicks, or relative to the
    // triggering element when opened via keyboard (no pointer coordinates).
    if (event instanceof MouseEvent) {
      this.menuDynamic.openDynamicMenuFromMouseEvent(menu, event);
    } else {
      this.menuDynamic.openDynamicMenuRelative(menu, event.currentTarget as Element);
    }
  }

  private openFileSelector(): void {
    this.inputImage.nativeElement.click();
  }

  onFileSelected(file: File): void {
    const input: FlUploadImageDialogInput = {
      file: file,
      config: this.uploadConfig,
    };
    this.dialogService
      .openMediumDialog(FlUploadImageDialogComponent, {
        data: input,
      })
      .afterClosed()
      .subscribe((result: FlUploadImageDialogOutput) => this.onDialogClosed(result));
  }

  private onDialogClosed(result?: FlUploadImageDialogOutput): void {
    if (result?.choice) {
      this.imageChanged.emit(result.result);
    }
  }

  private deleteImage(): void {
    this.dialogService
      .openConfirmDialog(this.deleteConfig)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result));
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.imageDeleted.emit(result.result);
    }
  }
}
