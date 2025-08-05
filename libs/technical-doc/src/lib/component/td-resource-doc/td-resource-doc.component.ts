import { Component, Input, OnInit } from '@angular/core';

import { TdResourceType, TdResourceView } from '../../model/td-resource-type.class';

@Component({
  selector: 'td-resource-doc',
  templateUrl: './td-resource-doc.component.html',
  styleUrls: ['./td-resource-doc.component.scss'],
  standalone: false,
})
export class TdResourceDocComponent implements OnInit {
  @Input({ required: true }) resource: TdResourceType;

  orderedViews: TdResourceView[];

  ngOnInit(): void {
    this.orderedViews = this.getOrderedResourceViews(this.resource.methods.views);
  }

  getOrderedResourceViews(views: TdResourceView[]): TdResourceView[] {
    //return views with the default view first
    const orderedViews = [];
    for (const v of views) {
      if (v.default_view) {
        orderedViews.unshift(v);
      } else {
        orderedViews.push(v);
      }
    }
    return orderedViews;
  }
}
