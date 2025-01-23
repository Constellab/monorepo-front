import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { TeElementBlockDirective } from '../../model/te-element.directive';
import { TeFileBlockConfig } from '../../block/te-file-block';
import { FlInputFileDirective } from '@monorepo/front-core-lib/fl-input-file';
import { TeBlockFileUploadResponse } from '../../model/lib';

@Component({
  selector: 'te-file',
  templateUrl: './te-file.component.html',
  styleUrl: './te-file.component.scss',
  standalone: false,
})
export class TeFileComponent extends TeElementBlockDirective implements OnInit {
  @Input() data: TeBlockFileUploadResponse;

  @Input() config: TeFileBlockConfig;

  @ViewChild(FlInputFileDirective, { read: ElementRef, static: false })
  inputFile: ElementRef<HTMLInputElement>;

  @HostBinding('attr.contenteditable') contenteditable = 'false';

  fileUrl: string;

  uploadIsLoading = false;

  ngOnInit(): void {
    if (this.data?.name) {
      this.initFile(this.data);
    }

    // if the data is empty, open the file selector
    // useful for case where figure block is added programmatically
    if (!this.disabled && !this.uploadIsLoading && this.newElement) {
      this.openFileSelector();
    }
  }

  private openFileSelector(): void {
    setTimeout(() => this.inputFile.nativeElement.click(), 0);
  }

  private initFile(data: TeBlockFileUploadResponse): void {
    this.fileUrl = this.config.getFileUrl(data.name);
  }

  public onFileSelected(file: File): void {
    this.uploadIsLoading = true;
    this.config.fileUploader(file).subscribe({
      next: (response) => this.onUploadSuccess(response),
      error: () => (this.uploadIsLoading = false),
    });
  }

  public openDocumentPreview(): void {
    window.open(this.fileUrl, '_blank');
  }

  private onUploadSuccess(data: TeBlockFileUploadResponse): void {
    this.data = data;
    this.uploadIsLoading = false;
    this.initFile(data);
  }
}
