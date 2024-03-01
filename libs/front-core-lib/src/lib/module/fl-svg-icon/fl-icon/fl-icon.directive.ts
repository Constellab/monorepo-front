import {Directive, ElementRef, Host, Inject, Input, OnInit} from '@angular/core';
import {MatIcon, MatIconRegistry} from '@angular/material/icon';
import {FL_ICON_MODULE, FlIcon, FlIconConfig, FlMatIcon, FlSvgIcon} from '../fl-icon-config.class';
import {DomSanitizer} from '@angular/platform-browser';

/**
 * directive to be placed on a mat-icon. It set the icon and support both
 * mat icon and svg icon
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-icon[flIcon]'
})
export class FlIconDirective implements OnInit {

  @Input() set flIcon(flIcon: string) {
    this.setIcon(flIcon);
  }

  constructor(@Host() private matIcon: MatIcon,
              private elementRef: ElementRef<HTMLElement>,
              @Inject(FL_ICON_MODULE) private config: FlIconConfig,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
  }

  ngOnInit(): void {

  }

  private setIcon(icon: string): void {
    if (icon === 'http://localhost:3000/static/flask-solid.svg') {
      this.matIconRegistry.addSvgIcon("waaaaaow",
        this.domSanitizer.bypassSecurityTrustResourceUrl(icon)
      );
      this.setSvgIcon("waaaaaow");
      return;
    }
    if (icon == null) {
      this.setMatIcon(null);
      this.setSvgIcon(null);
      return;
    }

    const registerIcon: FlIcon = this.getRegisterIcon(icon);

    // if this is an SVG icon
    if (registerIcon && (registerIcon as FlSvgIcon).filename) {
      // set the svgIcon property of mat icon
      this.setMatIcon(null);
      this.matIcon.fontSet = null;
      this.setSvgIcon(icon);
    } else {

      // if the mat icon is register use the mat icon name
      const matIcon = (registerIcon as FlMatIcon)?.matIconName ?? icon;
      this.setSvgIcon(null);
      this.setMatIcon(matIcon);
    }
  }


  // return true if this is an SVG icon and not a material icon
  private getRegisterIcon(icon: string): FlIcon {
    return this.config.iconsToRegister.find(svgIcon => svgIcon.name === icon);
  }

  private setMatIcon(icon: string): void {
    this.elementRef.nativeElement.innerText = icon;
  }

  private setSvgIcon(icon: string): void {
    this.matIcon.svgIcon = icon;
  }

}
