import {Component, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  TeVariableFormDialogComponent,
  TeVariableFormDialogInput
} from '../te-variable-form-dialog/te-variable-form-dialog.component';
import {teVariableAttribute, TeVariableFormInfo} from '../../model/te-variable.class';
import {TeHelper} from '../../model/te.helper';

/**
 * Component as angular element to display a variable in the text editor as inline element
 */
@Component({
  selector: 'te-variable-inline',
  templateUrl: './te-variable-inline.component.html',
  styleUrl: './te-variable-inline.component.scss'
})
export class TeVariableInlineComponent implements OnInit {

  @Input() variable: TeVariableFormInfo;

  @HostBinding('attr.contenteditable') contenteditable = 'false';

  @HostListener('click') onClick(): void {
    this.openFormDialog();
  }

  isEditable: boolean = false;

  constructor(private dialogService: FlDialogService,
              private elementRef: ElementRef<HTMLElement>,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    const strVariable = this.elementRef.nativeElement.getAttribute(teVariableAttribute);
    this.variable = JSON.parse(strVariable);
    this.isEditable = TeHelper.parentBlockParagraphIsEditable(this.elementRef.nativeElement);
  }

  get tooltip(): string {
    if (!this.variable) return '';
    return `${this.variable.name}\n${this.variable.description}`;
  }


  openFormDialog(): void {
    const input: TeVariableFormDialogInput = {
      data: this.variable,
      isEditable: this.isEditable
    };

    this.dialogService.openSmallDialog(TeVariableFormDialogComponent, {data: input}).afterClosed().subscribe(
      value => this.onFormDialogClose(value)
    );
  }

  private onFormDialogClose(value?: TeVariableFormInfo): void {
    if (value) {
      this.setVariable(value);
    }
  }

  private setVariable(variable: TeVariableFormInfo): void {
    this.variable = variable;
    this.renderer.setAttribute(this.elementRef.nativeElement, teVariableAttribute, JSON.stringify(variable));
  }
}
