import { Component, Input } from '@angular/core';
import { LiLab, LiLabMode } from '@monorepo/lab-lib/li-core';

@Component({
  selector: 'li-lab-inline',
  templateUrl: './li-lab-inline.component.html',
  styleUrls: ['./li-lab-inline.component.scss'],
  imports: [],
})
export class LiLabInlineComponent {
  @Input({ required: true }) lab: LiLab;

  labModes = LiLabMode;
}
