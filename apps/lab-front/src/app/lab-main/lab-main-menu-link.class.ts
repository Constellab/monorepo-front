import {
  liConstBiotaFullRoute,
  liConstNoteFullRoute,
  liConstNoteTemplateFullRoute,
  liConstResourceFullRoute,
  liConstScenarioFullRoute,
  liConstScenarioTemplateRoute, liConstTagFullRoute,
  liConstViewFullRoute,
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

export function getMainMenuLinks(): LabMainMenuLink[] {
  return [
    {
      label: 'biox.scenarios',
      icon: 'scenario',
      route: liConstScenarioFullRoute,
    },
    {
      label: 'g.resources',
      icon: 'resource',
      route: liConstResourceFullRoute,
    },
    {
      label: 'biox.views',
      icon: 'view',
      route: liConstViewFullRoute,
    },
    {
      label: 'biox.scenario_templates',
      icon: 'scenario_template',
      route: liConstScenarioTemplateRoute,
    },
    {
      label: 'biox.notes',
      icon: 'note',
      route: liConstNoteFullRoute,
      divider: true,
    },
    {
      label: 'biox.note_templates',
      icon: 'note_template',
      route: liConstNoteTemplateFullRoute,
    },
    {
      label: 'biox.tags',
      icon: 'tag',
      route: liConstTagFullRoute,
      divider: true
    }
  ];
}

export const labBiotaMenuLink: LabMainMenuLink = {
  label: 'biota.biota',
  icon: 'database',
  route: liConstBiotaFullRoute,
  divider: true,
};
