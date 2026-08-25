import { FlHtmlHelper } from '@monorepo/front-core-lib/fl-core';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';

import { TeHelper } from '../model/te.helper';
import { TeKeyListener } from './te-key-listener.class';

/**
 * Class to simplify the creation of a plugin that opens a portal
 */
export abstract class TePortalPlugin {
  protected keyListener: TeKeyListener;
  protected textNode: Node;
  protected cursorOffset: number;

  private static OPEN_DELAY = 250;

  public init(): void {
    // do nothing if the overlay is open
    if (TeHelper.overlayIsOpen()) return;

    // store the current caret position
    const selection = window.getSelection();
    if (!selection) return;
    const range = selection.getRangeAt(0);
    this.textNode = range.endContainer;

    // special case, disable portal in code block
    const parentElement = this.textNode.parentElement;
    if (parentElement && FlHtmlHelper.getParent(parentElement, { tagName: 'te-code' })) return;

    // if the node is not a text node, create a new text node
    if (this.textNode.nodeType !== Node.TEXT_NODE) {
      const textNode = document.createTextNode('');
      this.textNode.appendChild(textNode);
      this.textNode = textNode;
    }

    this.cursorOffset = range.endOffset - 1;

    // check the next character, if it is not a space or undefined, we do nothing
    // it happens when the trigger key is pressed in the middle of a word
    // it doesn't work when the caret is before an inline element but it is not a big deal
    const nextCharacter = this.textNode.textContent?.[this.cursorOffset + 1];
    if (nextCharacter && nextCharacter !== ' ') return;

    this.keyListener = this.buildKeyListener();

    this.schedulePortalOpen();
  }

  /**
   * Schedule when the portal should be opened.
   * By default, waits a short delay then opens.
   * Subclasses can override to wait for additional conditions (e.g. first character typed).
   */
  protected schedulePortalOpen(): void {
    setTimeout(() => this.callPortal(), TePortalPlugin.OPEN_DELAY);
  }

  protected callPortal(): void {
    // if the key listener was completed, we do nothing
    // it happens when the stop key is pressed quickly after trigger key
    if (this.keyListener.isCompleted()) {
      return;
    }

    const overlayRef = this.openPortal();
    if (!overlayRef) return;

    // store the overlay reference
    TeHelper.setOverlay(overlayRef);

    overlayRef.detachments().subscribe((value: any) => {
      TeHelper.clearOverlay();

      this.onClose(value);

      // clean up
      this.keyListener.destroy();
    });
  }

  protected abstract buildKeyListener(): TeKeyListener;

  protected abstract openPortal(): FlOverlayRef | null;

  protected abstract onClose(value: any): void;
}
