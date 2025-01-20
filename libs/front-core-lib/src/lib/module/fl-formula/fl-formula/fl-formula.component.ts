import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'fl-formula',
    templateUrl: './fl-formula.component.html',
    styleUrl: './fl-formula.component.scss',
    standalone: false
})
export class FlFormulaComponent implements OnInit, OnDestroy {
  @Input() formula: string | Observable<string>;

  /**
   * Change the handling of error messages
   * If set to 'view', the error message not be display but the formula will be displayed as is
   * If set to 'edit', the error message will be displayed
   */
  @Input() mode: 'view' | 'edit' = 'view';

  private componentRef: ComponentRef<any>;

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    const { FlFormulaStandaloneComponent } = await import(
      '../../fl-formula/fl-formula-standalone/fl-formula-standalone.component'
    );
    this.componentRef = this.viewContainer.createComponent(FlFormulaStandaloneComponent);
    this.componentRef.instance.formula = this.formula;
    this.componentRef.instance.mode = this.mode;
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.componentRef?.destroy();
  }
}
