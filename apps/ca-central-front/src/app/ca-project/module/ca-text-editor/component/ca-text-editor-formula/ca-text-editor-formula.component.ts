import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CaTextEditorElementDirective} from '../../model/ca-text-editor-element.directive';
import {CaTextEditorsManagerState} from '../../state/ca-text-editors-manager.state';
import {Observable} from 'rxjs';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  CaTextEditorFormulaDialogComponent,
  CaTextEditorFormulaDialogInput
} from '../ca-text-editor-formula-dialog/ca-text-editor-formula-dialog.component';

@Component({
  selector: 'ca-text-editor-formula',
  templateUrl: './ca-text-editor-formula.component.html',
  styleUrls: ['./ca-text-editor-formula.component.scss']
})
export class CaTextEditorFormulaComponent extends CaTextEditorElementDirective
  implements OnInit, OnDestroy {

  @HostBinding('attr.formula')
  @Input() formula: string;

  @HostBinding('attr.formula-title')
  @Input() formulaTitle: string;

  @HostBinding('attr.caption')
  @Input() caption: string;

  @ViewChild('viewContainer', {static: true, read: ViewContainerRef}) viewContainer: ViewContainerRef;

  disabled$: Observable<boolean>;

  private componentRef: ComponentRef<any>;

  constructor(elementRef: ElementRef<HTMLElement>,
              managersState: CaTextEditorsManagerState,
              private changeDetectorRef: ChangeDetectorRef,
              private dialogService: FlDialogService) {
    super(elementRef, managersState);
  }

  async ngOnInit(): Promise<void> {
    const {FlFormulaStandaloneComponent} = await import('@monorepo/front-core-lib');
    this.componentRef = this.viewContainer.createComponent(FlFormulaStandaloneComponent);
    this.componentRef.instance.formula = this.formula;
    this.changeDetectorRef.markForCheck();
    this.disabled$ = this.getDisabled$();
  }

  updateFormula(): void {
    const input: CaTextEditorFormulaDialogInput = {
      mode: 'update',
      object: this.formula,
    };
    this.dialogService.openSmallDialog(CaTextEditorFormulaDialogComponent, {data: input})
      .afterClosed().subscribe((formula: string) => this.onFormulaDialogClosed(formula));
  }

  private onFormulaDialogClosed(formula?: string): void {
    if (formula) {
      this.formula = formula;
      this.componentRef.instance.formula = formula;
      this.changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }


}
