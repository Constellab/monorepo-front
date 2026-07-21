import { ChangeDetectionStrategy,Component, Input, OnChanges, OnInit } from '@angular/core';
import { FlColorHelper } from '@monorepo/front-core-lib/fl-core';

import { TdTypeEntity } from '../../model/td-type.class';

@Component({
  selector: 'td-technical-doc-header',
  templateUrl: './td-technical-doc-header.component.html',
  styleUrls: ['./td-technical-doc-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TdTechnicalDocHeaderComponent implements OnInit, OnChanges {
  @Input()
  technicalDoc: TdTypeEntity;

  color: string;

  isTyping: boolean = false;

  ngOnInit(): void {
    this.checkIsTyping();

    if (this.isTyping) {
      this.setColor();
    }
  }

  ngOnChanges(): void {
    this.checkIsTyping();
    if (this.isTyping) {
      this.setColor();
    }
  }

  private checkIsTyping(): void {
    if (this.technicalDoc.typingName != null) {
      this.isTyping = true;
    }
  }

  private setColor(): void {
    this.color = FlColorHelper.stringToRGBColor(this.technicalDoc.typingName);
  }
}
