import { ChangeDetectionStrategy,Component, inject, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { HaMetadataNamesConfig } from '../../ha-core/ha-model/ha-config/ha-metadata-names.config';
import { HaMetadataService } from '../../ha-core/ha-service/ha-metadata.service';

@Component({
  selector: 'ha-404',
  templateUrl: './ha-404.component.html',
  styleUrls: ['./ha-404.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe],
})
export class Ha404Component implements OnInit {
  private metadataService = inject(HaMetadataService);

  @Input() errorText: string = 'error_page_not_found';

  ngOnInit(): void {
    this.metadataService.addMetaTag(HaMetadataNamesConfig.NOT_FOUND_URL, 'true');
  }
}
