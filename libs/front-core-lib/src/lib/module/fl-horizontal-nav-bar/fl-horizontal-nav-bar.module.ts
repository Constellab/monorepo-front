import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlHorizontalNavBarComponent} from './component/fl-horizontal-nav-bar/fl-horizontal-nav-bar.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FlTranslateModule} from '../fl-translate/fl-translate.module';
import {RouterModule} from '@angular/router';
import {FlIconModule} from '../fl-svg-icon/fl-icon.module';
import {MatMenuModule} from '@angular/material/menu';
import {LayoutModule} from '@angular/cdk/layout';
import {
  FlHorizontalNavBarTitleComponent
} from './component/fl-horizontal-nav-bar-title/fl-horizontal-nav-bar-title.component';
import {
  FlHorizontalNavBarActionsComponent
} from './component/fl-horizontal-nav-bar-actions/fl-horizontal-nav-bar-actions.component';
import {FlTextIconModule} from '../fl-text-icon/fl-text-icon.module';

@NgModule({
  declarations: [
    FlHorizontalNavBarComponent,
    FlHorizontalNavBarTitleComponent,
    FlHorizontalNavBarActionsComponent
  ],
  exports: [
    FlHorizontalNavBarComponent,
    FlHorizontalNavBarTitleComponent,
    FlHorizontalNavBarActionsComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatMenuModule,
    LayoutModule,

    FlTranslateModule,
    FlIconModule,
    FlTextIconModule,

  ],
})
export class FlHorizontalNavBarModule {
}
