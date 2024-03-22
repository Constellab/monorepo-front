import {NgModule} from '@angular/core';
import {HaVisibilityBadgeComponent} from './component/ha-visibility-badge/ha-visibility-badge.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HaCoreModule} from '../../ha-core.module';
import {HaCommunityListItemComponent} from './component/ha-community-list-item/ha-community-list-item.component';
import {
  HaCommunityListItemMainContentComponent
} from './component/ha-community-list-item-main-content/ha-community-list-item-main-content.component';

@NgModule({
  declarations: [
    HaVisibilityBadgeComponent,
    HaCommunityListItemComponent,
    HaCommunityListItemMainContentComponent
  ],
  exports: [
    HaVisibilityBadgeComponent,
    HaCommunityListItemComponent,
    HaCommunityListItemMainContentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HaCoreModule
  ]
})
export class HaUtilComponentCoreModule {
}
