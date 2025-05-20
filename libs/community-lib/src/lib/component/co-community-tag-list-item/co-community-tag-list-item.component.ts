import { Component, input } from '@angular/core';
import { CoTagKey } from '../../model/co-tag-key.class';
import { CoCommunityLibModule } from '../../co-community-lib.module';
import { CoDeprecatedTagComponent } from '../co-deprecated-tag/co-deprecated-tag.component';

@Component({
  selector: 'co-community-tag-list-item',
  imports: [CoCommunityLibModule, CoDeprecatedTagComponent],
  templateUrl: './co-community-tag-list-item.component.html',
  styleUrl: './co-community-tag-list-item.component.scss',
})
export class CoCommunityTagListItemComponent {
  tagKey = input.required<CoTagKey>();
}
