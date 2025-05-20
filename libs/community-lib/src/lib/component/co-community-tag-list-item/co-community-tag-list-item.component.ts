import { Component, input } from '@angular/core';
import { CoTagKey } from '../../model/co-tag-key.class';
import { CoCommunityLibModule } from '../../co-community-lib.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'co-community-tag-list-item',
  imports: [CoCommunityLibModule, TranslatePipe],
  templateUrl: './co-community-tag-list-item.component.html',
  styleUrl: './co-community-tag-list-item.component.scss',
})
export class CoCommunityTagListItemComponent {
  tagKey = input.required<CoTagKey>();
}
