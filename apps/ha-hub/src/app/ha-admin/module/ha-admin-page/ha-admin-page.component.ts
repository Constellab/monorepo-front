import { Component, inject } from '@angular/core';
import { HaBrickVersionService } from '../../../ha-core/ha-service/ha-brick-version.service';
import { HaIsAdminDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-is-admin/ha-is-admin.directive';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';

@Component({
  selector: 'ha-ha-admin-page',
  templateUrl: './ha-admin-page.component.html',
  styleUrls: ['./ha-admin-page.component.scss'],
  imports: [HaIsAdminDirective, MatButton, FlLoaderModule],
})
export class HaAdminPageComponent {
  private brickVersionService = inject(HaBrickVersionService);

  isLoading: boolean = false;

  sendAllToQueue(): void {
    this.isLoading = true;
    this.brickVersionService.sendAllBrickVersion().subscribe(() => {
      this.isLoading = false;
    });
  }
}
