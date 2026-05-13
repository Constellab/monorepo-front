import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

const flAiEn: FlLangTranslation = {
  flAi: {
    input_title: 'AI instruction',
    input_placeholder: 'Type your instruction...',
    recording: 'Recording...',
    transcribing: 'Transcribing...',
    mic_disabled: 'Microphone access denied',
    audio_too_large: 'Recording too long — keep it under 10 MB',
    transcription_error: "Couldn't transcribe the recording, try again",
    submit_error: 'Something went wrong, try again',
    start_recording: 'Record voice instruction',
    stop_recording: 'Stop recording',
    ai_assistant: 'AI assistant',
    dictate: 'Dictate',
    type_instruction: 'Type instruction',
  },
};

const flAiFr: FlLangTranslation = {
  flAi: {
    input_title: 'Instruction IA',
    input_placeholder: 'Décrivez votre instruction...',
    recording: 'Enregistrement...',
    transcribing: 'Transcription...',
    mic_disabled: 'Accès au microphone refusé',
    audio_too_large: 'Enregistrement trop long — moins de 10 Mo',
    transcription_error: "Impossible de transcrire l'enregistrement, réessayez",
    submit_error: 'Une erreur est survenue, réessayez',
    start_recording: "Dicter l'instruction",
    stop_recording: "Arrêter l'enregistrement",
    ai_assistant: 'Assistant IA',
    dictate: 'Dicter',
    type_instruction: 'Saisir une instruction',
  },
};

export const FL_AI_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: flAiEn,
  [ClSupportedLanguage.fr]: flAiFr,
};
