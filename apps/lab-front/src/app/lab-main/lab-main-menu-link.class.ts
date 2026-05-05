import {
  LI_CONST_APP_FULL_ROUTE,
  LI_CONST_BIOTA_FULL_ROUTE,
  LI_CONST_NOTE_FULL_ROUTE,
  LI_CONST_NOTE_TEMPLATE_FULL_ROUTE,
  LI_CONST_RESOURCE_FULL_ROUTE,
  LI_CONST_SCENARIO_FULL_ROUTE,
  LI_CONST_SCENARIO_TEMPLATE_ROUTE,
  LI_CONST_TAG_FULL_ROUTE,
  LI_CONST_VIEW_FULL_ROUTE,
} from '@monorepo/lab-lib/li-core';

/**
 * Describe one main menu link button
 */
export interface LabMainMenuLink {
  route: string;
  label: string;
  icon: string;
  divider?: boolean;
}

export function labGetMainMenuLinks(): LabMainMenuLink[] {
  return [
    {
      label: 'biox.scenarios',
      icon: 'scenario',
      route: LI_CONST_SCENARIO_FULL_ROUTE,
    },
    {
      label: 'g.resources',
      icon: 'resource',
      route: LI_CONST_RESOURCE_FULL_ROUTE,
    },
    {
      label: 'biox.views',
      icon: 'view',
      route: LI_CONST_VIEW_FULL_ROUTE,
    },
    {
      label: 'biox.scenario_templates',
      icon: 'scenario_template',
      route: LI_CONST_SCENARIO_TEMPLATE_ROUTE,
    },
    {
      label: 'biox.notes',
      icon: 'note',
      route: LI_CONST_NOTE_FULL_ROUTE,
      divider: true,
    },
    {
      label: 'biox.note_templates',
      icon: 'note_template',
      route: LI_CONST_NOTE_TEMPLATE_FULL_ROUTE,
    },
    {
      label: 'biox.apps',
      icon: 'dashboard',
      route: LI_CONST_APP_FULL_ROUTE,
      divider: true,
    },
    {
      label: 'biox.tags',
      icon: 'tag',
      route: LI_CONST_TAG_FULL_ROUTE,
      divider: true,
    },
  ];
}

export const LAB_BIOTA_MENU_LINK: LabMainMenuLink = {
  label: 'biota.biota',
  icon: 'database',
  route: LI_CONST_BIOTA_FULL_ROUTE,
  divider: true,
};
