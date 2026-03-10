import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

@Pipe({ name: 'translate', standalone: false })
export class MockTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}

@Pipe({ name: 'flDate', standalone: false })
export class MockFlDatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}

@Pipe({ name: 'flErrorRequired', standalone: false })
export class MockFlErrorRequiredPipe implements PipeTransform {
  transform(value: any): any { return value; }
}

@Pipe({ name: 'flDatasourceConnect', standalone: false })
export class MockFlDatasourceConnectPipe implements PipeTransform {
  transform(value: any): any { return of([]); }
}
