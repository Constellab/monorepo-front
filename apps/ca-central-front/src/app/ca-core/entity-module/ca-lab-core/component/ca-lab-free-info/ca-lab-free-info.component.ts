import { Component, Input } from '@angular/core';
import { CaLabFreeGetDto } from '../../../../model/entities/lab/ca-lab-free.class';

@Component({
  selector: 'ca-lab-free-info',
  templateUrl: './ca-lab-free-info.component.html',
  styleUrls: ['./ca-lab-free-info.component.scss'],
})
export class CaLabFreeInfoComponent {
  @Input() freeLab: CaLabFreeGetDto;

  @Input() showCreateButton: boolean = true;
}
