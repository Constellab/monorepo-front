import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject, FlTranslateService } from '@monorepo/front-core-lib';
import { I18nConfig } from '@editorjs/editorjs';

/* eslint-disable max-len */


/**
 * Translation file for the Spreadsheet module
 */
const teTextEditorI18nFr: FlLangTranslation = {
  teTextEditor: {
    title: 'Titre',
    caption: 'Légende',
    ok: 'Ok',
    hint_classic: 'Aide',
    hint_warning: 'Warning',
    hint_scientific: 'Info scientifique',
    url: 'Url',
    youtube_video: 'Vidéo youtube',
    video_url_error: 'L\'url de la vidéo youtube est invalide',
    not_youtube_link_error: 'Ce n\'est pas un lien de vidéo youtube',
    text: 'Texte',
    header_1: 'Titre 1',
    header_2: 'Titre 2',
    header_3: 'Titre 3',
    copy_link: 'Copier le lien',
    link_copied: 'Lien copié',
    list_unordered: 'Liste à puces',
    list_ordered: 'Liste numérotée',
    image: 'Image',
    file: 'Fichier',
    code: 'Code',
    drag_block: 'Glisser le bloc',
    variable: 'Paramètre',
    value: 'Valeur',
    name: 'Nom',
    description: 'Description',
    save: 'Sauvegarder',
    placeholder: 'Écrivez quelque chose, utilisez la touch / pour les commandes...',
    clean_style: 'Enlever le style',
    document_saved: 'Enregistré',
    saving_document: 'Enregistrement...',
    // Te ui
    delete: 'Supprimer',
    click_to_delete: 'Cliquez pour supprimer',
    move_up: 'Monter',
    move_down: 'Descendre',
    click_to_tune: 'Cliquez pour régler',
    convert_to: 'Convertir en',
    add: 'Ajouter',
    filter: 'Filtrer',
    no_result: 'Aucun résultat',
    // Te inline tools
    bold: 'Gras',
    italic: 'Italique',
    underline: 'Souligné',
    strikethrough: 'Barré',
    link: 'Lien',
    inline_code: 'Code',
    add_link: 'Ajouter un lien',
    // Table
    add_column_to_left: 'Ajouter une colonne à gauche',
    add_column_to_right: 'Ajouter une colonne à droite',
    delete_column: 'Supprimer la colonne',
    add_row_above: 'Ajouter une ligne au-dessus',
    add_row_below: 'Ajouter une ligne en dessous',
    delete_row: 'Supprimer la ligne',
    table_heading: 'En-tête',
    modifications_history: 'Historique des modifications',
    rollback_to_this_content: 'Revenir à ce contenu',
    confirm_rollback_title: 'Confirmer le retour en arrière',
    confirm_rollback_content: 'Êtes-vous sûr de vouloir revenir à cette version du contenu ? Les modifications apportées après cette version seront supprimées.',
    confirm_rollback_success: 'Retour en arrière effectué avec succès',
    modification: 'Modification',
    modification_text: 'a {{action}} un {{type}}',
    CREATED: 'créé',
    UPDATED: 'mis à jour',
    DELETED: 'supprimé',
    MOVED: 'déplacé',
    open_modifications_history_panel: 'Ouvrir le panneau d\'historique des modifications',
    no_modifications: 'Aucune modification',
    attached_files: 'Fichiers attachés',
    table_of_contents: 'Table des matières',
    formula_help: 'Vous pouvez générez des formules en parlant en utilisant l\'option \'Dicter\'',
    // Audio transcription
    dictate: 'Dicter',
    mic_disabled_error: 'Le microphone est désactivé, veuillez l\'activer pour utiliser cette fonctionnalité.',
    recording: 'En cours d\'enregistrement',
    not_recording: 'Pas d\'enregistrement',
    start_recording: 'Commencer l\'enregistrement',
    stop_recording_and_transcribe: 'Arrêter l\'enregistrement',
    cancel: 'Annuler',
    transcription_in_progress: 'Transcription en cours',
    voice_command_start: 'Vous pouvez utiliser des commandes vocales pour créer des blocs spécifiques:',
    voice_command_title: '<strong>titre/en-tête</strong>: Créez un en-tête. Dites en-tête 1,2,3 ou sous-titre pour créer un en-tête à un niveau spécifique.',
    voice_command_list: '<strong>liste</strong>: Créez une liste. Dites liste à puces ou liste numérotée pour créer une liste du type désiré. Vous pouvez créer des éléments imbriqués.',
    voice_command_formula: '<strong>formule mathématique</strong>: Créez une formule mathématique. Beta : testez en générant seulement la formule.',
    voice_command_end: 'Vous pouvez dire "fin de la commande" comme "fin du titre" pour forcer la fin d\'une commande.',
    no_text_detected: 'Aucun texte détecté',
    import_audio_file: 'Importer un fichier audio',
    // Timestamp tool
    timestamp: 'Horodatage',
    timestamp_format: 'Format',
    timestamp_format_date: 'Date',
    timestamp_format_date_time: 'Date et heure',
    timestamp_format_date_time_seconds: 'Date et heure avec secondes',
    timestamp_format_time: 'Heure',
    timestamp_format_from_now: 'À partir de maintenant',
    timestamp_edit: 'Modifier',
    // Settings
    settings: 'Paramètres'
  }
};


const teTextEditorI18nEn: FlLangTranslation = {
  teTextEditor: {
    title: 'Title',
    caption: 'Caption',
    ok: 'Ok',
    hint_classic: 'Hint',
    hint_warning: 'Warning',
    hint_scientific: 'Scientific info',
    url: 'Url',
    youtube_video: 'Youtube video',
    video_url_error: 'Invalid youtube video url',
    not_youtube_link_error: 'This is not a youtube video url',
    text: 'Text',
    header_1: 'Header 1',
    header_2: 'Header 2',
    header_3: 'Header 3',
    copy_link: 'Copy link',
    link_copied: 'Link copied',
    list_unordered: 'Unordered list',
    list_ordered: 'Ordered list',
    image: 'Image',
    file: 'File',
    code: 'Code',
    drag_block: 'Drag block',
    variable: 'Parameter',
    value: 'Value',
    name: 'Name',
    description: 'Description',
    save: 'Save',
    placeholder: 'Write something, use / for commands...',
    clean_style: 'Clean style',
    document_saved: 'Saved',
    saving_document: 'Saving...',
    // Te ui
    delete: 'Delete',
    click_to_delete: 'Click to delete',
    move_up: 'Move up',
    move_down: 'Move down',
    click_to_tune: 'Click to tune',
    convert_to: 'Convert to',
    add: 'Add',
    filter: 'Filter',
    no_result: 'No result',
    // Te inline tools
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strikethrough: 'Strikethrough',
    link: 'Link',
    inline_code: 'Inline code',
    add_link: 'Add link',
    // Table
    add_column_to_left: 'Add column to the left',
    add_column_to_right: 'Add column to the right',
    delete_column: 'Delete column',
    add_row_above: 'Add row above',
    add_row_below: 'Add row below',
    delete_row: 'Delete row',
    table_heading: 'Heading',
    modifications_history: 'Modifications history',
    rollback_to_this_content: 'Rollback to this content',
    confirm_rollback_title: 'Confirm rollback',
    confirm_rollback_content: 'Are you sure you want to return to this content version? Changes made after this version will be deleted.',
    confirm_rollback_success: 'Rollback successful',
    modification: 'Modification',
    modification_text: 'has {{action}} a {{type}}',
    CREATED: 'created',
    UPDATED: 'updated',
    DELETED: 'deleted',
    MOVED: 'moved',
    open_modifications_history_panel: 'Open modifications history panel',
    no_modifications: 'No modifications',
    attached_files: 'Attached files',
    table_of_contents: 'Table of contents',
    formula_help: 'You can generate formulas by speaking using the \'Dictate\' option',
    // Audio transcription
    dictate: 'Dictate',
    mic_disabled_error: 'Microphone is disabled, please enable it to use this feature.',
    recording: 'Recording in progress',
    not_recording: 'Not recording',
    start_recording: 'Start recording',
    stop_recording_and_transcribe: 'Stop recording',
    cancel: 'Cancel',
    transcription_in_progress: 'Transcription in progress',
    voice_command_start: 'You can use voice commands to create specific blocks:',
    voice_command_title: '<strong>title/header</strong>: Create a header. Say header 1,2,3 or sub header to create a header on a specific level.',
    voice_command_list: '<strong>list</strong>: Create a list. Say unordered list or ordered list to create a list of the desired type. You can create nested items.',
    voice_command_formula: '<strong>math formula</strong>: Create a math formula. Beta: test by generating only the formula.',
    voice_command_end: 'You can say "end command" like "end title" to force the end of a command.',
    no_text_detected: 'No text detected',
    import_audio_file: 'Import an audio file',
    // Timestamp tool
    timestamp: 'Timestamp',
    timestamp_format: 'Format',
    timestamp_format_date: 'Date',
    timestamp_format_date_time: 'Date and time',
    timestamp_format_date_time_seconds: 'Date and time with seconds',
    timestamp_format_time: 'Time',
    timestamp_format_from_now: 'From now',
    timestamp_edit: 'Edit',
    // Settings
    settings: 'Settings'
  }
};

export const teTextEditorI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: teTextEditorI18nEn,
  [ClSupportedLanguage.fr]: teTextEditorI18nFr
};

export function teGetI18nConfig(translateService: FlTranslateService): I18nConfig {
  return {
    messages: {
      ui: {
        blockTunes: {
          toggler: {
            'Click to tune': translateService.translate('teTextEditor.click_to_tune')
          }
        },
        inlineToolbar: {
          converter: {
            'Convert to': translateService.translate('teTextEditor.convert_to')
          }
        },
        toolbar: {
          toolbox: {
            'Add': translateService.translate('teTextEditor.add')
          }
        },
        popover: {
          'Filter': translateService.translate('teTextEditor.filter'),
          'Nothing found': translateService.translate('teTextEditor.no_result')
        }
      },
      toolNames: {
        'Bold': translateService.translate('teTextEditor.bold'),
        'Italic': translateService.translate('teTextEditor.italic'),
        'Underline': translateService.translate('teTextEditor.underline'),
        'Strikethrough': translateService.translate('teTextEditor.strikethrough'),
        'Link': translateService.translate('teTextEditor.link'),
        'InlineCode': translateService.translate('teTextEditor.inline_code')
      },
      tools: {
        link: {
          'Add a link': translateService.translate('teTextEditor.add_link')
        },
        table: {
          'Add column to the left': translateService.translate('teTextEditor.add_column_to_left'),
          'Add column to the right': translateService.translate('teTextEditor.add_column_to_right'),
          'Delete column': translateService.translate('teTextEditor.delete_column'),
          'Add row above': translateService.translate('teTextEditor.add_row_above'),
          'Add row below': translateService.translate('teTextEditor.add_row_below'),
          'Delete row': translateService.translate('teTextEditor.delete_row'),
          'Heading': translateService.translate('teTextEditor.table_heading')
        }
      },
      blockTunes: {
        'delete': {
          'Delete': translateService.translate('teTextEditor.delete'),
          'Click to delete': translateService.translate('teTextEditor.click_to_delete')
        },
        'moveUp': {
          'Move up': translateService.translate('teTextEditor.move_up')
        },
        'moveDown': {
          'Move down': translateService.translate('teTextEditor.move_down')
        }
      }
    }
  };
}
