import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HaCoreModule} from '../../ha-core.module';

export interface HaNavigationPanelItem {
  title: string;
  translateTitle?: boolean;
  url?: string;
}

@Component({
  selector: 'ha-navigation-panel',
  standalone: true,
  imports: [CommonModule, HaCoreModule],
  templateUrl: './ha-navigation-panel.component.html',
  styleUrls: ['./ha-navigation-panel.component.scss']
})
export class HaNavigationPanelComponent {

  @Input() navigationPanelItems: HaNavigationPanelItem[];

  getUrl(navigationPanelItem: HaNavigationPanelItem, index: number): string {
    if (this.navigationPanelItems.length - 1 === index) return '.';
    return navigationPanelItem.url ?? '../'.repeat(this.navigationPanelItems.length - index - 1);
  }
}
