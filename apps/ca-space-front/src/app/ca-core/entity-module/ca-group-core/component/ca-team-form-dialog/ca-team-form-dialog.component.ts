import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaGroup, CaSaveTeamDTO } from '../../../../model/entities/ca-group.entity';
import { CaGroupService } from '../../../../service-api/ca-group.service';

export type CaTeamFormDialogInput = FlFormDialogInput<CaSaveTeamDTO>;

@Component({
  selector: 'ca-team-form-dialog',
  templateUrl: './ca-team-form-dialog.component.html',
  styleUrls: ['./ca-team-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaTeamFormDialogComponent
  extends FlFormDialogAbstractDirective<CaSaveTeamDTO, CaGroup>
  implements OnInit
{
  private groupService = inject(CaGroupService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  get title(): string {
    return this.isCreateMode() ? 'create_team' : 'update_team';
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      label: [null, [Validators.required]],
    });
  }

  create(formValue: CaSaveTeamDTO): Observable<CaGroup> {
    return this.groupService.createTeam(formValue.label);
  }

  update(formValue: CaSaveTeamDTO): Observable<CaGroup> {
    return this.groupService.updateTeamLabel(formValue.id, formValue.label);
  }

  getCreateSuccessMessage(): string {
    return 'team_created';
  }

  getUpdateSuccessMessage(): string {
    return 'team_updated';
  }
}
