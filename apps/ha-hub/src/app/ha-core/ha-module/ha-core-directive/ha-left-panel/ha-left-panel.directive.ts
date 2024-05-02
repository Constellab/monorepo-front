import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[haLeftPanel]'
})
export class HaLeftPanelDirective{

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const nativeElement: any = this.elementRef.nativeElement;
    if(!nativeElement.contains(event.target)){
      this.closeLeftPanel();
    }
  }

  constructor(private elementRef: ElementRef) {
  }

  private closeLeftPanel(): void {
    if (this.elementRef.nativeElement.classList.contains('left-panel-open')) {
      ((this.elementRef.nativeElement as HTMLElement).querySelector('.button-close-left-panel') as HTMLElement).click();
    }
  }

}
