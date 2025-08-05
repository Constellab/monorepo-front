import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

import { CoCommunityLibModule } from '../../co-community-lib.module';
import { CoCommunityApp } from '../../model/co-community-app.class';

@Component({
  selector: 'co-community-app-list-item',
  imports: [CoCommunityLibModule, NgOptimizedImage],
  templateUrl: './co-community-app-list-item.component.html',
  styleUrl: './co-community-app-list-item.component.scss',
})
export class CoCommunityAppListItemComponent {
  communityApp = input.required<CoCommunityApp>();
  appPicture = input.required<string>();
}
