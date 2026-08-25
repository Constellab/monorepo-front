import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import {
  CoDeprecatedTagComponent,
  CoTagAdditionalInfoSpecState,
  CoTagCommunityIconComponent,
  CoTagValue,
  CoTagValueEditDialogComponent,
  CoTagValueEditDialogInput,
  CoTagValuesTableComponent,
} from '@monorepo/community-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlDrawerModule } from '@monorepo/front-core-lib/fl-drawer';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiRouterService, LiTagKeyModel, LiTagService } from '@monorepo/lab-lib/li-core';
import { TdAbstractDynamicParamSpecState, TdParamSpecs } from '@monorepo/technical-doc';
import { TeCompleteConfig, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LiTagDetailState } from '../../state/li-tag-detail.state';
import {
  LiShareTagToCommunityDialogComponent,
  LiShareTagToCommunityDialogInput,
} from '../li-share-tag-to-community-dialog/li-share-tag-to-community-dialog.component';

@Component({
  selector: 'li-tag-detail',
  imports: [
    FlDrawerModule,
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
    CoTagCommunityIconComponent,
    MatButton,
  ],
  templateUrl: './li-tag-detail.component.html',
  styleUrl: './li-tag-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    LiTagDetailState,
    { provide: TdAbstractDynamicParamSpecState, useClass: CoTagAdditionalInfoSpecState },
  ],
})
export class LiTagDetailComponent implements OnInit {
  private state = inject(LiTagDetailState);
  private dialogService = inject(FlDialogService);
  private tagService = inject(LiTagService);
  private router = inject(Router);

  private tagAdditionalInfoSpecState = inject(
    TdAbstractDynamicParamSpecState
  ) as CoTagAdditionalInfoSpecState;

  tagKey = input.required<string | Observable<string>>();

  displayMode = input<'fullPage' | 'fullDialog' | 'dense'>('fullPage');

  tagKeyModel = computed(() => {
    const tagKeyModel = this.state.tagKey();
    if (tagKeyModel) this.tagAdditionalInfoSpecState.init(tagKeyModel.toCoTagKey());
    return tagKeyModel;
  });

  textEditorConfig = new TeCompleteConfig();

  tagKeyValues$ = this.state.values$;

  ngOnInit(): void {
    const tagKey: string | Observable<string> = this.tagKey();
    if (tagKey instanceof Observable) {
      tagKey.subscribe((key) => this.onNewTagKey(key));
    } else {
      this.onNewTagKey(tagKey);
    }

    this.tagAdditionalInfoSpecState.onAdditionalInfoSpecsChanged$.subscribe(
      (additionalInfoSpecs: TdParamSpecs) => {
        const tagKeyModel = this.tagKeyModel();
        if (tagKeyModel && additionalInfoSpecs && additionalInfoSpecs !== tagKeyModel.additionalInfosSpecs) {
          this.state.updateTagKeyAdditionalInfoSpecs(additionalInfoSpecs);
        }
      }
    );
  }

  updateLabel(label: string): void {
    this.tagService.updateTagLabel(this.requireTagKeyModel().key, label).subscribe((updatedTag) => {
      if (updatedTag) {
        this.state.updateTagKey(updatedTag);
      }
    });
  }

  shareTagKey(): void {
    const input: LiShareTagToCommunityDialogInput = {
      tagKey: this.requireTagKeyModel().key,
    };
    this.dialogService.openSmallDialog(LiShareTagToCommunityDialogComponent, { data: input });
  }

  openAddTagValueDialog(): void {
    const input: CoTagValueEditDialogInput = {
      mode: 'create',
      object: {
        tagKey: this.requireTagKeyModel().toCoTagKey(),
      },
    };

    this.dialogService
      .openSmallDialog(CoTagValueEditDialogComponent, { data: input })
      .afterClosed()
      .subscribe((tagValue) => {
        if (tagValue) {
          this.state.onNewTagKey(this.requireTagKeyModel());
        }
      });
  }

  openEditAdditionalInfoSpecDialog(): void {
    this.tagAdditionalInfoSpecState.openConfigureParamSpecsTableDialog();
  }

  openDeleteTagKeyDialog(): void {
    this.dialogService
      .openConfirmDialog({
        title: 'li.delete_tag_key',
        content: 'li.delete_tag_key_content',
        successMessage: 'li.delete_tag_key_success',
        observable: this.tagService.deleteTagKey(this.requireTagKeyModel().key),
      })
      .afterClosed()
      .subscribe((res: FlConfirmDialogResult) => {
        if (res.choice) {
          this.router.navigate([LiRouterService.getTagSearchRoute()]);
        }
      });
  }

  openDeleteTagValueDialog(tagValue: CoTagValue): void {
    this.dialogService
      .openConfirmDialog({
        title: 'li.delete_tag_value',
        content: 'li.delete_tag_value_content',
        successMessage: 'li.delete_tag_value_success',
        observable: this.tagService.deleteTagValue(tagValue.id),
      })
      .afterClosed()
      .subscribe((res: FlConfirmDialogResult) => {
        if (res.choice) {
          this.state.onNewTagKey(this.requireTagKeyModel());
        }
      });
  }

  openEditTagValueDialog(tagValue: CoTagValue): void {
    const input: CoTagValueEditDialogInput = {
      mode: 'update',
      object: {
        tagKey: this.requireTagKeyModel().toCoTagKey(),
        id: tagValue.id,
        value: tagValue.value as string,
        additionalInfos: tagValue.additionalInfos ?? {},
        shortDescription: tagValue.shortDescription,
      },
    };

    this.dialogService
      .openSmallDialog(CoTagValueEditDialogComponent, { data: input })
      .afterClosed()
      .subscribe((tagValue) => {
        if (tagValue) {
          this.state.onNewTagKey(this.requireTagKeyModel());
        }
      });
  }

  private onNewTagKey(key: string): void {
    if (key == null) return;
    this.state.init(key);
  }

  /**
   * The tag key model is only null before the initial load; every action here is only
   * reachable once it is displayed, so this throws if that invariant is ever broken.
   */
  private requireTagKeyModel(): LiTagKeyModel {
    const tagKeyModel = this.tagKeyModel();
    if (tagKeyModel == null) {
      throw new Error('Tag key model is not loaded yet');
    }
    return tagKeyModel;
  }
}
