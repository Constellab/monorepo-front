import { ChangeDetectionStrategy,Component, HostBinding, HostListener, inject, OnInit } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { TeElementInlineDirective } from '../../model/te-element.directive';
import { TeVariableFormInfo } from '../../model/te-variable.class';
import { TeVariableFormDialogComponent } from '../te-variable-form-dialog/te-variable-form-dialog.component';

/**
 * Component as angular element to display a variable in the text editor as inline element
 */
@Component({
  selector: 'te-variable-inline',
  templateUrl: './te-variable-inline.component.html',
  styleUrl: './te-variable-inline.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TeVariableInlineComponent
  extends TeElementInlineDirective<TeVariableFormInfo>
  implements OnInit
{
  private dialogService = inject(FlDialogService);

  @HostBinding('attr.contenteditable') contenteditable = 'false';

  @HostListener('click') onClick(): void {
    this.openFormDialog();
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (!this.disabled && this.newElement) {
      this.openFormDialog();
    }
  }

  get tooltip(): string {
    if (!this.data) return '';
    return `${this.data.description}`;
  }

  openFormDialog(): void {
    if (this.disabled) return;

    this.dialogService
      .openSmallDialog(TeVariableFormDialogComponent, { data: this.data })
      .afterClosed()
      .subscribe((value) => this.onFormDialogClose(value));
  }

  private onFormDialogClose(value?: TeVariableFormInfo): void {
    if (value) {
      this.setData(value);
    }
  }
}
