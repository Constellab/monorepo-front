import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'fl-formula',
  templateUrl: './fl-formula.component.html',
  styleUrl: './fl-formula.component.scss',
})
export class FlFormulaComponent implements OnInit, OnDestroy {

  @Input() formula: string | Observable<string>;

  private componentRef: ComponentRef<any>;

  @ViewChild('viewContainer', {static: true, read: ViewContainerRef}) viewContainer: ViewContainerRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  async ngOnInit(): Promise<void> {
    const {FlFormulaStandaloneComponent} = await import('../../fl-formula/fl-formula-standalone/fl-formula-standalone.component');
    this.componentRef = this.viewContainer.createComponent(FlFormulaStandaloneComponent);
    this.componentRef.instance.formula = this.formula;
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.componentRef?.destroy();
  }


}
