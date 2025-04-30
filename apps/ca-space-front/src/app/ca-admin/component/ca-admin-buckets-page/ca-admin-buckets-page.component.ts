import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { CaBucketSearchComponent } from '../bucket/ca-bucket-search/ca-bucket-search.component';

/**
 * Search page for all bucket
 */
@Component({
  selector: 'ca-ca-admin-buckets-page',
  templateUrl: './ca-admin-buckets-page.component.html',
  styleUrls: ['./ca-admin-buckets-page.component.scss'],
  imports: [CaBucketSearchComponent],
})
export class CaAdminBucketsPageComponent {
  constructor() {
    const titleService = inject(Title);
    const translateService = inject(FlTranslateService);

    titleService.setTitle(`Admin - ${translateService.translate('bucket_list')}`);
  }
}
