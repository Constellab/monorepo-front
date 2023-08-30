import {Component, Inject} from '@angular/core';
import {LabTypeEntity} from '../../../../model/entities/lab-type/lab-type.entity';
import {LabRouterService} from '../../../../service/lab-router.service';
import {LabTypeService} from '../../../../entity-service/lab-type.service';
import {Observable, share} from 'rxjs';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TdTypingName} from '@monorepo/technical-doc';
import {LabCommunityTechnicalDocType, LabEnvironmentHelper} from '../../../../utils/lab-environment.helper';
import {map} from 'rxjs/operators';
import {ClVersion} from '@monorepo/core-lib';

export interface LabTypeDialogInput {
  typingName: string;
}

@Component({
  selector: 'lab-type-dialog',
  templateUrl: './lab-type-dialog.component.html',
  styleUrls: ['./lab-type-dialog.component.scss']
})
export class LabTypeDialogComponent {

  type$: Observable<LabTypeEntity> = this.typeService.getTyping(this.input.typingName).pipe(share());
  technicalDocUrl$: Observable<string> = this.type$.pipe(
    map(type => this.getCommunityUrl(type))
  );

  detailRoute: string;

  constructor(@Inject(MAT_DIALOG_DATA) private input: LabTypeDialogInput,
              private typeService: LabTypeService) {
    this.detailRoute = LabRouterService.getTechnicalDocRoute(input.typingName);
  }


  getCommunityUrl(type: LabTypeEntity): string {
    const typingName = new TdTypingName(type.typingName);
    let docType: LabCommunityTechnicalDocType;
    switch (type.objectType) {
      case 'TASK':
        docType = 'task';
        break;
      case 'RESOURCE':
        docType = 'resource';
        break;
      case 'PROTOCOL':
        docType = 'protocol';
        break;
    }
    const version = ClVersion.fromString(type.brickVersion);
    return LabEnvironmentHelper.getCommunityTechnicalDocUrl(typingName.brickName,
      version.major, docType, typingName.uniqueName);
  }


}
