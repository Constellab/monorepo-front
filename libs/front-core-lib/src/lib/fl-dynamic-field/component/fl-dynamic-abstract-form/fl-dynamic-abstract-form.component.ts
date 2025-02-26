import {
  Component,
  ComponentRef,
  effect,
  inject,
  input,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FlDynamicFormAbstractControl } from '../../model/fl-dynamic-field-config.class';
import { AbstractControl } from '@angular/forms';
import { FlDynamicAbstractFormDirective } from '../../model/fl-dynamic-abstract-form.directive';
import { FlDynamicFieldConfigService } from '../../model/fl-dynamic-field-config.service';

/**
 * Component to generate a FormGroup, FormArray or FormControl form base on config
 */
@Component({
  selector: 'fl-dynamic-abstract-form',
  templateUrl: './fl-dynamic-abstract-form.component.html',
  styleUrls: ['./fl-dynamic-abstract-form.component.scss'],
  standalone: false,
})
export class FlDynamicAbstractFormComponent implements OnDestroy {
  config = input.required<FlDynamicFormAbstractControl>();

  control = input.required<AbstractControl>();

  configName = input<string>();

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private viewComponentRef: ComponentRef<FlDynamicAbstractFormDirective>;
  private configService = inject(FlDynamicFieldConfigService);

  constructor() {
    effect(() => {
      this.destroy();
      // regenerate the component based on the config type
      this.viewComponentRef = this.configService.generateGroupComponent(
        this.config(),
        this.control(),
        this.configName(),
        this.viewContainer
      );
    });
  }

  private destroy(): void {
    this.viewComponentRef?.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
