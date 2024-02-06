import {Component, OnInit} from '@angular/core';
import {RvResourceViewDirective} from '../../model/rv-resource-view.directive';
import {RvResourceViewStreamlit} from '../../model/rv-resource-view.class';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'rv-view-streamlit',
  templateUrl: './rv-view-streamlit.component.html',
  styleUrl: './rv-view-streamlit.component.scss'
})
export class RvViewStreamlitComponent extends RvResourceViewDirective<RvResourceViewStreamlit> implements OnInit{

  iframeUrl: SafeUrl;

  constructor(private sanitize: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    this.iframeUrl = this.sanitize.bypassSecurityTrustResourceUrl(this.view.data.url);
  }


}
