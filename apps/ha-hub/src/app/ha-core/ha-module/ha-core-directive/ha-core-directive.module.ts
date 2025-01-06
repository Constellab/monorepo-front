import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HaIsAdminDirective } from './ha-is-admin/ha-is-admin.directive';
import { HaIsAuthenticatedDirective } from './ha-is-authenticated/ha-is-authenticated.directive';
import { HaSidenavButtonDirective } from './ha-sidenav-button/ha-sidenav-button.directive';
import { HaIsGencoveryMemberDirective } from './ha-is-gencovery-member/ha-is-gencovery-member.directive';
import { HaLeftPanelDirective } from './ha-left-panel/ha-left-panel.directive';
import { HaHideServerSideDirective } from './ha-hide-server-side/ha-hide-server-side.directive';

@NgModule({
  declarations: [
    HaIsAdminDirective,
    HaIsAuthenticatedDirective,
    HaSidenavButtonDirective,
    HaIsGencoveryMemberDirective,
    HaLeftPanelDirective,
    HaHideServerSideDirective,
  ],
  exports: [
    HaIsAdminDirective,
    HaIsAuthenticatedDirective,
    HaSidenavButtonDirective,
    HaIsGencoveryMemberDirective,
    HaLeftPanelDirective,
    HaHideServerSideDirective,
  ],
  imports: [CommonModule],
})
export class HaCoreDirectiveModule {}
