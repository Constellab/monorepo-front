import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TdParamSpecs } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

import { LiFormSaveEvent } from '../../model/li-form-save-event.entity';
import { LiFormService } from '../../service/li-form.service';
import { liFormatChangeEntry, LiFormattedChangeEntry, liGetChangeSummary } from './li-form-history.logic';

@Component({
  selector: 'li-form-history',
  templateUrl: './li-form-history.component.html',
  styleUrl: './li-form-history.component.scss',
  imports: [MatButton, MatIcon, FlLoaderModule, FlUserModule, TranslatePipe],
})
export class LiFormHistoryComponent {
  private formService = inject(LiFormService);

  formId = input.required<string>();
  specs = input<TdParamSpecs>();

  events = signal<LiFormSaveEvent[]>([]);
  isLoading = signal(false);
  hasMore = signal(true);
  expandedEventId = signal<string | null>(null);

  private page = 0;
  private readonly pageSize = 20;

  constructor() {
    effect(() => {
      const id = this.formId();
      if (id) {
        this.reset();
        this.loadPage();
      }
    });
  }

  loadMore(): void {
    this.loadPage();
  }

  toggleEvent(eventId: string): void {
    this.expandedEventId.update((current) => (current === eventId ? null : eventId));
  }

  getChangeSummary(event: LiFormSaveEvent): string {
    return liGetChangeSummary(event.changes);
  }

  getFormattedChanges(event: LiFormSaveEvent): LiFormattedChangeEntry[] {
    return event.changes.map((entry) => liFormatChangeEntry(entry, this.specs()));
  }

  private reset(): void {
    this.page = 0;
    this.events.set([]);
    this.hasMore.set(true);
  }

  private loadPage(): void {
    this.isLoading.set(true);
    this.formService.getHistory(this.formId(), this.page, this.pageSize).subscribe({
      next: (result) => {
        this.events.update((current) => [...current, ...result.objects]);
        this.hasMore.set(!result.last);
        this.page++;
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
