import { Component, Input } from '@angular/core';
import { CaLab } from '../../../../model/entities/lab/ca-lab.class';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-lab-inline',
  templateUrl: './ca-lab-inline.component.html',
  styleUrls: ['./ca-lab-inline.component.scss'],
  imports: [FlTextIconModule, MatIcon, MatTooltip, TranslatePipe],
})
export class CaLabInlineComponent {
  @Input() lab: CaLab;
}
