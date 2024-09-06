import {CaRouterService} from '../../ca-core/service/ca-router.service';
import {ClUserCategory} from '@monorepo/core-lib';

/**
 * Describe one main menu link button
 */
export interface CaMainMenuLink {
  route: string;
  label: string;
  icon: string;
  authorizedCategories?: ClUserCategory[];
}

// list of the main menu links buttons
export const caMainMenuLinks: CaMainMenuLink[] = [
  {
    label: 'dashboard',
    icon: 'dashboard',
    route: CaRouterService.getDashboardRoute(),
  },
  {
    label: 'my_projects',
    icon: 'project',
    route: CaRouterService.getMyProjectsRoute()
  },
  {
    label: 'my_labs',
    icon: 'lab',
    route: CaRouterService.getMyLabInstancesRoute()
  },
  {
    label: 'chat',
    icon: 'chat',
    route: CaRouterService.getChatRoute()
  },
  {
    label: 'my_teams',
    icon: 'group',
    route: CaRouterService.getMyTeamsRoute()
  },
  {
    label: 'admin_dashboard',
    icon: 'admin_panel_settings',
    route: CaRouterService.getAdminRoute(),
    authorizedCategories: [ClUserCategory.ADMIN]
  }
];
