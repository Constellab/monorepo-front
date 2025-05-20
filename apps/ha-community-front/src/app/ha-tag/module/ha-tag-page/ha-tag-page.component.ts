import { Component, inject, OnInit } from '@angular/core';
import { HaTagService } from '../../../ha-core/ha-service/ha-tag.service';
import { HaTagKey } from '../../../ha-core/ha-model/ha-entities/ha-tag-key.class';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { first } from 'rxjs';
import { HaHttpRedirectionService } from '../../../ha-core/ha-service/ha-http-redirection.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { TeCompleteConfig, TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  HaTagKeyEditDialogComponent,
  HaTagKeyEditDialogInput,
} from '../ha-tag-key-edit-dialog/ha-tag-key-edit-dialog.component';
import { FlConfirmDialogInput, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { MatTooltip } from '@angular/material/tooltip';
import {
  HaTagValueEditDialogComponent,
  HaTagValueEditDialogInput,
} from '../ha-tag-value-edit-dialog/ha-tag-value-edit-dialog.component';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import {
  HaAddAdditionalInfoSpecDialogInput,
  HaAddAdditionalInfoSpecDialogInputData,
  HaEditAdditionalInfoSpecDialogComponent,
} from '../ha-edit-additional-info-spec-dialog/ha-edit-additional-info-spec-dialog.component';
import { HaTagAdditionalInfoSpecsTableComponent } from '../ha-tag-additional-info-specs-table/ha-tag-additional-info-specs-table.component';
import {
  HaTagValue,
  HaTagValueDatasourceFilters,
  HaTagValueDatasourcePaginated,
} from '../../../ha-core/ha-model/ha-entities/ha-tag-value.class';
import { HaTagValuesTableComponent } from '../ha-tag-values-table/ha-tag-values-table.component';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { CoCommunityLibModule, CoTagKeyEditAdditionalInfoSpec, CoTagKeyType } from '@monorepo/community-lib';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';

@Component({
  selector: 'ha-tag-page',
  imports: [
    TeTextEditorModule,
    NgClass,
    ReactiveFormsModule,
    TranslatePipe,
    MatButton,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlCorePipeModule,
    HaTagAdditionalInfoSpecsTableComponent,
    HaTagValuesTableComponent,
    FlInfiniteScrollModule,
    FlDateModule,
    FlUserModule,
    RouterLink,
    FlKeyValueModule,
    CoCommunityLibModule,
  ],
  templateUrl: './ha-tag-page.component.html',
  styleUrl: './ha-tag-page.component.scss',
})
export class HaTagPageComponent implements OnInit {
  private tagService = inject(HaTagService);
  private activeRoute = inject(ActivatedRoute);
  private httpRedirectionService = inject(HaHttpRedirectionService);
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private dialogService = inject(FlDialogService);
  private clipboardService = inject(FlClipboardService);

  tagKey: HaTagKey;
  textEditorConfig = new TeCompleteConfig();

  canEditTag = false;
  descriptionFormControl = new FormControl<TeRichText>(new TeRichText());
  currentUser: HaUser;
  oldTagDescription: TeRichText;
  isBooleanType = false;

  profileRoute = HaRouterService.getProfileRoute();

  tagAdditionalInfosSpecsDatasource: CoTagKeyEditAdditionalInfoSpec[];
  tagValues: HaTagValueDatasourcePaginated<HaTagValueDatasourceFilters>;

  ngOnInit(): void {
    this.authenticatedUserService.getUser().subscribe((user) => {
      this.currentUser = user;
      this.checkRouteParams();
    });
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
          this.setTagKey(tagKey);
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
        scientificName: this.tagKey.scientificName,
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

  openAddAdditionalInfoSpecDialog(): void {
    const input: HaAddAdditionalInfoSpecDialogInput = {
      mode: 'create',
      object: {
        tagKeyId: this.tagKey.id,
      } as HaAddAdditionalInfoSpecDialogInputData,
    };

    this.dialogService
      .openSmallDialog(HaEditAdditionalInfoSpecDialogComponent, { data: input })
      .afterClosed()
      .subscribe((tagKey) => {
        if (tagKey) {
          this.setTagKey(tagKey);
        }
      });
  }

  openEditAdditionalInfoSpecDialog(additionalInfoSpec: CoTagKeyEditAdditionalInfoSpec): void {
    const input: HaAddAdditionalInfoSpecDialogInput = {
      mode: 'update',
      object: {
        tagKeyId: this.tagKey.id,
        name: additionalInfoSpec.name,
        optional: additionalInfoSpec.optional,
      } as HaAddAdditionalInfoSpecDialogInputData,
    };

    this.dialogService
      .openSmallDialog(HaEditAdditionalInfoSpecDialogComponent, { data: input })
      .afterClosed()
      .subscribe((tagKey) => {
        if (tagKey) {
          this.setTagKey(tagKey);
        }
      });
  }

  openConfirmDeleteAdditionalInfoSpecDialog(name: string): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_tag_additional_info_spec',
      content: 'delete_tag_additional_info_spec_content',
      successMessage: 'delete_tag_additional_info_spec_success',
      observable: this.tagService.deleteAdditionalInfoSpec(this.tagKey.id, name),
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res) => {
        if (res.choice && res.result) {
          this.setTagKey(res.result);
        }
      });
  }

  openCreateTagValueDialog(): void {
    const input: HaTagValueEditDialogInput = {
      mode: 'create',
      object: {
        tagKey: this.tagKey,
      },
    };

    this.dialogService
      .openSmallDialog(HaTagValueEditDialogComponent, { data: input })
      .afterClosed()
      .subscribe((tagValue) => {
        if (tagValue) this.updateTagValues();
      });
  }

  openEditTagValueDialog(tagValue: HaTagValue): void {
    const input: HaTagValueEditDialogInput = {
      mode: 'update',
      object: {
        tagKey: this.tagKey,
        id: tagValue.id,
        value: tagValue.value,
        additionalInfos: tagValue.additionalInfos,
        shortDescription: tagValue.shortDescription,
      },
    };

    this.dialogService
      .openSmallDialog(HaTagValueEditDialogComponent, { data: input })
      .afterClosed()
      .subscribe((tagValue) => {
        if (tagValue) this.updateTagValues();
      });
  }

  openConfirmDeleteTagValueDialog(tagValue: HaTagValue): void {
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
      successMessage: !this.tagKey.publishedAt ? 'delete_tag_success' : 'deprecate_tag_content',
      observable: this.tagService.deleteTagKey(this.tagKey.id),
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res) => {
        if (res.choice && res.result) {
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

  private checkRouteParams(): void {
    this.activeRoute.params.pipe(first()).subscribe((params) => {
      if (!params.id) {
        return;
      }
      this.getTagKey(params.id, params.technicalName);
    });
  }

  private getTagKey(id: string, technicalName: string): void {
    this.tagService.getTagKeyById(id).subscribe((tagKey) => {
      if (!technicalName) {
        this.httpRedirectionService.redirectTo(
          HaRouterService.getTagPageRoute(tagKey.id, tagKey.technicalName)
        );
      }
      this.setTagKey(tagKey);
    });
  }

  private setTagKey(tagKey: HaTagKey): void {
    this.tagKey = tagKey;
    this.isBooleanType = tagKey.type === CoTagKeyType.BOOLEAN;

    this.descriptionFormControl.setValue(tagKey.description);
    this.descriptionFormControl.disable();

    this.tagAdditionalInfosSpecsDatasource = [];
    if (tagKey.additionalInfosSpecs) {
      for (const key in tagKey.additionalInfosSpecs) {
        this.tagAdditionalInfosSpecsDatasource.push({
          name: key,
          optional: tagKey.additionalInfosSpecs[key].optional,
        });
      }
    }

    this.tagValues = this.tagService.getAllValueWithFiltersPaginated();
    this.updateTagValues();

    if (this.currentUser) {
      if (
        this.tagKey.createdBy.id == this.currentUser.id ||
        this.tagKey.tagCoAuthors?.some((coAuthor) => coAuthor.id == this.currentUser.id)
      ) {
        this.canEditTag = true;
      }
    }
  }

  private updateTagValues(): void {
    this.tagValues.getFirstPage({
      tagKeyIdFilter: this.tagKey.id,
    });
  }
}
