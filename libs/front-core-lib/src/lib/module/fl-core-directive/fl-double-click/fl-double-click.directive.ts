import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[flDoubleClick]'
})
export class FlDoubleClickDirective {

  @Output() flDoubleClick = new EventEmitter<MouseEvent>();
  @Output() flClick = new EventEmitter<MouseEvent>();

  private debounceTime: number = 250;
  // private isDoubleClick: boolean = false;
  private click: number = 0;

  // @HostListener('dblclick', ['$event'])
  // onDoubleClick(event: MouseEvent): void {
  //   console.log('double click');
  //   this.isDoubleClick = true;
  //   this.flDoubleClick.emit(event);
  // }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.click++;

    if (this.click > 1) return;
    setTimeout(() => {
      if (this.click > 1) {
        console.log('double click');
        this.flDoubleClick.emit(event);
      } else {
        console.log('single click');
        this.flClick.emit(event);
      }
      this.click = 0;
    }, this.debounceTime);
  }

}
