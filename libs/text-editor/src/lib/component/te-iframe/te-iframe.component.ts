import { AfterViewInit, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FlDialogService, FlResizeEvent } from '@monorepo/front-core-lib';
import { TeElementBlockDirective } from '../../model/te-element.directive';
import { TeIframeBlockData } from '../../block/te-iframe-block.class';
import { TeLinkDialogComponent, TeLinkDialogInput } from '../te-link-dialog/te-link-dialog.component';
import { ClStringHelper } from '@monorepo/core-lib';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'te-iframe',
  templateUrl: './te-iframe.component.html',
  styleUrl: './te-iframe.component.scss',
})
export class TeIframeComponent extends TeElementBlockDirective implements OnInit, AfterViewInit {
  @Input() data: TeIframeBlockData;

  @ViewChild('iframeDiv') iframeDiv: ElementRef;

  private document: Document = inject(DOCUMENT);

  urlError: boolean = true;

  constructor(private dialogService: FlDialogService) {
    super();
  }

  ngOnInit(): void {
    this.data.iframeHeight = this.data.iframeHeight ?? 300;
  }

  ngAfterViewInit(): void {
    this.initIframe();
  }

  onIframeResize(event: FlResizeEvent): void {
    this.data.iframeHeight = event.height;
  }

  public openLinkDialog(): void {
    const data: TeLinkDialogInput = {
      title: 'teTextEditor.iframe',
    };
    this.dialogService
      .openSmallDialog(TeLinkDialogComponent, { data })
      .afterClosed()
      .subscribe((url: string) => this.setUrl(url));
  }

  private setUrl(url?: string): void {
    if (!url || !ClStringHelper.isHttpLink(url)) {
      this.urlError = true;
      return;
    }
    this.data.url = url;
    this.urlError = false;
    this.initIframe();
  }

  private initIframe(): void {
    if (this.data.url && this.iframeDiv?.nativeElement) {
      const iframeElement: HTMLIFrameElement = this.document.createElement('iframe');
      iframeElement.height = '100%';
      iframeElement.width = '100%';
      iframeElement.src = this.data.url;
      iframeElement.style.border = '1px solid var(--hover-color)';
      this.iframeDiv.nativeElement.innerHTML = '';
      this.iframeDiv.nativeElement.appendChild(iframeElement);
    }
  }
}
