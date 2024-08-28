import {
  labConstBiotaFullRoute,
  labConstBioxFullRoute,
  labConstDataboxFullRoute,
  labConstDocumentTemplateFullRoute,
  labConstProtocolTemplateRoute,
  labConstReportFullRoute,
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
      label: 'biox.notepad',
      icon: 'report',
      route: labConstReportFullRoute,
    },
    {
      label: 'biox.experiments',
      icon: 'experiment',
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
