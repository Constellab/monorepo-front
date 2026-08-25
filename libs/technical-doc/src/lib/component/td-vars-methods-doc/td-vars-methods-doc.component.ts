import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { TdTechDocFunction } from '../../model/td-resource-type.class';

@Component({
  selector: 'td-vars-methods-doc',
  templateUrl: './td-vars-methods-doc.component.html',
  styleUrls: ['./td-vars-methods-doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TdVarsMethodsDocComponent implements OnInit {
  @Input({ required: true }) funcs: TdTechDocFunction[];
  @Input() variables: Record<string, any>;

  ngOnInit(): void {
    if (this.funcs?.length > 0) {
      this.funcs = this.funcs.sort((a, b) => {
        // sort by method type null then classmethod then staticmethod, then by name
        const aType = a.method_type;
        const bType = b.method_type;
        if (aType === bType) {
          return a.name.localeCompare(b.name);
        }

        if (aType == null) {
          return -1;
        }

        if (bType == null) {
          return 1;
        }

        if (aType === 'classmethod' && bType === 'staticmethod') {
          return -1;
        }

        if (aType === 'staticmethod' && bType === 'classmethod') {
          return 1;
        }

        return aType.localeCompare(bType);
      });
    }
  }
}
