import { Component, Input, OnInit } from '@angular/core';
import { LabFolderObject } from '../../../../model/entities/lab-folder.class';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Simple component to show information about the validation of a folder object
 */
@Component({
  selector: 'lab-object-validation-info',
  templateUrl: './lab-object-validation-info.component.html',
  styleUrls: ['./lab-object-validation-info.component.scss'],
  imports: [MatIcon, FlIconModule, FlUserModule, TranslatePipe],
})
export class LabObjectValidationInfoComponent implements OnInit {
  @Input() object: LabFolderObject;

  constructor() {}

  ngOnInit(): void {}
}
