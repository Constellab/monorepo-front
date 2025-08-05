import { Component, OnInit } from '@angular/core';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';

import { HaPublicEditBrickFormComponent } from '../ha-public-edit-brick-form/ha-public-edit-brick-form.component';

@Component({
  selector: 'ha-public-edit-brick-page',
  templateUrl: './ha-public-edit-brick-page.component.html',
  styleUrls: ['./ha-public-edit-brick-page.component.scss'],
  imports: [FlTextIconModule, HaPublicEditBrickFormComponent],
})
export class HaPublicEditBrickPageComponent implements OnInit {
  loaded = false;

  ngOnInit(): void {
    this.loaded = true;
  }
}
