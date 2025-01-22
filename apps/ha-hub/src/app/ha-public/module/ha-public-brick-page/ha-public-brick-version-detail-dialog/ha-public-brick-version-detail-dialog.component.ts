import { Component, OnInit, inject } from '@angular/core';
import { HaBrickVersion } from '../../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import {
  HaBrickVersionReferenceState,
  HaReferenceDTO,
} from '../../../../ha-core/ha-model/ha-entities/ha-version.class';
import { HaBrickVersionService } from '../../../../ha-core/ha-service/ha-brick-version.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ha-public-brick-version-detail-dialog',
  templateUrl: './ha-public-brick-version-detail-dialog.component.html',
  styleUrls: ['./ha-public-brick-version-detail-dialog.component.scss'],
  standalone: false,
})
export class HaPublicBrickVersionDetailDialogComponent implements OnInit {
  private input = inject<HaBrickVersion>(MAT_DIALOG_DATA);
  private brickVersionService = inject(HaBrickVersionService);

  bv: HaBrickVersion;

  references: HaReferenceDTO[];

  directReferences: HaReferenceDTO[] = [];

  indirectReferences: HaReferenceDTO[] = [];

  ngOnInit(): void {
    this.bv = this.input;
    this.brickVersionService.getAllReferences(this.bv.id).subscribe((res) => {
      this.references = res;
      for (const r of this.references) {
        if (r.referenceState == HaBrickVersionReferenceState.DIRECT) this.directReferences.push(r);
        else this.indirectReferences.push(r);
      }
    });
  }
}
