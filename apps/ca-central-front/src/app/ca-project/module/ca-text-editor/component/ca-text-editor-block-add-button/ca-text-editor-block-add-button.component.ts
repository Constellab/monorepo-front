import {Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {CaTextEditorBlockAddButton} from '../../model/ca-text-editor.class';

import {ClHelpService} from '@monorepo/core-lib';
import {FL_PORTAL_DATA, FlOverlayRef, FlPortalService} from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-text-editor-block-add-button',
  templateUrl: './ca-text-editor-block-add-button.component.html',
  styleUrls: ['./ca-text-editor-block-add-button.component.scss']
})
export class CaTextEditorBlockAddButtonComponent implements OnInit, OnDestroy {

  showMenu: boolean;

  buttons: CaTextEditorBlockAddButton[];

  childrenButtons: CaTextEditorBlockAddButton[];

  @ViewChild('submenu') subMenu: TemplateRef<unknown>;


  private subMenuOverlay: FlOverlayRef;

  constructor(@Inject(FL_PORTAL_DATA) buttons: CaTextEditorBlockAddButton[],
              private portalService: FlPortalService,
              private _viewContainerRef: ViewContainerRef) {
    this.buttons = buttons;
  }

  ngOnInit(): void {
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  get icon(): string {
    return this.showMenu ? 'clear' : 'add';
  }

  onAction(button: CaTextEditorBlockAddButton, event: any): void {
    if (!button.onAction) return;
    button.onAction(event);
    this.closeMenu();
  }

  closeMenu(): void {
    this.showMenu = false;
    this.closeSubMenuOverlay();
  }

  openSubMenu(button: CaTextEditorBlockAddButton, ev: MouseEvent): void {
    this.closeSubMenuOverlay();
    if (ClHelpService.isNullOrEmpty(button.children)) return;

    this.childrenButtons = button.children;
    const config = this.portalService.configureRelativePortalFromMouseEvent(ev, ['bottom', 'top']);
    this.subMenuOverlay = this.portalService.createPortalTemplate(this.subMenu, config, this._viewContainerRef);
  }

  closeSubMenuOverlay(): void {
    this.subMenuOverlay?.dispose();
    this.subMenuOverlay = null;
  }

  ngOnDestroy(): void {
    this.closeSubMenuOverlay();
  }


}
