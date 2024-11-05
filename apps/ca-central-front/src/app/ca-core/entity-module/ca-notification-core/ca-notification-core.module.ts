import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaNotificationMarkDirective } from './directive/ca-notification-mark/ca-notification-mark.directive';

@NgModule({
  declarations: [CaNotificationMarkDirective],
  exports: [CaNotificationMarkDirective],
  imports: [CommonModule],
})
export class CaNotificationCoreModule {}
