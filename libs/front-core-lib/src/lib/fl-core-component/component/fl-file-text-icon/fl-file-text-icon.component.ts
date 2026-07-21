import { ChangeDetectionStrategy,Component, computed, input } from '@angular/core';
import { flGetFileIconFromExtension } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';

/**
 * Show an icon based on the file extension
 */
@Component({
  selector: 'fl-file-text-icon',
  templateUrl: './fl-file-text-icon.component.html',
  styleUrls: ['./fl-file-text-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlFileTextIconComponent {
  filename = input.required<string>();

  icon = computed(() => {
    const extension = FlFileHelper.getFileExtension(this.filename());

    return flGetFileIconFromExtension(extension);
  });
}
