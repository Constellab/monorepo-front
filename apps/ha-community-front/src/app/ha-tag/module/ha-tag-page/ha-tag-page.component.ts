import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import {
  CoCommunityLibModule,
  CoTagAdditionalInfoSpecState,
  CoTagKeyType,
  CoTagValue,
  CoTagValueEditDialogComponent,
  CoTagValueEditDialogInput, CoTagValuesTableComponent,
} from '@monorepo/community-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlConfirmDialogInput, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TdAbstractDynamicParamSpecState, TdParamSpecs, TdTechnicalDocModule } from '@monorepo/technical-doc';
import { TeCompleteConfig, TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { first } from 'rxjs';

import {
  HaEntityPageInfosComponent
} from '../../../ha-core/ha-component/ha-entity-page-infos/ha-entity-page-infos.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaTagKey } from '../../../ha-core/ha-model/ha-entities/ha-tag-key.class';
import {
  HaTagValueDatasourceFilters,
  HaTagValueDatasourcePaginated,
} from '../../../ha-core/ha-model/ha-entities/ha-tag-value.class';
import {
  HaCommunityPageDirective
} from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaHttpRedirectionService } from '../../../ha-core/ha-service/ha-http-redirection.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaTagService } from '../../../ha-core/ha-service/ha-tag.service';
import { HaEntityCommentState } from '../../../ha-core/ha-state/ha-entity-comment.state';
import {
  HaTagKeyEditDialogComponent,
  HaTagKeyEditDialogInput,
} from '../ha-tag-key-edit-dialog/ha-tag-key-edit-dialog.component';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'ha-tag-page',
  imports: [
    TeTextEditorModule,
    ReactiveFormsModule,
    FlCorePipeModule,
    FlInfiniteScrollModule,
    FlDateModule,
    FlUserModule,
    FlKeyValueModule,
    CoCommunityLibModule,
    TdTechnicalDocModule,
    FlIconModule,
    HaPageComponent,
    HaEntityPageInfosComponent,
    TranslatePipe,
    MatButton,
    MatIconButton,
    MatIcon,
    FlLoaderModule,
    MatTooltip,
    CoTagValuesTableComponent,
  ],
  templateUrl: './ha-tag-page.component.html',
  styleUrl: './ha-tag-page.component.scss',
  providers: [
    { provide: TdAbstractDynamicParamSpecState, useClass: CoTagAdditionalInfoSpecState },
    HaEntityCommentState,
  ],
})
export class HaTagPageComponent extends HaCommunityPageDirective implements OnInit {
  private tagService = inject(HaTagService);
  private activeRoute = inject(ActivatedRoute);
  private httpRedirectionService = inject(HaHttpRedirectionService);
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private dialogService = inject(FlDialogService);
  private clipboardService = inject(FlClipboardService);
  private tagAdditionalInfoSpecState = inject(
    TdAbstractDynamicParamSpecState
  ) as CoTagAdditionalInfoSpecState;

  tagKey: HaTagKey;
  textEditorConfig = new TeCompleteConfig();

  canEditTag = false;
  descriptionFormControl = new FormControl<TeRichText>(new TeRichText());
  oldTagDescription: TeRichText;
  isBooleanType = false;
  profileRoute = HaRouterService.getProfileRoute();
  tagValues: HaTagValueDatasourcePaginated<HaTagValueDatasourceFilters>;
  entityType: HaEntityType = HaEntityType.TAG;
  isLoading: boolean;
  notFound: boolean;
  tempTitle: string;
  onDescriptionEditionLoading: boolean;
  user = toSignal(this.authenticatedUserService.getUser());

  ngOnInit(): void {
    this.checkRouteParams();
  }

  onDescriptionEditorButtonClick(): void {
    if (this.descriptionFormControl.disabled) {
      this.descriptionFormControl.enable();
      this.oldTagDescription = this.descriptionFormControl.value;
      return;
    }

    if (this.descriptionFormControl.value === this.oldTagDescription) {
      this.descriptionFormControl.disable();
      return;
    }

    this.tagService
      .saveTagKeyDescription(this.tagKey.id, this.descriptionFormControl.value)
      .subscribe((tagKey: HaTagKey) => {
        if (tagKey != null) {
          this.setTagKey(tagKey, false);
        }
        this.descriptionFormControl.disable();
      });
  }

  publishTagKey(): void {
    const input: FlConfirmDialogInput = {
      title: 'publish_tag',
      content: 'publish_tag_content',
      successMessage: 'publish_tag_success',
      observable: this.tagService.publishTagKey(this.tagKey.id),
    };
    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res) => {
        if (res.choice && res.result) {
          this.tagKey = res.result;
        }
      });
  }

  openEditTagKeyDialog(): void {
    const input: HaTagKeyEditDialogInput = {
      mode: 'update',
      object: {
        id: this.tagKey.id,
        label: this.tagKey.label,
        technicalName: this.tagKey.technicalName,
        space: this.tagKey.space?.id,
        unit: this.tagKey.unit,
        type: this.tagKey.type,
      },
    };

    this.dialogService
      .openMediumDialog(HaTagKeyEditDialogComponent, { data: input })
      .afterClosed()
      .subscribe((tag: HaTagKey) => {
        if (tag) {
          this.tagKey = tag;
          this.descriptionFormControl.setValue(tag.description);
          this.descriptionFormControl.disable();
        }
      });
  }

  editAbout(): void {
    this.descriptionFormControl.enable();
  }

  saveAbout(): void {
    this.onDescriptionEditionLoading = true;
    this.tagService
      .saveTagKeyDescription(this.tagKey.id, this.descriptionFormControl.value)
      .subscribe((tagKey: HaTagKey) => {
        if (tagKey != null) {
          this.setTagKey(tagKey, false);
        }
        this.onDescriptionEditionLoading = false;
        this.descriptionFormControl.disable();
      });
  }

  openEditAdditionalInfoSpecDialog(): void {
    this.tagAdditionalInfoSpecState.openEditConfigDialog();
  }

  openCreateTagValueDialog(): void {
    const input: CoTagValueEditDialogInput = {
      mode: 'create',
      object: {
        tagKey: this.tagKey,
      },
    };

    this.dialogService
      .openSmallDialog(CoTagValueEditDialogComponent, { data: input })
      .afterClosed()
      .subscribe((tagValue) => {
        if (tagValue) this.updateTagValues();
      });
  }

  openEditTagValueDialog(tagValue: CoTagValue): void {
    const input: CoTagValueEditDialogInput = {
      mode: 'update',
      object: {
        tagKey: this.tagKey,
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
        if (tagValue) this.updateTagValues();
      });
  }

  openConfirmDeleteTagValueDialog(tagValue: CoTagValue): void {
    const input: FlConfirmDialogInput = {
      title: !this.tagKey.publishedAt ? 'delete_tag_value' : 'deprecate_tag_value',
      content: !this.tagKey.publishedAt ? 'delete_tag_value_content' : 'deprecate_tag_value_content',
      successMessage: !this.tagKey.publishedAt ? 'delete_tag_value_success' : 'deprecate_tag_value_content',
      observable: this.tagService.deleteValue(this.tagKey.id, tagValue.id),
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res) => {
        if (res.choice && res.result) {
          this.updateTagValues();
        }
      });
  }

  onDeleteTag(): void {
    const input: FlConfirmDialogInput = {
      title: !this.tagKey.publishedAt ? 'delete_tag' : 'deprecate_tag',
      content: !this.tagKey.publishedAt ? 'delete_tag_content' : 'deprecate_tag_content',
      successMessage: !this.tagKey.publishedAt ? 'delete_tag_success' : 'deprecate_tag_success',
      observable: this.tagService.deleteTagKey(this.tagKey.id),
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res) => {
        if (res.choice && res.result && !res.result.deprecated) {
          this.httpRedirectionService.redirectTo(HaRouterService.getTagsListRoute());
        }
      });
  }

  onCopyTechnicalName(): void {
    this.clipboardService.copy(this.tagKey.technicalName, {
      text: `technical_name_copied_to_clipboard`,
      translateText: true,
    });
  }

  scrollToComments(commentsSection: any): void {
    commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  private checkRouteParams(): void {
    this.activeRoute.params.pipe(first()).subscribe((params) => {
      if (!params.id) {
        return;
      }
      this.tempTitle = params.technicalName;
      this.getTagKey(params.id, params.technicalName);
    });

    this.tagAdditionalInfoSpecState.onAdditionalInfoSpecsChanged$.subscribe(
      (additionalInfoSpecs: TdParamSpecs) => {
        if (additionalInfoSpecs && additionalInfoSpecs !== this.tagKey.additionalInfosSpecs) {
          this.tagKey.additionalInfosSpecs = additionalInfoSpecs;
        }
      }
    );
  }

  private getTagKey(id: string, technicalName: string): void {
    this.isLoading = true;
    this.tagService.getTagKeyById(id).subscribe({
      next: (tagKey: HaTagKey) => {
        this.isLoading = false;
        if (!technicalName) {
          this.httpRedirectionService.redirectTo(
            HaRouterService.getTagPageRoute(tagKey.id, tagKey.technicalName)
          );
        }
        this.notFound = false;
        this.setTagKey(tagKey);
      },
      error: () => {
        this.isLoading = false;
        this.notFound = true;
      },
    });
  }

  private setTagKey(tagKey: HaTagKey, updateValue: boolean = true): void {
    this.tagKey = tagKey;
    this.isBooleanType = tagKey.type === CoTagKeyType.BOOLEAN;

    this.descriptionFormControl.setValue(tagKey.description);
    this.descriptionFormControl.disable();

    this.tagAdditionalInfoSpecState.init(tagKey);

    if (updateValue) {
      this.tagValues = this.tagService.getAllValueWithFiltersPaginated();
      this.updateTagValues();
    }

    if (this.user()) {
      if (
        this.tagKey.createdBy.id == this.user().id ||
        this.tagKey.tagCoAuthors?.some((coAuthor) => coAuthor.id == this.user().id)
      ) {
        this.canEditTag = true;
      }
    }

    super.setMetaTags(
      {
        text: 'ha.tag.title',
        translateParam: { param: { label: this.tagKey.label } },
      },
      {
        text: 'ha.tag.description',
        translateParam: { param: { label: this.tagKey.label } },
      },
      null,
      HaRouterService.getTagPageRoute(this.tagKey.id, this.tagKey.technicalName)
    );
  }

  private updateTagValues(): void {
    this.tagValues.getFirstPage({
      tagKeyIdFilter: this.tagKey.id,
    });
  }
}
