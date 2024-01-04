import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, UrlSegment} from '@angular/router';
import {FlTranslateModule} from '@monorepo/front-core-lib';
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
export class HaNavigationPanelComponent implements OnInit{

  @Input() navigationPanelItems: HaNavigationPanelItem[];

  constructor() {
  }

  ngOnInit(): void {
  }

  getUrl(navigationPanelItem: HaNavigationPanelItem, index: number): string {
    if (this.navigationPanelItems.length - 1 === index) return '.';
    return navigationPanelItem.url ?? '../'.repeat(this.navigationPanelItems.length - index - 1);
  }
}
