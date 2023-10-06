import {Component, Input} from '@angular/core';
import {CaLabFreeTrialGetDto} from '../../../../model/entities/lab/ca-lab-free-trial.class';

@Component({
  selector: 'ca-lab-free-trial-info',
  templateUrl: './ca-lab-free-trial-info.component.html',
  styleUrls: ['./ca-lab-free-trial-info.component.scss'],
})
export class CaLabFreeTrialInfoComponent {

  @Input() freeTrialDto: CaLabFreeTrialGetDto;

  @Input() showCreateButton: boolean = true;

}
