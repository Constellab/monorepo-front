import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import {
  FlDialogService,
  FlFormFieldDirective,
  FlInputSearchAdvancedButton,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib';
import { NgControl } from '@angular/forms';
import {
  LabNoteTemplate,
  LabNoteTemplateDatasource,
} from '../../../../model/entities/lab-note-template.entity';
import { LabNoteTemplateService } from '../../../../entity-service/lab-note-template.service';
import { Observable } from 'rxjs';
import {
  LabSelectNoteTemplateDialogComponent,
  LabSelectNoteTemplateDialogInput,
} from '../lab-select-note-template-dialog/lab-select-note-template-dialog.component';
import { FlInputSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-input-search/fl-input-search.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { LabNoteTemplateInlineComponent } from '../lab-note-template-inline/lab-note-template-inline.component';

@Component({
  selector: 'lab-select-note-template',
  templateUrl: './lab-select-note-template.component.html',
  styleUrls: ['./lab-select-note-template.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LabSelectNoteTemplateComponent }],
  imports: [FlInputSearchModule, FlUserModule, LabNoteTemplateInlineComponent],
})
export class LabSelectNoteTemplateComponent extends FlFormFieldDirective<LabNoteTemplate> implements OnInit {
  private noteTemplateService = inject(LabNoteTemplateService);
  private dialogService = inject(FlDialogService);

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<LabNoteTemplate> = new EventEmitter();

  selectedNoteTemplate: LabNoteTemplate | Observable<LabNoteTemplate>;

  datasource: LabNoteTemplateDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LabNoteTemplate>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.noteTemplateService.searchByNameDatasource();

    const data: LabSelectNoteTemplateDialogInput = { mode: 'selection' };
    this.advancedButton = {
      onClick: () =>
        this.dialogService.openBigDialog(LabSelectNoteTemplateDialogComponent, { data }).afterClosed(),
    };
  }

  callChangeEvent(value: LabNoteTemplate): void {
    this.valueChange.emit(value);
    this.selectedNoteTemplate = value;
  }

  onDisableChange(): void {}

  writeValue(obj: LabNoteTemplate): void {
    if (obj == null || (typeof obj != 'string' && obj.id == null)) {
      this.selectedNoteTemplate = null;
      this.value = null;
      return;
    }

    if (typeof obj == 'string') {
      this.selectedNoteTemplate = this.noteTemplateService.getNoteTemplate(obj);
    } else if (!(obj instanceof LabNoteTemplate)) {
      this.selectedNoteTemplate = this.noteTemplateService.getNoteTemplate((obj as any).id);
    } else {
      // if the user is complete
      this.selectedNoteTemplate = obj;
    }

    this.value = obj;
  }
}
