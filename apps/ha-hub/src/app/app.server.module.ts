import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';

import {HaAppModule} from './ha-app.module';
import {HaAppComponent} from './ha-app.component';


@NgModule({
  imports: [
    HaAppModule,
    ServerModule,
  ],
  bootstrap: [HaAppComponent],
})
export class AppServerModule {
}
