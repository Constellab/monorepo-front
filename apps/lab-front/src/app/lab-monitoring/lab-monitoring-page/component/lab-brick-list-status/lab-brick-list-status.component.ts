import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LabBrickEntity } from '../../../../lab-core/model/entities/lab-brick.entity';
import { LabBrickService } from '../../../../lab-core/entity-service/lab-brick.service';

@Component({
  selector: 'lab-brick-list-status',
  templateUrl: './lab-brick-list-status.component.html',
  styleUrls: ['./lab-brick-list-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LabBrickListStatusComponent implements OnInit {
  private brickService = inject(LabBrickService);

  bricks$: Observable<LabBrickEntity[]>;

  ngOnInit(): void {
    this.bricks$ = this.brickService.getAllBricks();
  }
}
