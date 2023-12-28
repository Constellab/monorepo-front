import {ClSupportedLanguage} from '@monorepo/core-lib';
import {FlLangTranslation, FlTranslateObject} from '@monorepo/front-core-lib';


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
    header_2: 'Titre 2',
    header_3: 'Titre 3',
    header_4: 'Titre 4',
    list_unordered: 'Liste à puces',
    list_ordered: 'Liste numérotée',
    image: 'Image',
    code: 'Code',
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
    header_2: 'Header 2',
    header_3: 'Header 3',
    header_4: 'Header 4',
    list_unordered: 'Unordered list',
    list_ordered: 'Ordered list',
    image: 'Image',
    code: 'Code',
  }
};

export const teTextEditorI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: teTextEditorI18nEn,
  [ClSupportedLanguage.fr]: teTextEditorI18nFr
};
