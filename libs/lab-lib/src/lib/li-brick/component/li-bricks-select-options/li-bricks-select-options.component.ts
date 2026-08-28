import { AsyncPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { LiBrickEntity, LiBrickService } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

@Component({
  selector: 'li-bricks-select-options',
  templateUrl: './li-bricks-select-options.component.html',
  styleUrls: ['./li-bricks-select-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatOption, AsyncPipe],
})
export class LiBricksSelectOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit
{
  private select: MatSelect;
  private brickService = inject(LiBrickService);

  bricks$: Observable<LiBrickEntity[]>;

  constructor() {
    const select = inject(MatSelect, { host: true });

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
