import { Component, EventEmitter, inject,Input, OnInit, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FlFormFieldDirective, FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputSearchAdvancedButton, FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiNoteTemplate, LiNoteTemplateDatasource, LiNoteTemplateService } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

import { LiNoteTemplateInlineComponent } from '../li-note-template-inline/li-note-template-inline.component';
import {
  LiSelectNoteTemplateDialogComponent,
  LiSelectNoteTemplateDialogInput,
} from '../li-select-note-template-dialog/li-select-note-template-dialog.component';

@Component({
  selector: 'li-select-note-template',
  templateUrl: './li-select-note-template.component.html',
  styleUrls: ['./li-select-note-template.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LiSelectNoteTemplateComponent }],
  imports: [FlInputSearchModule, FlUserModule, LiNoteTemplateInlineComponent],
})
export class LiSelectNoteTemplateComponent extends FlFormFieldDirective<LiNoteTemplate> implements OnInit {
  private noteTemplateService = inject(LiNoteTemplateService);
  private dialogService = inject(FlDialogService);

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<LiNoteTemplate> = new EventEmitter();

  selectedNoteTemplate: LiNoteTemplate | Observable<LiNoteTemplate>;

  datasource: LiNoteTemplateDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LiNoteTemplate>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.noteTemplateService.searchByNameDatasource();

    const data: LiSelectNoteTemplateDialogInput = { mode: 'selection' };
    this.advancedButton = {
      onClick: () =>
        this.dialogService.openBigDialog(LiSelectNoteTemplateDialogComponent, { data }).afterClosed(),
    };
  }

  callChangeEvent(value: LiNoteTemplate): void {
    this.valueChange.emit(value);
    this.selectedNoteTemplate = value;
  }

  onDisableChange(): void {}

  writeValue(obj: LiNoteTemplate): void {
    if (obj == null || (typeof obj != 'string' && obj.id == null)) {
      this.selectedNoteTemplate = null;
      this.value = null;
      return;
    }

    if (typeof obj == 'string') {
      this.selectedNoteTemplate = this.noteTemplateService.getNoteTemplate(obj);
    } else if (!(obj instanceof LiNoteTemplate)) {
      this.selectedNoteTemplate = this.noteTemplateService.getNoteTemplate((obj as any).id);
    } else {
      // if the user is complete
      this.selectedNoteTemplate = obj;
    }

    this.value = obj;
  }
}
