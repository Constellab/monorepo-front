import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';

import { HaCommentsSectionComponent } from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-section/ha-comments-section.component';
import { HaEntityPageInfoComponent } from '../../../ha-core/ha-component/ha-entity-page-infos/ha-entity-page-info.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaPartnerService } from '../../../ha-core/ha-service/ha-partner.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaEntityCommentState } from '../../../ha-core/ha-state/ha-entity-comment.state';
import { HaPartnerTextEditorConfig } from '../../../ha-profile/component/ha-profile/ha-partner-text-editor.config';
import { HaPartnerState } from '../../state/ha-partner.state';
import {
  HaEditPartnerDialogInput,
  HaPartnerEditDialogComponent,
} from '../ha-partner-create-dialog/ha-partner-edit-dialog.component';

@Component({
  selector: 'ha-partner-page',
  templateUrl: './ha-partner-page.component.html',
  styleUrls: ['./ha-partner-page.component.scss'],
  imports: [
    HaPageComponent,
    TeTextEditorModule,
    ReactiveFormsModule,
    FlLoaderModule,
    MatButton,
    TranslatePipe,
    HaEntityPageInfoComponent,
    HaCommentsSectionComponent,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [HaPartnerState, HaEntityCommentState],
})
export class HaPartnerPageComponent extends HaCommunityPageDirective implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private partnerState = inject(HaPartnerState);
  private partnerService = inject(HaPartnerService);
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private entityCommentState: HaEntityCommentState = inject(HaEntityCommentState);
  private dialogService: FlDialogService = inject(FlDialogService);

  partnerName: string;
  formControl: FormControl<TeRichText> = new FormControl();
  entityType: HaEntityType = HaEntityType.PARTNER;

  partner = computed(() => {
    const partner = this.partnerState.partner();
    if (partner && partner.info) {
      this.formControl.setValue(partner.info);
      this.formControl.disable();
      this.partnerName = partner.name;

      const partnerImage = partner.logo ? this.partnerService.getImageUrl(partner.id, partner.logo) : null;

      super.setMetaTags(
        { text: 'ha.partner.title', translateParam: { param: { name: partner.name } } },
        { text: 'ha.partner.description', translateParam: { param: { name: partner.name } } },
        partnerImage ?? '',
        HaRouterService.getFullRoute(
          HaRouterService.getPartnerPage(partner.id, ClStringHelper.getCleanUrlPath(partner.name) ?? '')
        )
      );
    }
    return partner;
  });
  isLoading = this.partnerState.isLoading.asReadonly();
  notFound = this.partnerState.notFound.asReadonly();
  currentUser = toSignal(this.authenticatedUserService.getUser());
  onPartnerInfoLoading = this.partnerState.onPartnerInfoLoading.asReadonly();
  textEditorConfig = computed(() => {
    const partner = this.partner();
    return partner
      ? new HaPartnerTextEditorConfig(this.partnerService, partner.id)
      : new HaPartnerTextEditorConfig(this.partnerService, '', false);
  });
  canEdit = computed(() => {
    const user = this.currentUser();
    const partner = this.partner();

    if (!user || !partner) {
      return false;
    }

    return partner.user.id === user.id;
  });

  imageUrl = computed(() => {
    const partner = this.partner();
    if (partner && partner.logo) {
      return this.partnerService.getImageUrl(partner.id, partner.logo);
    }
    return null;
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const partnerId = params['partnerId'];
      this.partnerName = params['partnerName'];
      this.partnerState.init(partnerId);
      this.entityCommentState.init(this.entityType, partnerId);
    });
  }

  editPartnerInfo(): void {
    this.formControl.enable();
  }

  savePartnerInfo(): void {
    if (!this.partner()?.info?.contentAreEquals(this.formControl.value)) {
      this.partnerState.editPartnerInfo(this.formControl.value);
    }

    this.formControl.disable();
  }

  openEditPartnerDialog(): void {
    const dialogInput: HaEditPartnerDialogInput = {
      mode: 'update',
      object: this.partner() ?? undefined,
    };

    this.dialogService
      .openMediumDialog(HaPartnerEditDialogComponent, { data: dialogInput })
      .afterClosed()
      .subscribe((partner) => {
        if (partner) {
          this.partnerState.init(partner.id);
        }
      });
  }
}
