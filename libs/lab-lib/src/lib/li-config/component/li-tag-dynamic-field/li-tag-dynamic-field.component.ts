import { ChangeDetectionStrategy,Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';

/**
 * Component used under {@link FlDynamicFieldComponent} to show
 * tag input
 */
@Component({
  selector: 'li-tag-dynamic-field',
  templateUrl: './li-tag-dynamic-field.component.html',
  styleUrls: ['./li-tag-dynamic-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlFormModule, FlTagModule, ReactiveFormsModule],
})
export class LiTagDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
