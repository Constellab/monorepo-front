import { Component, input } from '@angular/core';
import { CoTagKey } from '../../model/co-tag-key.class';
import { CoCommunityLibModule } from '../../co-community-lib.module';

@Component({
  selector: 'co-community-tag-list-item',
  imports: [CoCommunityLibModule],
  templateUrl: './co-community-tag-list-item.component.html',
  styleUrl: './co-community-tag-list-item.component.scss',
})
export class CoCommunityTagListItemComponent {
  tagKey = input.required<CoTagKey>();
}
