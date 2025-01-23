import { Component, inject, Input, OnInit } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlResizeEvent } from '@monorepo/front-core-lib/fl-resize';
import { TeElementBlockDirective } from '../../model/te-element.directive';
import { TeIframeBlockData } from '../../block/te-iframe-block.class';
import { TeLinkDialogComponent, TeLinkDialogInput } from '../te-link-dialog/te-link-dialog.component';
import { ClStringHelper } from '@monorepo/core-lib';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'te-iframe',
  templateUrl: './te-iframe.component.html',
  styleUrl: './te-iframe.component.scss',
  standalone: false,
})
export class TeIframeComponent extends TeElementBlockDirective implements OnInit {
  private dialogService: FlDialogService = inject(FlDialogService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  @Input() data: TeIframeBlockData;

  urlError: boolean = false;
  secureUrl: SafeResourceUrl;

  disabled$: Observable<boolean>;

  ngOnInit(): void {
    this.data.iframeHeight = this.data.iframeHeight ?? 300;
    this.setSecureUrl();
    this.disabled$ = of(this.disabled);
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
    this.urlError = true;
    if (!url || !ClStringHelper.isHttpLink(url)) {
      return;
    }
    this.data.url = url;
    this.urlError = false;
    this.setSecureUrl();
  }

  private setSecureUrl(): void {
    if (this.data.url) {
      this.secureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);
    } else {
      this.secureUrl = null;
    }
  }
}
