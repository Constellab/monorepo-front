import {
  labConstBiotaFullRoute,
  labConstBioxFullRoute,
  labConstDataboxFullRoute,
  labConstNoteFullRoute,
  labConstNoteTemplateFullRoute,
  labConstScenarioTemplateRoute,
  labConstViewboxFullRoute
} from '../lab-core/utils/lab-base-route';

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
      route: labConstBioxFullRoute
    },
    {
      label: 'resources',
      icon: 'resource',
      route: labConstDataboxFullRoute
    },
    {
      label: 'biox.views',
      icon: 'view',
      route: labConstViewboxFullRoute
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
      divider: true
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
