import {Component, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {FlDialogService} from '@monorepo/front-core-lib';
import {TeVariableFormComponent} from '../te-variable-form/te-variable-form.component';
import {teVariableAttribute, TeVariableFormInfo} from '../../model/te-variable.class';

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

  constructor(private dialogService: FlDialogService,
              private elementRef: ElementRef<HTMLElement>,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    const strVariable = this.elementRef.nativeElement.getAttribute(teVariableAttribute);
    this.variable = JSON.parse(strVariable);
  }

  get tooltip(): string {
    if(!this.variable) return '';
    return `${this.variable.name}\n${this.variable.description}`;
  }


  openFormDialog(): void {
    this.dialogService.openSmallDialog(TeVariableFormComponent, {data: this.variable}).afterClosed().subscribe(
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
