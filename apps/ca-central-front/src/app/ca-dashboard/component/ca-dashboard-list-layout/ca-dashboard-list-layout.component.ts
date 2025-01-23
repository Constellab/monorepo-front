import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { RouterLink } from '@angular/router';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { NgTemplateOutlet } from '@angular/common';
import {
  CaAddCardComponent,
} from '../../../ca-core/module/ca-core-component/ca-add-card/ca-add-card.component';
import { CaDetailRoutePipe } from '../../../ca-core/module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { TranslatePipe } from '@ngx-translate/core';

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
    CaAddCardComponent,
    CaDetailRoutePipe,
    TranslatePipe,
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

  @Output() addClick: EventEmitter<MouseEvent> = new EventEmitter();

  // get the template reference of content
  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  maxItems = CaDashboardListLayoutComponent.maxItems;

  addClicked(event: MouseEvent): void {
    this.addClick.emit(event);
  }
}
