import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';

/**
 * Layout component for the dashboard to structure the list section
 * Contain a ng-template to provide the template for the card
 */
@Component({
  selector: 'ca-dashboard-list-layout',
  templateUrl: './ca-dashboard-list-layout.component.html',
  styleUrls: ['./ca-dashboard-list-layout.component.scss']
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
