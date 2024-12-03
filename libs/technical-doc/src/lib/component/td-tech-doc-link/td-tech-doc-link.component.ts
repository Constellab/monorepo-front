import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  TdTechnicalDocServiceConfig,
  TdTechnicalDocUrl,
} from '../../service/td-technical-doc-service-config.config';
import { TdTypingName } from '../../model/td-typing-name.class';

@Component({
  selector: 'td-tech-doc-link',
  templateUrl: './td-tech-doc-link.component.html',
  styleUrls: ['./td-tech-doc-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TdTechDocLinkComponent {
  @Input({ required: true }) typingName: string;

  @Input({ required: true }) version: string;

  constructor(private tdServiceConfig: TdTechnicalDocServiceConfig) {}

  get docUrl(): TdTechnicalDocUrl {
    const typingName: TdTypingName = new TdTypingName(this.typingName);

    return this.tdServiceConfig.getTechnicalDocUrl(this.version, typingName);
  }
}
