import { Component, HostBinding, HostListener, inject, OnInit } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { TeElementInlineDirective } from '../../model/te-element.directive';
import { TeLinkDialogComponent, TeLinkDialogInput } from '../te-link-dialog/te-link-dialog.component';

export interface TeLinkInlineToolData {
  url: string;
  text: string;
}

@Component({
  selector: 'te-link-inline',
  templateUrl: './te-link-inline.component.html',
  styleUrl: './te-link-inline.component.scss',
  standalone: false,
})
export class TeLinkInlineComponent extends TeElementInlineDirective<TeLinkInlineToolData> implements OnInit {
  private dialogService = inject(FlDialogService);

  @HostBinding('attr.contenteditable') get contenteditable(): string {
    return this.disabled ? 'false' : 'true';
  }

  isInternal: boolean = false;
  relativePath: string = '';

  @HostListener('click') onClick(): void {
    if (!this.disabled) {
      this.openLinkDialog();
    }
  }

  ngOnInit(): void {
    this.computeLinkType();
    if (!this.disabled && this.newElement) {
      this.openLinkDialog();
    }
  }

  public openLinkDialog(): void {
    const data: TeLinkDialogInput = {
      title: 'teTextEditor.add_link',
      initialValue: this.data.url,
    };
    this.dialogService
      .openSmallDialog(TeLinkDialogComponent, { data })
      .afterClosed()
      .subscribe((url: string) => this.setLink(url));
  }

  public setLink(url?: string): void {
    if (url) {
      this.setData({ ...this.data, url });
      this.computeLinkType();
    }
  }

  get displayText(): string {
    return this.data.text || this.data.url;
  }

  private computeLinkType(): void {
    if (this.data.url) {
      const appOrigin = window.location.origin;
      this.isInternal = this.data.url.startsWith(appOrigin);
      if (this.isInternal) {
        this.relativePath = this.data.url.substring(appOrigin.length);
        if (!this.relativePath.startsWith('/')) {
          this.relativePath = '/' + this.relativePath;
        }
      }
    }
  }
}
