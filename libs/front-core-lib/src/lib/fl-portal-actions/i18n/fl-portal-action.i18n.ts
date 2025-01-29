import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const flPortalActionFr: FlLangTranslation = {
  flPortalAction: {
    actions: 'Tâches',
    close: 'Fermer',
    cancelActions: 'Annuler les tâches en cours',
    cancelActionsConfirmation: 'Voulez-vous vraiment annuler toutes les tâches en cours ?',
    cancelAction: 'Annuler la tâche',
    cancelActionConfirmation: 'Voulez-vous vraiment annuler cette tâche ?',
    reduce: 'Réduire',
    expand: 'Développer',
  },
};

const flPortalActionEn: FlLangTranslation = {
  flPortalAction: {
    actions: 'Tasks',
    close: 'Close',
    cancelActions: 'Cancel in progress tasks',
    cancelActionsConfirmation: 'Do you really want to cancel all tasks in progress?',
    cancelAction: 'Cancel task',
    cancelActionConfirmation: 'Do you really want to cancel this task?',
    reduce: 'Reduce',
    expand: 'Expand',
  },
};

export const flPortalActionI18n: FlTranslateObject = {
  [ClSupportedLanguage.en]: flPortalActionEn,
  [ClSupportedLanguage.fr]: flPortalActionFr,
};
