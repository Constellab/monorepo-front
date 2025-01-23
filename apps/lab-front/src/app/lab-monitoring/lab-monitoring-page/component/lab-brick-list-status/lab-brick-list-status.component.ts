import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LabBrickEntity } from '../../../../lab-core/model/entities/lab-brick.entity';
import { LabBrickService } from '../../../../lab-core/entity-service/lab-brick.service';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { LabBrickInfoComponent } from '../lab-brick-info/lab-brick-info.component';
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
  private brickService = inject(LabBrickService);

  bricks$: Observable<LabBrickEntity[]>;

  ngOnInit(): void {
    this.bricks$ = this.brickService.getAllBricks();
  }
}
