import { Component, OnInit } from '@angular/core';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';
import { RouterLink } from '@angular/router';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { HaPublicEditBrickFormComponent } from '../ha-public-edit-brick-form/ha-public-edit-brick-form.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-public-edit-brick-page',
  templateUrl: './ha-public-edit-brick-page.component.html',
  styleUrls: ['./ha-public-edit-brick-page.component.scss'],
  imports: [RouterLink, FlTextIconModule, MatIcon, HaPublicEditBrickFormComponent, TranslatePipe],
})
export class HaPublicEditBrickPageComponent implements OnInit {
  loaded = false;
  bricksListRoute = HaRouterService.getBrickListRoute();

  ngOnInit(): void {
    this.loaded = true;
  }
}
