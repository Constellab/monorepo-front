import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CaSpaceSettingsDto} from '../../../../ca-core/model/entities/space/ca-space.class';
import {CaSpaceService} from '../../../../ca-core/service-api/ca-space.service';

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
