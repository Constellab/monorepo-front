import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HaIsAdminDirective} from './ha-is-admin/ha-is-admin.directive';
import {HaIsAuthenticatedDirective} from './ha-is-authenticated/ha-is-authenticated.directive';
import {HaSidenavButtonDirective} from './ha-sidenav-button/ha-sidenav-button.directive';
import {HaIsGencoveryMember} from './ha-is-gencovery-member/ha-is-gencovery-member.directive';

@NgModule({
  declarations: [
    HaIsAdminDirective,
    HaIsAuthenticatedDirective,
    HaSidenavButtonDirective,
    HaIsGencoveryMember
  ],
  exports: [
    HaIsAdminDirective,
    HaIsAuthenticatedDirective,
    HaSidenavButtonDirective,
    HaIsGencoveryMember
  ],
  imports: [CommonModule],
})
export class HaCoreDirectiveModule {
}
