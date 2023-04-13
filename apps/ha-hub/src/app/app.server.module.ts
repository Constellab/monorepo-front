import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';

import {HaAppModule} from './ha-app.module';
import {HaAppComponent} from './ha-app.component';
import {FlexLayoutServerModule} from '@angular/flex-layout/server';


@NgModule({
  imports: [
    HaAppModule,
    ServerModule,
    FlexLayoutServerModule,
  ],
  bootstrap: [HaAppComponent],
})
export class AppServerModule {
}
