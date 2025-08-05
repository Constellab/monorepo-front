import { Component, input } from '@angular/core';

import { LmlAdminerDbInfo } from '../../model/lml-lab-manager.class';

@Component({
  selector: 'lml-adminer-db-info',
  templateUrl: './lml-adminer-db-info.component.html',
  styleUrl: './lml-adminer-db-info.component.scss',
  standalone: false,
})
export class LmlAdminerDbInfoComponent {
  adminerDbInfo = input.required<LmlAdminerDbInfo>();
}
