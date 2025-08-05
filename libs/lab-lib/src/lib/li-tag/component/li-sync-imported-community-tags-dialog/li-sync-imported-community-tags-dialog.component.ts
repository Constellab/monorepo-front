import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiTagService, LiTagsNotSynchronized } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'li-sync-imported-community-tags-dialog',
  imports: [
    FlDialogModule,
    TranslatePipe,
    FlSectionModule,
    MatButton,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
  ],
  templateUrl: './li-sync-imported-community-tags-dialog.component.html',
  styleUrl: './li-sync-imported-community-tags-dialog.component.scss',
})
export class LiSyncImportedCommunityTagsDialogComponent implements OnInit {
  private readonly tagService = inject(LiTagService);
  private dialogRef = inject<MatDialogRef<LiSyncImportedCommunityTagsDialogComponent>>(MatDialogRef);

  notSynchronizedTags$: Observable<LiTagsNotSynchronized>;

  ngOnInit(): void {
    this.notSynchronizedTags$ = this.tagService.getNotSynchronizedCommunityTags();
  }

  synchronizeTags(tagsNotSynchronized: LiTagsNotSynchronized): void {
    this.dialogRef.close(tagsNotSynchronized);
  }
}
