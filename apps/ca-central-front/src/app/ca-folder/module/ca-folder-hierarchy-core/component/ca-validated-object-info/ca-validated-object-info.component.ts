import { Component, Input, OnInit } from '@angular/core';
import { CaFolderObject } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Simple component to show information about the validation of a folder object
 */
@Component({
  selector: 'ca-validated-object-info',
  templateUrl: './ca-validated-object-info.component.html',
  styleUrls: ['./ca-validated-object-info.component.scss'],
  imports: [MatIcon, FlIconModule, FlUserModule, TranslatePipe],
})
export class CaValidatedObjectInfoComponent implements OnInit {
  @Input() object: CaFolderObject;

  constructor() {}

  ngOnInit(): void {}
}
