import {ClSupportedLanguage} from '@monorepo/core-lib';
import {FlLangTranslation, FlTranslateObject, FlTranslateService} from '@monorepo/front-core-lib';
import {I18nConfig} from '@editorjs/editorjs';


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
    code: 'Code',
    drag_block: 'Glisser le bloc',
    variable: 'Paramètre',
    value: 'Valeur',
    name: 'Nom',
    description: 'Description',
    save: 'Sauvegarder',
    placeholder: 'Écrivez quelque chose, utilisez la touch / pour les commandes...',
    clean_style: 'Enlever le style',
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
    code: 'Code',
    drag_block: 'Drag block',
    variable: 'Parameter',
    value: 'Value',
    name: 'Name',
    description: 'Description',
    save: 'Save',
    placeholder: 'Write something, use / for commands...',
    clean_style: 'Clean style',
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
          },
        },
        inlineToolbar: {
          converter: {
            'Convert to': translateService.translate('teTextEditor.convert_to')
          }
        },
        toolbar: {
          toolbox: {
            'Add': translateService.translate('teTextEditor.add'),
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
        'InlineCode': translateService.translate('teTextEditor.inline_code'),
      },
      tools: {
        link: {
          'Add a link': translateService.translate('teTextEditor.add_link'),
        },
        table: {
          'Add column to the left': translateService.translate('teTextEditor.add_column_to_left'),
          'Add column to the right': translateService.translate('teTextEditor.add_column_to_right'),
          'Delete column': translateService.translate('teTextEditor.delete_column'),
          'Add row above': translateService.translate('teTextEditor.add_row_above'),
          'Add row below': translateService.translate('teTextEditor.add_row_below'),
          'Delete row': translateService.translate('teTextEditor.delete_row'),
          'Heading': translateService.translate('teTextEditor.table_heading'),
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
        },
      }
    }
  };
}
