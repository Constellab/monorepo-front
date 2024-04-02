import {FlLangTranslation, FlTranslateObject} from '@monorepo/front-core-lib';
import {ClSupportedLanguage} from '@monorepo/core-lib';

const coCommunityLibI18nFr: FlLangTranslation = {
  coCommunityLib: {
    'created_by': 'Créé par',
    'date_of_creation': 'Date de création',
    'last_modification': 'Dernière modification',
    'task_type': 'Type de tâche',
    'task_visibility': 'Visibilité de la tâche',
    'version': 'Version',
    'public': 'Public',
    'title': 'Title',
    'space': 'Space',
    'type': 'Type',
    'create': 'Create',
    'your_spaces': 'Vos spaces',
    'no_published': 'Non publié',
    'write_a_comment': 'Écrire un commentaire',
    'comment': 'Commentaire',
    'comments': 'Commentaires',
  }
};

const coCommunityLibI18nEn: FlLangTranslation = {
  coCommunityLib: {
    'created_by': 'Created by',
    'date_of_creation': 'Date of creation',
    'last_modification': 'Last modification',
    'task_type': 'Task type',
    'task_visibility': 'Task visibility',
    'version': 'Version',
    'public': 'Public',
    'title': 'Title',
    'space': 'Space',
    'type': 'Type',
    'create': 'Create',
    'your_spaces': 'Your spaces',
    'no_published': 'Not published',
    'write_a_comment': 'Write a comment',
    'comment': 'Comment',
    'comments': 'Comments',
  }
};
export const coCommunityLibI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: coCommunityLibI18nEn,
  [ClSupportedLanguage.fr]: coCommunityLibI18nFr
};

