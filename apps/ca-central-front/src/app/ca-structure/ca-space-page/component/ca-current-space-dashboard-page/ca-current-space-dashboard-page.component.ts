import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CaSpaceService} from '../../../../ca-core/service-api/ca-space.service';
import {CaSpaceSettingsDto} from '../../../../ca-core/model/entities/space/ca-space-form.class';

@Component({
  selector: 'ca-current-space-dashboard-page',
  templateUrl: './ca-current-space-dashboard-page.component.html',
  styleUrls: ['./ca-current-space-dashboard-page.component.scss']
})
export class CaCurrentSpaceDashboardPageComponent implements OnInit {

  spaceSettings$: Observable<CaSpaceSettingsDto> = this.spaceService.getCurrentSpaceSettings();

  constructor(private spaceService: CaSpaceService) {
  }

  ngOnInit(): void {
  }

}
