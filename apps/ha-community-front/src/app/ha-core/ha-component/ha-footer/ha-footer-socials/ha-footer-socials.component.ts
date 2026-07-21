import { ChangeDetectionStrategy,Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';

@Component({
  selector: 'ha-footer-socials',
  templateUrl: './ha-footer-socials.component.html',
  styleUrls: ['./ha-footer-socials.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconModule, FlIconModule],
})
export class HaFooterSocialsComponent{}
