import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { LabBrickInfoComponent } from '../lab-brick-info/lab-brick-info.component';
import { LiBrickEntity, LiBrickService } from '@monorepo/lab-lib/li-core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

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
