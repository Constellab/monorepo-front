import {
  labConstBiotaFullRoute,
  labConstBioxFullRoute,
  labConstDataboxFullRoute,
  labConstDocumentTemplateFullRoute,
  labConstNoteFullRoute,
  labConstProtocolTemplateRoute,
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
      label: 'databox.file_explorer',
      icon: 'folder',
      route: labConstDataboxFullRoute
    },
    {
      label: 'biox.viewbox',
      icon: 'view',
      route: labConstViewboxFullRoute
    },
    {
      label: 'biox.protocol_templates',
      icon: 'protocol_template',
      route: labConstProtocolTemplateRoute,
    },
    {
      label: 'biox.notepad',
      icon: 'note',
      route: labConstNoteFullRoute,
      divider: true
    },
    {
      label: 'biox.document_templates',
      icon: 'document_template',
      route: labConstDocumentTemplateFullRoute,
    },
  ];
}

export const labBiotaMenuLink: LabMainMenuLink = {
  label: 'biota.biota',
  icon: 'database',
  route: labConstBiotaFullRoute,
  divider: true,
};
