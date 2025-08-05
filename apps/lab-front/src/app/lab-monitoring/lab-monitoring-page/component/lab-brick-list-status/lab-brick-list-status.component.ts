import { ChangeDetectionStrategy, Component, inject,OnInit } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { LiBrickEntity, LiBrickService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LabBrickInfoComponent } from '../lab-brick-info/lab-brick-info.component';

@Component({
  selector: 'lab-brick-list-status',
  templateUrl: './lab-brick-list-status.component.html',
  styleUrls: ['./lab-brick-list-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FlCardModule,
    FlSectionModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    FlStatusModule,
    MatExpansionPanelDescription,
    LabBrickInfoComponent,
    TranslatePipe,
  ],
})
export class LabBrickListStatusComponent implements OnInit {
  private brickService = inject(LiBrickService);

  bricks$: Observable<LiBrickEntity[]>;

  ngOnInit(): void {
    this.bricks$ = this.brickService.getAllBricks();
  }
}
