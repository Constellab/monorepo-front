import { Component, input } from '@angular/core';

import { CoListItemType } from '../../model/co-list-item-type.enum';
import { CoPartner } from '../../model/co-partner.class';
import { CoCommunityListItemComponent } from '../co-community-list-item/co-community-list-item.component';

@Component({
  selector: 'co-partner-list-item',
  templateUrl: './co-partner-list-item.component.html',
  styleUrls: ['./co-partner-list-item.component.scss'],
  imports: [CoCommunityListItemComponent],
})
export class CoPartnerListItemComponent {
  partner = input.required<CoPartner>();
  partnerLogo = input<string | null>(null);
  type = CoListItemType.PARTNER;
}
