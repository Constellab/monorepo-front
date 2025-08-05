import { ChangeDetectionStrategy, Component, inject,Input } from '@angular/core';

import { TdTypingName } from '../../model/td-typing-name.class';
import {
  TdTechnicalDocServiceConfig,
  TdTechnicalDocUrl,
} from '../../service/td-technical-doc-service-config.config';

@Component({
  selector: 'td-tech-doc-link',
  templateUrl: './td-tech-doc-link.component.html',
  styleUrls: ['./td-tech-doc-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TdTechDocLinkComponent {
  private tdServiceConfig = inject(TdTechnicalDocServiceConfig);

  @Input({ required: true }) typingName: string;

  @Input({ required: true }) version: string;

  get docUrl(): TdTechnicalDocUrl {
    const typingName: TdTypingName = new TdTypingName(this.typingName);

    return this.tdServiceConfig.getTechnicalDocUrl(this.version, typingName);
  }
}
