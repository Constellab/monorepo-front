import {Component, Input, OnInit} from '@angular/core';
import {TdTechDocFunction} from '../../model/td-resource-type.class';

@Component({
  selector: 'td-vars-methods-doc',
  templateUrl: './td-vars-methods-doc.component.html',
  styleUrls: ['./td-vars-methods-doc.component.scss']
})
export class TdVarsMethodsDocComponent implements OnInit{

  @Input({required: true}) funcs: TdTechDocFunction[];
  @Input() variables: Record<string, any>;

  ngOnInit(): void {
    if(this.funcs?.length > 0){
      this.funcs = this.funcs.sort((a, b) => {
        // sort by method type null then classmethod then staticmethod, then by name
        if(a.method_type === b.method_type){
          return a.name.localeCompare(b.name);
        }

        if(a.method_type === null){
          return -1;
        }

        if(b.method_type === null){
          return 1;
        }

        if(a.method_type === 'classmethod' && b.method_type === 'staticmethod'){
          return -1;
        }

        if(a.method_type === 'staticmethod' && b.method_type === 'classmethod'){
          return 1;
        }

        return a.method_type.localeCompare(b.method_type);
      });
    }
  }
}
