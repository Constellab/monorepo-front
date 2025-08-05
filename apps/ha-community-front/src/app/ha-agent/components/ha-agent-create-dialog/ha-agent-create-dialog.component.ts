import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CoCreateAgentFormData } from '@monorepo/community-lib';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { HaCreateAgentDto } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import {
  HaAgentVersion,
  HaAgentVersionFileInput,
} from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';

export type HaCreateAgentInput = FlFormDialogInput<HaCreateAgentDto>;

@Component({
  selector: 'ha-agent-create-dialog',
  templateUrl: './ha-agent-create-dialog.component.html',
  styleUrls: ['./ha-agent-create-dialog.component.scss'],
  imports: [FlDialogModule, CoCommunityLibModule, FlInputFileModule, TranslatePipe],
})
export class HaAgentCreateDialogComponent
  extends FlFormDialogAbstractDirective<HaCreateAgentDto, HaAgentVersion>
  implements OnInit
{
  private agentService = inject(HaAgentService);
  private spaceService = inject(HaSpaceService);

  spaces$: Observable<HaSpace[]>;
  inputFile: any;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.spaces$ = this.spaceService.getSpacesOfCurrentUser();

    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      title: [null, Validators.required],
      type: [null, Validators.required],
      versionFile: [null, Validators.required],
      space: [null],
    });
  }

  create(formValue: HaCreateAgentDto): Observable<HaAgentVersion> {
    return this.agentService.create(formValue);
  }

  update(): Observable<HaAgentVersion> {
    throw new Error('Method not implemented.');
  }

  getCreateSuccessMessage(): string {
    return 'create_agent_success';
  }

  getUpdateSuccessMessage(): string {
    throw new Error('Method not implemented.');
  }

  onFileSelected(event: any): void {
    this.inputFile = null;
    this.formGp.controls.versionFile.patchValue(null);
    if (event == null) {
      return;
    }
    if (!event.name.endsWith('.json')) {
      this.snackBarService.openErrorMessage({ text: 'file_wrong_type', translateText: true });
      return;
    }

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const srcResult: HaAgentVersionFileInput = JSON.parse(e.target.result);
        if (!HaAgentVersionFileInput.isValid(srcResult)) {
          this.snackBarService.openErrorMessage({ text: 'file_wrong_format', translateText: true });
          return;
        }
        this.formGp.controls.versionFile.patchValue(srcResult);
      };

      reader.readAsText(event);
    }
  }

  onSubmitEvent(formValue: CoCreateAgentFormData): void {
    this.formGp.patchValue(formValue as HaCreateAgentDto);
    this.submit();
  }
}
