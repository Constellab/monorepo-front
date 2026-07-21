import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FlEnvironmentHelper } from '@monorepo/front-core-lib/fl-core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

@Component({
  selector: 'fl-powered-by-constellab',
  standalone: false,
  templateUrl: './fl-powered-by-constellab.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './fl-powered-by-constellab.component.scss',
})
export class FlPoweredByConstellabComponent {
  constellabUrl = FlEnvironmentHelper.getConstellabPublicUrl();

  logo = inject(FlThemeService).getPoweredByLogo();
}
