import {FlLangTranslation, FlTranslateObject} from '@monorepo/front-core-lib';
import {ClSupportedLanguage} from '@monorepo/core-lib';
/* eslint-disable max-len */

/**
 * Translation file for the Spreadsheet module
 */
const tdTechnicalDocI18nFr: FlLangTranslation = {
  td: {
    input: 'Entrée',
    output: 'Sortie',
    configuration: 'Configuration',
    type: 'Type',
    allowed_values: 'Valeurs autorisées',
    default_value: 'Valeur par défaut',
    typing_name: 'Typing name',
    parent: 'Parent',
    status: 'Etat',
    supported_extensions: 'Extensions supportées',
    param_set: 'Liste',
    max_occurrence_number: 'Nombre maximum d\'occurrences',
    deprecated: 'Obsolète',
    deprecated_since: 'Obsolète depuis la version',
    optional: 'Optionnel',
    constant: 'Constant',
    optional_tooltip: 'La tâche sera exécutée même si cette entrée n\'est pas connectée',
    constant_tooltip: 'Cette sortie ne créera pas de nouvelle ressource mais fera référence à une ressource existante',
    advanced_parameter: 'Paramètre avancé',
    type_unavailable_detail: 'Le type \'<strong>{typingName}</strong>\' de l\'objet n\'est pas disponible. Veuillez vérifiez que la brique \'<strong>{brickName}</strong>\' est correctement installé.',
    type_unavailable_detail_resource: 'Tant que le type est indisponible, les ressources de ce type ne pourront pas être utilisées dans des processus ni visualisées via les vues.',
    type_unavailable_detail_process: 'Tant que le type est indisponible, les processus de ce type ne pourront pas être utilisées dans des protocols.',
    dynamic_ports: 'Ports dynamiques',
    dynamic_port_help: 'Les ports dynamiques permettent de créer des ports à la volée.',
    add_port: 'Ajouter un port',
    update_port: 'Modifier le port',
    remove_port: 'Supprimer le port',
    brick: 'Brique',
    views: 'Vues',
    default_view: 'Vue par défaut',
    functions: 'Fonctions',
    parameters: 'Paramètres',
    return_type: 'Type de retour',
    name: 'Nom',
    description: 'Description',
    variables: 'Variables'
  }
};

const tdTechnicalDocI18nEn: FlLangTranslation = {
  td: {
    input: 'Input',
    output: 'Output',
    configuration: 'Configuration',
    type: 'Type',
    allowed_values: 'Allowed values',
    default_value: 'Default value',
    typing_name: 'Typing name',
    parent: 'Parent',
    status: 'Status',
    supported_extensions: 'Supported extensions',
    param_set: 'List',
    max_occurrence_number: 'Maximum occurrences number',
    deprecated: 'Deprecated',
    deprecated_since: 'Deprecated since the version',
    optional: 'Optional',
    not_optional: 'Required',
    constant: 'Constant',
    not_constant: 'Not constant',
    optional_tooltip: 'The task will be run even if this input is not connected',
    not_optional_tooltip: 'The task will not be run if this input is not connected',
    constant_tooltip: 'This output will not create a new resource but reference an existing resource',
    not_constant_tooltip: 'This output will create a new resource',
    advanced_parameter: 'Advanced parameter',
    type_unavailable_detail: 'The type \'<strong>{{typingName}}</strong>\' of the object is not available. Please check if the brick \'<strong>{{brickName}}</strong>\' is correctly installed.',
    type_unavailable_detail_resource: 'As long as the type is not available, the resources of this type cannot be used in any process nor visualized with views.',
    type_unavailable_detail_process: 'As long as the type is not available, the processes of this type cannot be used in protocols.',
    dynamic_ports: 'Dynamic ports',
    dynamic_port_help: 'Dynamic ports allow to create ports on the fly.',
    add_port: 'Add port',
    update_port: 'Update port',
    remove_port: 'Remove port',
    brick: 'Brick',
    views: 'Views',
    default_view: 'Default view',
    functions: 'Functions',
    parameters: 'Parameters',
    return_type: 'Return type',
    name: 'Name',
    description: 'Description',
    variables: 'Variables'
  }
};

export const tdTechnicalDocI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: tdTechnicalDocI18nEn,
  [ClSupportedLanguage.fr]: tdTechnicalDocI18nFr
};
