import { ChangeDetectionStrategy,Component } from '@angular/core';

import { LmsPageComponent } from './components/lms-page/lms-page.component';

@Component({
  selector: 'lms-root',
  templateUrl: './lms-app.component.html',
  styleUrl: './lms-app.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LmsPageComponent],
})
export class LmsAppComponent {}
