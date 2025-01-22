import { Component, OnInit, inject } from '@angular/core';
import { FlFormDialogAbstractDirective, FlFormDialogInput } from '@monorepo/front-core-lib';
import { CaGroup, CaSaveTeamDTO } from '../../../../model/entities/ca-group.entity';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CaGroupService } from '../../../../service-api/ca-group.service';

export type CaTeamFormDialogInput = FlFormDialogInput<CaSaveTeamDTO>;

@Component({
  selector: 'ca-team-form-dialog',
  templateUrl: './ca-team-form-dialog.component.html',
  styleUrls: ['./ca-team-form-dialog.component.scss'],
  standalone: false,
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
