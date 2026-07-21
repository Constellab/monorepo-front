import { ChangeDetectionStrategy,Component, Input, OnInit } from '@angular/core';

import { TdTypeObjectType, TdTypingErrorDTO } from '../../model/td-type.class';
import { TdTypingName } from '../../model/td-typing-name.class';

@Component({
  selector: 'td-type-errors',
  templateUrl: './td-type-errors.component.html',
  styleUrls: ['./td-type-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TdTypeErrorsComponent implements OnInit {
  @Input() typingName: string;
  @Input() errors: TdTypingErrorDTO[] | null;

  brickName: string;
  objectType: TdTypeObjectType;

  ngOnInit(): void {
    const typingName = new TdTypingName(this.typingName);
    this.brickName = typingName.brickName;
    this.objectType = typingName.type;
  }

  get objectTypeText(): string {
    switch (this.objectType) {
      case 'RESOURCE':
        return 'td.type_error_detail_resource';
      case 'PROTOCOL':
      case 'TASK':
        return 'td.type_error_detail_process';
    }

    return null;
  }
}
