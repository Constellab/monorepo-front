import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiFolderObject } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Simple component to show information about the validation of a folder object
 */
@Component({
  selector: 'li-object-validation-info',
  templateUrl: './li-object-validation-info.component.html',
  styleUrls: ['./li-object-validation-info.component.scss'],
  imports: [MatIcon, FlIconModule, FlUserModule, TranslatePipe],
})
export class LiObjectValidationInfoComponent {
  @Input() object: LiFolderObject;
}
