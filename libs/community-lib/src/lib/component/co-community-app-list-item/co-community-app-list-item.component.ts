import { ChangeDetectionStrategy,Component, input } from '@angular/core';

import { CoCommunityLibModule } from '../../co-community-lib.module';
import { CoCommunityApp } from '../../model/co-community-app.class';
import { CoListItemType } from '../../model/co-list-item-type.enum';
import { CoCommunityListItemComponent } from '../co-community-list-item/co-community-list-item.component';

@Component({
  selector: 'co-community-app-list-item',
  imports: [CoCommunityLibModule, CoCommunityListItemComponent],
  templateUrl: './co-community-app-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './co-community-app-list-item.component.scss',
})
export class CoCommunityAppListItemComponent {
  communityApp = input.required<CoCommunityApp>();
  appPicture = input<string>();

  type = CoListItemType.APP;
}
