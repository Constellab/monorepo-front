import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { LiBrickEntity, LiBrickService } from '@monorepo/lab-lib/li-core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Observable } from 'rxjs';

@Component({
  selector: 'li-bricks-select-options',
  templateUrl: './li-bricks-select-options.component.html',
  styleUrls: ['./li-bricks-select-options.component.scss'],
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
