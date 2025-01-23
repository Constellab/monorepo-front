import { Component, OnInit, inject } from '@angular/core';
import { FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { CaGroup, CaSaveTeamDTO } from '../../../../model/entities/ca-group.entity';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CaGroupService } from '../../../../service-api/ca-group.service';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export type CaTeamFormDialogInput = FlFormDialogInput<CaSaveTeamDTO>;

@Component({
  selector: 'ca-team-form-dialog',
  templateUrl: './ca-team-form-dialog.component.html',
  styleUrls: ['./ca-team-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
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
