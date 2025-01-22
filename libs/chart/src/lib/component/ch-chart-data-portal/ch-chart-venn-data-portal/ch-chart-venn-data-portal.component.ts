import { Component, inject } from '@angular/core';
import { ChChartVennDataSection } from '../../../model/data/ch-chart-venn-data.class';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib';

/**
 * Simple portal to display the venn data on a section
 */
@Component({
  selector: 'ch-chart-venn-data-portal',
  templateUrl: './ch-chart-venn-data-portal.component.html',
  styleUrls: ['./ch-chart-venn-data-portal.component.scss'],
  standalone: false,
})
export class ChChartVennDataPortalComponent {
  groupNames: string;
  dataLength: number;

  dataStr: string;

  constructor() {
    const section = inject<ChChartVennDataSection>(FL_PORTAL_DATA);

    this.groupNames = section.groupNames.join(', ');
    this.dataLength = section.data?.length ?? 0;
    this.dataStr = section.data.join(', ');
  }
}
