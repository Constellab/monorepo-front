import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

@Pipe({ name: 'translate', standalone: false })
export class TeMockTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}

@Pipe({ name: 'flDate', standalone: false })
export class TeMockFlDatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}

@Pipe({ name: 'flErrorRequired', standalone: false })
export class TeMockFlErrorRequiredPipe implements PipeTransform {
  transform(value: any): any { return value; }
}

@Pipe({ name: 'flDatasourceConnect', standalone: false })
export class TeMockFlDatasourceConnectPipe implements PipeTransform {
  transform(): any { return of([]); }
}
