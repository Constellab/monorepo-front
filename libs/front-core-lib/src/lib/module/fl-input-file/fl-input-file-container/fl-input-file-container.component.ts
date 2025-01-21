import {
  AfterContentInit,
  Component,
  computed,
  ContentChild,
  inject,
  input,
  Input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FlInputFileDirective } from '../fl-input-file.directive';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FlTranslateService } from '../../fl-translate/service/fl-translate.service';
import { FlDropEvent } from '../../fl-drag/fl-drag.class';
import { ClHelpService } from '@monorepo/core-lib';

/**
 * Component to style the input file
 *
 * Must have a input child with the {@link FlInputFileDirective} directive to correctly work
 *
 * Supports theme color palette
 *
 * @example
 * <fl-input-file-container class="primary" placeholder="Select multiple pdf files">
 *  <input flInputFile multiple type="file" required [strictMode]="true"
 *         formControlName="file" accept="application/pdf">
 * </fl-input-file-container>
 */
@Component({
  selector: 'fl-input-file-container',
  templateUrl: './fl-input-file-container.component.html',
  styleUrls: ['./fl-input-file-container.component.scss'],
  standalone: false,
})
export class FlInputFileContainerComponent implements OnInit, AfterContentInit, OnDestroy {
  /**
   * The theme color of the input
   */
  @Input() color: ThemePalette;

  /**
   * Default text displayed when no file selected
   */
  placeholder = input<string>(null);

  /**
   * Icon show before the text
   */
  @Input() icon: string;

  // retrieve the injected directive in the ng content
  @ContentChild(FlInputFileDirective, { static: true }) private inputFile: FlInputFileDirective;

  // true if the control is required
  private isRequired = signal(false);

  private files = signal<File | File[]>(null);

  text = computed((): string => {
    const files = this.files();

    let text: string;
    const filesArray = ClHelpService.convertObjectOrArrayToArray(files);

    const placeholder = this.placeholder();
    const isRequired = this.isRequired();

    if (filesArray.length === 0) {
      text = placeholder ?? this.translateService.translate('flFileInput.select_file');

      if (isRequired) {
        text += ' *';
      }
    } else if (filesArray.length === 1) {
      text = (filesArray[0] as File).name;
    } else {
      text = length + ' ' + this.translateService.translate('flFileInput.files');
    }

    return text;
  });

  hasValue = computed((): boolean => {
    const filesArray = ClHelpService.convertObjectOrArrayToArray(this.files());
    return filesArray.length > 0;
  });

  // subscription to control event
  private changeSubscription: Subscription;
  private stateSubscription: Subscription;

  private translateService = inject(FlTranslateService);

  ngOnInit(): void {
    if (this.inputFile == null) {
      console.error('[FlInputFileContainer] The file input with the directive FlInputFile is missing');
    }

    this.changeSubscription = this.inputFile.fileChange.subscribe((file: File | File[]) =>
      this.getNewFiles(file)
    );
    this.refreshRequired();
  }

  ngAfterContentInit(): void {
    this.listenToControlChanges();
  }

  // listen to control change to display errors
  private listenToControlChanges(): void {
    const ngControl: NgControl = this.inputFile.ngControl;

    if (ngControl) {
      this.stateSubscription = ngControl.statusChanges.subscribe(() => this.refreshRequired());
    }
  }

  // change displayed text on file input change
  private getNewFiles(files: File | File[]): void {
    if (this.inputFile.autoClearHtmlInput) {
      return;
    }
    this.files.set(files);
  }

  private refreshRequired(): void {
    this.isRequired.set(this.inputFile.required);
  }

  // clear the file input
  clearInput(): void {
    if (!this.inputFile.disabled) {
      this.inputFile.clearInput(true);
    }
  }

  onDropFile(event: FlDropEvent): void {
    this.inputFile.fileChanged(event.event.dataTransfer.files);
  }

  // clear the subscription
  ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
    this.stateSubscription?.unsubscribe();
  }
}
