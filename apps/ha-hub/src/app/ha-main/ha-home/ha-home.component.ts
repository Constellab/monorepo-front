import {Component, OnInit} from '@angular/core';
import {HaConstellabHelper} from '../../ha-core/ha-model/ha-config/ha-constellab.helper';
import {HaMetadataService} from '../../ha-core/ha-service/ha-metadata.service';
import {HaRouterService} from '../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-ha-home',
  templateUrl: './ha-home.component.html',
  styleUrls: ['./ha-home.component.scss']
})
export class HaHomeComponent implements OnInit {

  constellabUrl: string = HaConstellabHelper.getConstellabUrl();



  constructor(private metadataService: HaMetadataService,
              private haRouterService: HaRouterService) {
  }

  ngOnInit(): void {
    this.metadataService.setPageTitle('ha.home.title');
    this.metadataService.addMetaTag('description', 'ha.home.description');
  }

  getTechDocRoute(): string {
    return HaRouterService.getTechDocRoute();
  }

  getProductDocRoute(): string {
    return HaRouterService.getProductDocRoute();
  }
}
