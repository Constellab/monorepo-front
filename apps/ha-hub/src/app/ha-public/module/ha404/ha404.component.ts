import {Component, Input, OnInit} from '@angular/core';
import {HaMetadataService} from '../../../ha-core/ha-service/ha-metadata.service';
import {HaMetadataNamesConfig} from '../../../ha-core/ha-model/ha-config/ha-metadata-names.config';

@Component({
  selector: 'ha-ha404',
  templateUrl: './ha404.component.html',
  styleUrls: ['./ha404.component.scss']
})
export class Ha404Component implements OnInit{

  @Input() errorText: string = 'error_page_not_found'

  constructor(
    private metadataService: HaMetadataService
  ) {
  }

  ngOnInit(): void {
    this.metadataService.addMetaTag(HaMetadataNamesConfig.NOT_FOUND_URL, 'true');
  }

}
