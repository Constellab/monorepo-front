import { inject, Pipe, PipeTransform } from '@angular/core';

import { HaPartner } from '../../../ha-model/ha-entities/ha-partner';
import { HaPartnerService } from '../../../ha-service/ha-partner.service';

@Pipe({ name: 'haPartnerLogoUrl' })
export class HaPartnerLogoUrlPipe implements PipeTransform {
  private partnerService = inject(HaPartnerService);

  transform(partner: HaPartner): string | null {
    if (partner && partner.logo) {
      return this.partnerService.getImageUrl(partner.id, partner.logo);
    }

    return null;
  }
}
