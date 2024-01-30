import {FlLangTranslation, FlTranslateObject} from '@monorepo/front-core-lib';
import {ClSupportedLanguage} from '@monorepo/core-lib';

const ltLiveTaskI18nFr: FlLangTranslation = {
  ltLiveTask: {
    'created_by': 'Créé par',
    'date_of_creation': 'Date de création',
    'last_modification': 'Dernière modification',
    'task_type': 'Type de tâche',
    'version': 'Version',
    'public': 'Public',
  }
};

const ltLiveTaskI18nEn: FlLangTranslation = {
  ltLiveTask: {
    'created_by': 'Created by',
    'date_of_creation': 'Date of creation',
    'last_modification': 'Last modification',
    'task_type': 'Task type',
    'version': 'Version',
    'public': 'Public',
  }
};
export const ltLiveTaskI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: ltLiveTaskI18nEn,
  [ClSupportedLanguage.fr]: ltLiveTaskI18nFr
};

