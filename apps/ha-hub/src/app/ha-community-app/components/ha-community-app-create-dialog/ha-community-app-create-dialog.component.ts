import { Component, inject, OnInit } from '@angular/core';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import {
  HaCommunityApp,
  HaCommunityAppEdit,
} from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { HaCommunityAppService } from '../../../ha-core/ha-service/ha-community-app.service';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';
import { Observable } from 'rxjs';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';

export type HaCreateCommunityAppInput = FlFormDialogInput<HaCommunityAppEdit>;

@Component({
  selector: 'ha-community-app-create-dialog',
  imports: [
    FlDialogModule,
    TranslatePipe,
    FormsModule,
    ReactiveFormsModule,
    FlCorePipeModule,
    MatInput,
    FlCoreDirectiveModule,
    MatFormFieldModule,
    MatButton,
    FlLoaderModule,
  ],
  templateUrl: './ha-community-app-create-dialog.component.html',
  styleUrl: './ha-community-app-create-dialog.component.scss',
})
export class HaCommunityAppCreateDialogComponent
  extends FlFormDialogAbstractDirective<HaCommunityAppEdit, HaCommunityApp>
  implements OnInit
{
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);
  private spaceService = inject(HaSpaceService);

  spaces$: Observable<HaSpace[]>;

  ngOnInit(): void {
    this.spaces$ = this.spaceService.getSpacesOfCurrentUser();

    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      title: [null, Validators.required],
      appUrl: [null, [Validators.required, Validators.pattern('https?://.+')]],
      shortDescription: [null],
      spaceId: [null],
      id: [null],
    });
  }

  create(formValue: HaCommunityAppEdit): Observable<HaCommunityApp> {
    return this.communityAppService.create(formValue);
  }

  getCreateSuccessMessage(): string {
    return 'create_community_app_success';
  }

  getUpdateSuccessMessage(): string {
    return 'edit_community_app_success';
  }

  update(formValue: HaCommunityAppEdit): Observable<HaCommunityApp> {
    return this.communityAppService.update(formValue);
  }
}
