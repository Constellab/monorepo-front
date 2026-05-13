import { inject, Injectable } from '@angular/core';
import { FlAiService, FlAiTranscriptionResult } from '@monorepo/front-core-lib/fl-ai';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LiAiService extends FlAiService {
  private apiService = inject(FlApiService);

  transcribeAudio(file: File): Observable<FlAiTranscriptionResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post('ai/transcribe-audio', formData);
  }
}
