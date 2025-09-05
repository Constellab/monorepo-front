import { Component, OnInit } from '@angular/core';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';

import { HaEditBrickFormComponent } from '../ha-edit-brick-form/ha-edit-brick-form.component';

@Component({
  selector: 'ha-edit-brick-page',
  templateUrl: './ha-edit-brick-page.component.html',
  styleUrls: ['./ha-edit-brick-page.component.scss'],
  imports: [FlTextIconModule, HaEditBrickFormComponent],
})
export class HaEditBrickPageComponent implements OnInit {
  loaded = false;

  ngOnInit(): void {
    this.loaded = true;
  }
}
