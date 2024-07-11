import {Directive, ElementRef, Host, Inject, Input, PLATFORM_ID} from '@angular/core';
import {MatIcon, MatIconRegistry} from '@angular/material/icon';
import {FL_ICON_MODULE, FlIcon, FlIconConfig, FlMatIcon, FlSvgIcon} from '../fl-icon-config.class';
import {DomSanitizer} from '@angular/platform-browser';
import {isPlatformServer} from '@angular/common';

/**
 * directive to be placed on a mat-icon. It set the icon and support both
 * mat icon and svg icon
 */
@Directive({
  selector: 'mat-icon[flIcon]'
})
export class FlIconDirective {

  @Input({required: true}) set flIcon(flIcon: string) {
    this.setIcon(flIcon);
  }

  /**
   * Use to store the dynamic registered icons
   * Where the key is the url of the icon and the value is the name of the icon
   */
  private static dynamicRegisteredIcons: Record<string, string> = {};

  constructor(@Host() private matIcon: MatIcon,
              @Inject(FL_ICON_MODULE) private config: FlIconConfig,
              private elementRef: ElementRef<HTMLElement>,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              @Inject(PLATFORM_ID) private platformId: any) {
  }

  private setIcon(icon: string): void {
    if (icon == null || isPlatformServer(this.platformId)) {
      this.setMatIcon(null);
      this.setSvgIcon(null);
      return;
    }

    if (icon.startsWith('https://') || icon.startsWith('http://')) {
      if (!FlIconDirective.dynamicRegisteredIcons[icon]) {
        const name = `dynamic_icon_${Object.keys(FlIconDirective.dynamicRegisteredIcons).length}`;
        this.matIconRegistry.addSvgIcon(name, this.domSanitizer.bypassSecurityTrustResourceUrl(icon));
        FlIconDirective.dynamicRegisteredIcons[icon] = name;
      }

      this.setSvgIcon(FlIconDirective.dynamicRegisteredIcons[icon]);
      return;
    }

    const registerIcon: FlIcon = this.getRegisterIcon(icon);

    console.log(icon, registerIcon)
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
    console.log(this.config.iconsToRegister, icon)
    return this.config.iconsToRegister.find(svgIcon => svgIcon.name === icon);
  }

  private setMatIcon(icon: string): void {
    this.elementRef.nativeElement.innerText = icon;
  }

  private setSvgIcon(icon: string): void {
    this.matIcon.svgIcon = icon;
  }

}
