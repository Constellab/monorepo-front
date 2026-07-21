import { ChangeDetectionStrategy,Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'co-deprecated-tag',
  imports: [TranslatePipe],
  templateUrl: './co-deprecated-tag.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './co-deprecated-tag.component.scss',
})
export class CoDeprecatedTagComponent {
  isDeprecated = input<boolean>(true);
}
