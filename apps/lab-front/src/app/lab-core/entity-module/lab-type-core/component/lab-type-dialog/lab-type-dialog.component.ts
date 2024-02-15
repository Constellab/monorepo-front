import {Component, Inject} from '@angular/core';
import {LabTypeEntity} from '../../../../model/entities/lab-type/lab-type.entity';
import {LabRouterService} from '../../../../service/lab-router.service';
import {LabTypeService} from '../../../../entity-service/lab-type.service';
import {Observable, share} from 'rxjs';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TdTypingName} from '@monorepo/technical-doc';
import {map} from 'rxjs/operators';
import {LabCommunityHelper} from '../../../../utils/lab-community.helper';

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
    return LabCommunityHelper.getTechnicalDocUrl(typingName, type.brickVersion);
  }


}
