import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';

import { CaCoServiceConfig } from '../model/config/ca-co-service-config.service';

@Injectable({ providedIn: 'root' })
export class CaCommunityBrickService {
  private apiService = inject(FlApiService);
  private communityServiceConfig = inject(CaCoServiceConfig);

  private readonly route = 'community';

  getImageUrl(filename: string): string {
    return this.apiService.getBaseRouteUrl(
      `brick/image/${filename}`,
      this.communityServiceConfig.getCommunityApiUrl() + '/'
    );
  }
}
