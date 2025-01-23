import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { LabBrickService } from '../../../../entity-service/lab-brick.service';
import { Observable } from 'rxjs';
import { LabBrickEntity } from '../../../../model/entities/lab-brick.entity';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lab-bricks-select-options',
  templateUrl: './lab-bricks-select-options.component.html',
  styleUrls: ['./lab-bricks-select-options.component.scss'],
  imports: [MatOption, AsyncPipe],
})
export class LabBricksSelectOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit
{
  private select: MatSelect;
  private brickService = inject(LabBrickService);

  bricks$: Observable<LabBrickEntity[]>;

  constructor() {
    const select = inject(MatSelect, { host: true, optional: true });

    super(select);

    this.select = select;
  }

  ngOnInit(): void {
    this.bricks$ = this.brickService.getAllBricks();
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
