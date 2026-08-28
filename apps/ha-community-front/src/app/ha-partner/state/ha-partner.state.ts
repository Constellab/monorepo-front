import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TeRichText } from '@monorepo/text-editor';

import { HaPartnerDetail } from '../../ha-core/ha-model/ha-entities/ha-partner';
import { HaPartnerService } from '../../ha-core/ha-service/ha-partner.service';

@Injectable()
export class HaPartnerState {
  private partnerService = inject(HaPartnerService);

  isLoading: WritableSignal<boolean> = signal(false);
  partner: WritableSignal<HaPartnerDetail | null> = signal<HaPartnerDetail | null>(null);
  notFound: WritableSignal<boolean> = signal(false);
  onPartnerInfoLoading: WritableSignal<boolean> = signal(false);

  init(partnerId: string): void {
    this.isLoading.set(true);
    this.partnerService.getPartnerById(partnerId).subscribe({
      next: (partner) => {
        this.partner.set(partner);
        this.isLoading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.isLoading.set(false);
      },
    });
  }

  editPartnerInfo(info: TeRichText): void {
    const partner = this.partner();
    if (partner == null) {
      return;
    }

    this.onPartnerInfoLoading.set(true);
    this.partnerService.updatePartnerInfo(partner.id, info).subscribe({
      next: (updatedPartner) => {
        this.partner.set(updatedPartner);
        this.onPartnerInfoLoading.set(false);
      },
      error: () => {
        this.onPartnerInfoLoading.set(false);
      },
    });
  }
}
