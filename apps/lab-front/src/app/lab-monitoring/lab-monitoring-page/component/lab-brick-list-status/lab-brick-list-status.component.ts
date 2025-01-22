import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LabBrickEntity } from '../../../../lab-core/model/entities/lab-brick.entity';
import { LabBrickService } from '../../../../lab-core/entity-service/lab-brick.service';
import { FlCardModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatExpansionPanelDescription,
} from '@angular/material/expansion';
import { FlStatusModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-status/fl-status.module';
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
