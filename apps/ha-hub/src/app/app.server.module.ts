import {NgModule} from '@angular/core';
import {provideServerRendering, ServerModule} from '@angular/platform-server';

import {HaAppModule} from './ha-app.module';
import {HaAppComponent} from './ha-app.component';


@NgModule({
  imports: [
    HaAppModule,
    ServerModule,
  ],
  providers: [
    provideServerRendering()
  ],
  bootstrap: [HaAppComponent],
})
export class AppServerModule {
}
