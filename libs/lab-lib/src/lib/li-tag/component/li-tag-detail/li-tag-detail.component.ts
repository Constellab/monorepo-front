import { Component, inject, input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LiTagDetailState } from '../../state/li-tag-detail.state';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { TranslatePipe } from '@ngx-translate/core';
import { TeCompleteConfig, TeTextEditorModule } from '@monorepo/text-editor';
import { FormsModule } from '@angular/forms';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import {
  CoDeprecatedTagComponent,
  CoTagValue,
  CoTagValueEditDialogComponent,
  CoTagValueEditDialogInput,
  CoTagValuesTableComponent,
} from '@monorepo/community-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  LiShareTagToCommunityDialogComponent,
  LiShareTagToCommunityDialogInput
} from '../li-share-tag-to-community-dialog/li-share-tag-to-community-dialog.component';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'li-tag-detail',
  imports: [
    FlSectionModule,
    TranslatePipe,
    TeTextEditorModule,
    FormsModule,
    FlDateModule,
    FlInfiniteScrollModule,
    MatIcon,
    FlCorePipeModule,
    FlTextIconModule,
    FlIconModule,
    FlFormModule,
    MatIconButton,
    FlKeyValueModule,
    FlUserModule,
    CoDeprecatedTagComponent,
    CoTagValuesTableComponent,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatTooltip,
  ],
  templateUrl: './li-tag-detail.component.html',
  styleUrl: './li-tag-detail.component.scss',
  providers: [LiTagDetailState],
})
export class LiTagDetailComponent implements OnInit {
  private state = inject(LiTagDetailState);
  private dialogService = inject(FlDialogService);

  tagKey = input.required<string | Observable<string>>();

  displayMode = input<'fullPage' | 'fullDialog' | 'dense'>('fullPage');

  tagKeyModel = this.state.tagKey;

  textEditorConfig = new TeCompleteConfig();

  tagKeyValues$ = this.state.values$;

  ngOnInit(): void {
    const tagKey: string | Observable<string> = this.tagKey();
    if (tagKey instanceof Observable) {
      tagKey.subscribe((key) => this.onNewTagKey(key));
    } else {
      this.onNewTagKey(tagKey);
    }
  }

  updateLabel(label: string): void {
    console.log('updateLabel', label);
  }

  shareTagKey(): void {
    const input: LiShareTagToCommunityDialogInput = {
      tagKey: this.tagKeyModel().key,
    };
    this.dialogService.openSmallDialog(LiShareTagToCommunityDialogComponent, { data: input });
  }

  openAddTagValueDialog(): void {
    const input: CoTagValueEditDialogInput = {
      mode: 'create',
      object: {
        tagKey: this.tagKeyModel().toCoTagKey(),
      },
    };

    this.dialogService
      .openSmallDialog(CoTagValueEditDialogComponent, { data: input })
      .afterClosed()
      .subscribe((tagValue) => {
        if (tagValue) {
          this.state.onNewTagKey(this.tagKeyModel());
        }
      });
  }

  openEditTagValueDialog(tagValue: CoTagValue): void {
    const input: CoTagValueEditDialogInput = {
      mode: 'update',
      object: {
        tagKey: this.tagKeyModel().toCoTagKey(),
        id: tagValue.id,
        value: tagValue.value as string,
        additionalInfos: tagValue.additionalInfos,
        shortDescription: tagValue.shortDescription,
      },
    };

    this.dialogService
      .openSmallDialog(CoTagValueEditDialogComponent, { data: input })
      .afterClosed()
      .subscribe((tagValue) => {
        if (tagValue) {
          this.state.onNewTagKey(this.tagKeyModel());
        }
      });
  }

  private onNewTagKey(key: string): void {
    if (key == null) return;
    this.state.init(key);
  }
}
