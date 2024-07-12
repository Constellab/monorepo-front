import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib';
import { ClSupportedLanguage } from '@monorepo/core-lib';
/* eslint-disable max-len */

/**
 * Translation file for the Spreadsheet module
 */
const prProtocolI18nFr: FlLangTranslation = {
  pr: {
    type_unavailable_detail: 'Le type \'<strong>{typingName}</strong>\' de l\'objet n\'est pas disponible. Veuillez vérifiez que la brique \'<strong>{brickName}</strong>\' est correctement installé.',
    adding_process: 'Ajout de \'{{processName}}\'',
    adding_source: 'Ajout de \'{{resourceName}}\'',
    adding_output: 'Ajout d\'un output',
    adding_viewer: 'Ajout d\'un viewer',
    open_node_detail: 'Détail',
    viewer_not_configured: 'Le viewer n\'est pas encore configuré',
    show_view: 'Afficher la vue',
    error: 'Erreur',
    delete_link_interface_error: 'Impossible de supprimer une connexion liée à une interface ou une outerface, veuillez supprimer directement l\'interface ou l\'outerface',
    deleting_process: "Suppression '{{processName}}'",
    deleting_interface: "Suppression de l'interface '{{name}}'",
    deleting_outerface: "Suppression de l'outerface '{{name}}'",
    adding_connection: "Ajout de la connexion",
    deleting_connection: "Suppression de la connexion",
    human_name: "Nom",
    short_description: "Brève description",
    default_value: "Valeur par défaut",
    value: "Valeur",
    partially_run: "Partiellement exécuté",
    waiting_for_cli_process: "En attente",
    process_not_available: "Attention, le process n'est pas disponible, est-ce que la brick associé est bien chargé ? Vous pouvez retrouver la liste des brick et leur status dans Paramètres > Monitoring. L'expérience ne peut pas être exécutée.",
    process_configuration: "Configuration",
    adding_community_live_task: "Ajout de la live task de Community '{{processName}}'",
    duplicating_process: "Duplication du process '{{processName}}'",
    select_resource: "Choisir une ressource",
    resource: "Ressource",
    open_protocol_detail: "Ouvrir le détail du protocole",
    resource_load_error: "Erreur lors du chargement de la ressource.",
    open_resource_experiment: "Ouvrir l'expérience précédente",
    show_next_objects: "Afficher les objets suivants",
    instance_name: "Nom de l'instance",
    brick: 'Brique',
    typing_name: 'Type',
    show_config_detail: 'Configuration détaillée',
    process_detail: 'Détail du process',
  }
};

const prProtocolI18nEn: FlLangTranslation = {
  pr: {
    type_unavailable_detail: 'The type \'<strong>{{typingName}}</strong>\' of the object is not available. Please check if the brick \'<strong>{{brickName}}</strong>\' is correctly installed.',
    adding_process: 'Adding \'{{processName}}\'',
    adding_source: 'Adding \'{{resourceName}}\'',
    adding_output: 'Adding output',
    adding_viewer: 'Adding viewer',
    open_node_detail: 'Detail',
    viewer_not_configured: 'The viewer is not configured yet',
    show_view: 'Show view',
    error: 'Error',
    delete_link_interface_error: 'Can\'t delete a connection linked to an interface or an outerface, please delete directly the interface or outerface',
    deleting_process: "Deleting '{{processName}}'",
    deleting_interface: "Deleting interface '{{name}}'",
    deleting_outerface: "Deleting outerface '{{name}}'",
    adding_connection: "Adding connection",
    deleting_connection: "Deleting connection",
    human_name: "Name",
    short_description: "Short description",
    default_value: "Default value",
    value: "Value",
    partially_run: "Partially run",
    waiting_for_cli_process: "Waiting",
    process_not_available: "Warning, the process is not available, is the associated brick correctly loaded? You can find the list of bricks and their status in Settings > Monitoring. The experiment can't be run.",
    process_configuration: "Configuration",
    adding_community_live_task: "Adding Community live task '{{processName}}'",
    duplicating_process: "Duplicating process '{{processName}}'",
    select_resource: "Choose a resource",
    resource: "Resource",
    open_protocol_detail: "Open protocol detail",
    resource_load_error: "Error while loading the resource.",
    open_resource_experiment: "Open previous experiment",
    show_next_objects: "Show next objects",
    instance_name: "Instance name",
    brick: 'Brick',
    typing_name: 'Type',
    show_config_detail: 'Detailed configuration',
    process_detail: 'Process detail',
  }
};

export const prProtocolI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: prProtocolI18nEn,
  [ClSupportedLanguage.fr]: prProtocolI18nFr
};
