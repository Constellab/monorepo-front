import { Component, inject } from '@angular/core';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { CaLabInlineComponent } from '../../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-inline/ca-lab-inline.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CaLabMinimumDTO } from '../../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';

/**
 * Simple dialog to show information about a note
 */
@Component({
  selector: 'ca-note-info-dialog',
  imports: [
    AsyncPipe,
    CaLabInlineComponent,
    FlUserModule,
    TranslatePipe,
    FlDialogModule,
    CaHierarchyObjectIconComponent,
  ],
  templateUrl: './ca-note-info-dialog.component.html',
  styleUrl: './ca-note-info-dialog.component.scss',
})
export class CaNoteInfoDialogComponent {
  note: CaNote = inject(MAT_DIALOG_DATA);

  lab$: Observable<CaLabMinimumDTO> = inject(CaNoteService).getNoteLab(this.note.id);
}
