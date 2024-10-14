import {Component, OnInit} from '@angular/core';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-public-edit-brick-page',
  templateUrl: './ha-public-edit-brick-page.component.html',
  styleUrls: ['./ha-public-edit-brick-page.component.scss']
})
export class HaPublicEditBrickPageComponent implements OnInit {

  loaded = false;
  bricksListRoute = HaRouterService.getBrickListRoute();

  ngOnInit(): void {
    this.loaded = true;
  }

}
