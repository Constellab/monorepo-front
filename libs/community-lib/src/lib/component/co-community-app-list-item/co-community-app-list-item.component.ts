import { Component, input } from '@angular/core';
import { CoCommunityApp } from '../../model/co-community-app.class';
import { CoCommunityLibModule } from '../../co-community-lib.module';

@Component({
  selector: 'co-community-app-list-item',
  imports: [CoCommunityLibModule],
  templateUrl: './co-community-app-list-item.component.html',
  styleUrl: './co-community-app-list-item.component.scss',
})
export class CoCommunityAppListItemComponent {
  communityApp = input.required<CoCommunityApp>();
}
