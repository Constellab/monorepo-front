import {
  Component,
  ComponentRef,
  effect,
  inject,
  Injector,
  input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FlDynamicFieldConfig } from '../../model/fl-dynamic-field-config.class';
import { UntypedFormControl } from '@angular/forms';
import { FlDynamicAbstractFormDirective } from '../../model/fl-dynamic-abstract-form.directive';
import { FlDynamicFieldAbstractDirective } from '../../model/fl-dynamic-field-abstract.directive';
import { FlDynamicFieldConfigService } from '../../model/fl-dynamic-field-config.service';

/**
 * NgModel component to generate a form field dynamically based on a config
 */
@Component({
  selector: 'fl-dynamic-field',
  templateUrl: './fl-dynamic-field.component.html',
  styleUrls: ['./fl-dynamic-field.component.scss'],
  standalone: false,
})
export class FlDynamicFieldComponent implements OnInit, OnDestroy, FlDynamicAbstractFormDirective {
  private fieldConfig = inject(FlDynamicFieldConfigService);
  private injector = inject(Injector);

  config = input<FlDynamicFieldConfig>();

  control = input<UntypedFormControl>();

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private viewComponentRef: ComponentRef<FlDynamicFieldAbstractDirective>;

  ngOnInit(): void {
    effect(
      () => {
        this.destroy();
        this.fieldConfig
          .generateFieldComponent(this.config(), this.viewContainer, this.control())
          .then((componentRef) => (this.viewComponentRef = componentRef));
      },
      { injector: this.injector }
    );
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  private destroy(): void {
    this.viewComponentRef?.destroy();
  }
}
