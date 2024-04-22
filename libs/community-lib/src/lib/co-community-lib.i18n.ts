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
    'create': 'Créer',
    'your_spaces': 'Sélectionner le space de la live task',
    'no_published': 'Non publié',
    'write_a_comment': 'Écrire un commentaire',
    'comment': 'Commentaire',
    'comments': 'Commentaires',
    'visibility': 'Visibilité',
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
    'your_spaces': 'Select the space of the live task',
    'no_published': 'Not published',
    'write_a_comment': 'Write a comment',
    'comment': 'Comment',
    'comments': 'Comments',
    'visibility': 'Visibility',
  }
};
export const coCommunityLibI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: coCommunityLibI18nEn,
  [ClSupportedLanguage.fr]: coCommunityLibI18nFr
};

