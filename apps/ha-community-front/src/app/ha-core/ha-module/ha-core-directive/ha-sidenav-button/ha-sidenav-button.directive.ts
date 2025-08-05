import { Directive, ElementRef, HostListener, inject,OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Directive({ selector: '[haSidenavButton]' })
export class HaSidenavButtonDirective implements OnInit {
  private elementRef = inject(ElementRef);
  private router = inject(Router);

  isOpen: boolean = false;
  isActivated: boolean = false;
  windowSize: number;

  ngOnInit(): void {
    this.elementRef.nativeElement.innerHTML = 'menu';

    this.router.events.subscribe((e: any) => {
      if (e.type == 1) {
        const sidenav: any = this.elementRef.nativeElement.closest('.left-panel');
        if (sidenav.style.left != '0px') return;
        this.isOpen = false;
        sidenav.style.left = '-100%';
        sidenav.classList.remove('left-panel-open');
        this.elementRef.nativeElement.innerHTML = 'menu';
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    const sidenav: any = this.elementRef.nativeElement.closest('.left-panel');
    this.windowSize = event.target.innerWidth;
    if (this.windowSize > 1160 && this.isActivated) {
      sidenav.style.left = 'var(--margin-side)';
      this.isOpen = false;
      this.elementRef.nativeElement.innerHTML = 'menu';
      this.isActivated = false;
    }
  }

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    const sidenav: any = this.elementRef.nativeElement.closest('.left-panel');

    if (sidenav == null || !targetElement) return;
    const clickedInside = sidenav.contains(targetElement);

    if (!clickedInside && this.windowSize && this.windowSize <= 1160) {
      this.isOpen = false;
      sidenav.style.left = '-100%';
      this.elementRef.nativeElement.innerHTML = 'menu';
      this.isActivated = true;
    } else if (targetElement == this.elementRef.nativeElement) {
      if (!this.isOpen || !sidenav.classList.contains('left-panel-open')) {
        sidenav.style.left = '0';
        this.isOpen = true;
        this.elementRef.nativeElement.innerHTML = 'close';
        this.isActivated = true;

        sidenav.classList.add('left-panel-open');
      } else {
        this.isOpen = false;
        sidenav.style.left = '-100%';
        this.elementRef.nativeElement.innerHTML = 'menu';
        this.isActivated = true;
        sidenav.classList.remove('left-panel-open');
      }
    }
  }
}
