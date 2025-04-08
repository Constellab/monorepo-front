import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';
import { RvResourceViewHTML } from '../../model/rv-resource-view.class';

@Component({
  selector: 'rv-view-html',
  templateUrl: './rv-view-html.component.html',
  styleUrls: ['./rv-view-html.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class RvViewHtmlComponent extends RvResourceViewDirective<RvResourceViewHTML> implements OnInit {
  @ViewChild('iframe', { static: true }) iframeRef!: ElementRef<HTMLIFrameElement>;

  ngOnInit(): void {
    // inject content inside the iframe
    const iframe = this.iframeRef.nativeElement;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;

    if (doc) {
      doc.open();
      doc.write(this.view.data.html);
      doc.close();
    }
  }
}
