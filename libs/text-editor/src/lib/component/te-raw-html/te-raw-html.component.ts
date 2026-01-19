import { Component, computed, inject, Input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { TeRawHtmlBlockData } from '../../block/te-raw-html-block.class';
import { TeElementBlockDirective } from '../../model/te-element.directive';

@Component({
  selector: 'te-raw-html',
  templateUrl: './te-raw-html.component.html',
  styleUrl: './te-raw-html.component.scss',
  standalone: false,
})
export class TeRawHtmlComponent extends TeElementBlockDirective {
  private sanitizer = inject(DomSanitizer);

  private _data = signal<TeRawHtmlBlockData>({ html: '' });

  @Input()
  set data(value: TeRawHtmlBlockData) {
    this._data.set(value);
  }
  get data(): TeRawHtmlBlockData {
    return this._data();
  }

  sanitizedHtml = computed(() => {
    const data = this._data();
    if (data?.html) {
      return this.sanitizer.bypassSecurityTrustHtml(data.html);
    }
    return null;
  });
}
