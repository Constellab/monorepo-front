import {Component} from '@angular/core';
import {HaBrickVersionService} from '../../../ha-core/ha-service/ha-brick-version.service';

@Component({
  selector: 'ha-ha-admin-page',
  templateUrl: './ha-admin-page.component.html',
  styleUrls: ['./ha-admin-page.component.scss']
})
export class HaAdminPageComponent {

  isLoading: boolean = false;

  constructor(private brickVersionService: HaBrickVersionService) {
  }

  sendAllToQueue(): void {
    this.isLoading = true;
    this.brickVersionService.sendAllBrickVersion().subscribe(() => {
      this.isLoading = false;
    });
  }
}
