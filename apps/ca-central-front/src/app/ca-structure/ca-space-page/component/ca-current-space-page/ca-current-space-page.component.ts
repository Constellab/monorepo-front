import {Component, OnInit} from '@angular/core';
import {CaRouterService} from '../../../../ca-core/service/ca-router.service';
import {Observable} from 'rxjs';
import {CaSpace} from '../../../../ca-core/model/entities/space/ca-space.class';
import {CaCurrentSpaceService} from '../../../../ca-core/service-api/ca-current-space.service';
import {FlHorizontalNavBarItem} from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-current-space-page',
  templateUrl: './ca-current-space-page.component.html',
  styleUrls: ['./ca-current-space-page.component.scss']
})
export class CaCurrentSpacePageComponent implements OnInit {

  space$: Observable<CaSpace> = this.currentSpaceService.getCurrentSpace$();

  routes: FlHorizontalNavBarItem[] = [
    {
      label: {text: 'admin_dashboard_page', translateText: true},
      icon: 'dashboard',
      route: CaRouterService.getCurrentSpaceRoute(),
      linkActiveExact: true
    },
    {
      label: {text: 'space_users', translateText: true},
      icon: 'people',
      route: CaRouterService.getCurrentSpaceUsersRoute()
    },

  ];

  constructor(private currentSpaceService: CaCurrentSpaceService) {
  }

  ngOnInit(): void {
    // add route for admin
    if (this.currentSpaceService.isSpaceAdmin()) {
      this.routes.push(
        {
          label: {text: 'lab_instances', translateText: true},
          icon: 'lab',
          route: CaRouterService.getCurrentSpaceLabsRoute()
        },
        {
          label: {text: 'projects', translateText: true},
          icon: 'project',
          route: CaRouterService.getCurrentSpaceProjectsRoute()
        },
        {
          label: {text: 'teams', translateText: true},
          icon: 'group',
          route: CaRouterService.getCurrentSpaceTeamsRoute()
        });
    }
  }

}
