import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HaIsAdminDirective} from './ha-is-admin/ha-is-admin.directive';
import {HaIsAuthenticatedDirective} from './ha-is-authenticated/ha-is-authenticated.directive';
import {HaSidenavButtonDirective} from './ha-sidenav-button/ha-sidenav-button.directive';
import {HaIsGencoveryMember} from './ha-is-gencovery-member/ha-is-gencovery-member.directive';
import {HaLeftPanelDirective} from './ha-left-panel/ha-left-panel.directive';

@NgModule({
  declarations: [
    HaIsAdminDirective,
    HaIsAuthenticatedDirective,
    HaSidenavButtonDirective,
    HaIsGencoveryMember,
    HaLeftPanelDirective
  ],
  exports: [
    HaIsAdminDirective,
    HaIsAuthenticatedDirective,
    HaSidenavButtonDirective,
    HaIsGencoveryMember,
    HaLeftPanelDirective
  ],
  imports: [CommonModule],
})
export class HaCoreDirectiveModule {
}
