import { Observable } from 'rxjs';

import { FlAiTranscriptionResult } from '../model/fl-ai.model';

/**
 * Abstract service for AI operations.
 * Provide a concrete implementation via FlAiModule.forRoot(YourService).
 */
export abstract class FlAiService {
  abstract transcribeAudio(file: File): Observable<FlAiTranscriptionResult>;
}
