import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CaDetailRoutePipe } from '../../../ca-core/module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';

/**
 * Layout component for the dashboard to structure the list section
 * Contain a ng-template to provide the template for the card
 */
@Component({
  selector: 'ca-dashboard-list-layout',
  templateUrl: './ca-dashboard-list-layout.component.html',
  styleUrls: ['./ca-dashboard-list-layout.component.scss'],
  imports: [
    FlSectionModule,
    RouterLink,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    NgTemplateOutlet,
    CaDetailRoutePipe,
    TranslatePipe,
    MatButtonModule,
    NgClass,
  ],
})
export class CaDashboardListLayoutComponent {
  public static maxItems = 4;

  @Input() datasource: FlDatasourcePaginated<any>;

  @Input() sectionTitle: string;

  @Input() titleIcon: string;

  @Input() emptyText: string;

  @Input() completeListRoute: string;

  @Input() completeListText: string;

  @Input() addText: string;

  @Input() showAddButton: boolean = true;

  @Input() addButtonColor: string = 'primary';

  /**
   * When provided, items are rendered as external links (opened in a new tab) using the
   * returned url instead of the internal caDetailRoute.
   */
  @Input() itemHref: (item: any) => string;

  @Output() addClick: EventEmitter<MouseEvent> = new EventEmitter();

  // get the template reference of content
  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  maxItems = CaDashboardListLayoutComponent.maxItems;

  addClicked(event: MouseEvent): void {
    this.addClick.emit(event);
  }
}
