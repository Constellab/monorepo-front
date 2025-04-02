import {
  labConstBiotaFullRoute,
  labConstBioxFullRoute,
  labConstNoteFullRoute,
  labConstNoteTemplateFullRoute,
  labConstResourceFullRoute,
  labConstScenarioTemplateRoute,
  labConstViewFullRoute,
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
      route: labConstBioxFullRoute,
    },
    {
      label: 'g.resources',
      icon: 'resource',
      route: labConstResourceFullRoute,
    },
    {
      label: 'biox.views',
      icon: 'view',
      route: labConstViewFullRoute,
    },
    {
      label: 'biox.scenario_templates',
      icon: 'scenario_template',
      route: labConstScenarioTemplateRoute,
    },
    {
      label: 'biox.notes',
      icon: 'note',
      route: labConstNoteFullRoute,
      divider: true,
    },
    {
      label: 'biox.note_templates',
      icon: 'note_template',
      route: labConstNoteTemplateFullRoute,
    },
  ];
}

export const labBiotaMenuLink: LabMainMenuLink = {
  label: 'biota.biota',
  icon: 'database',
  route: labConstBiotaFullRoute,
  divider: true,
};
