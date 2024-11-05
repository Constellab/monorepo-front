import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FlTranslateService } from '@monorepo/front-core-lib';

/**
 * Search page for all bucket
 */
@Component({
  selector: 'ca-ca-admin-buckets-page',
  templateUrl: './ca-admin-buckets-page.component.html',
  styleUrls: ['./ca-admin-buckets-page.component.scss'],
})
export class CaAdminBucketsPageComponent {
  constructor(titleService: Title, translateService: FlTranslateService) {
    titleService.setTitle(`Admin - ${translateService.translate('bucket_list')}`);
  }
}
