import { Component, Input, OnInit, inject } from '@angular/core';
import { HaMetadataService } from '../../../ha-core/ha-service/ha-metadata.service';
import { HaMetadataNamesConfig } from '../../../ha-core/ha-model/ha-config/ha-metadata-names.config';

@Component({
  selector: 'ha-ha404',
  templateUrl: './ha404.component.html',
  styleUrls: ['./ha404.component.scss'],
  standalone: false,
})
export class Ha404Component implements OnInit {
  private metadataService = inject(HaMetadataService);

  @Input() errorText: string = 'error_page_not_found';

  ngOnInit(): void {
    this.metadataService.addMetaTag(HaMetadataNamesConfig.NOT_FOUND_URL, 'true');
  }
}
