import { ClUserCategory } from '@monorepo/core-lib';

import { CaRouterService } from '../../ca-core/service/ca-router.service';

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
    label: 'home',
    icon: 'home',
    route: CaRouterService.getHomeRoute(),
  },
  {
    label: 'my_folders',
    icon: 'folder',
    route: CaRouterService.getMyFoldersRoute(),
  },
  {
    label: 'my_labs',
    icon: 'lab',
    route: CaRouterService.getMyLabsRoute(),
  },
  {
    label: 'chats',
    icon: 'chat',
    route: CaRouterService.getChatRoute(),
  },
  {
    label: 'my_teams',
    icon: 'group',
    route: CaRouterService.getMyTeamsRoute(),
  },
  {
    label: 'admin_dashboard',
    icon: 'admin_panel_settings',
    route: CaRouterService.getAdminRoute(),
    authorizedCategories: [ClUserCategory.ADMIN],
  },
];
