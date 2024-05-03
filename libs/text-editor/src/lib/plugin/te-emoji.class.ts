import {TeKeyListener} from './te-key-listener.class';
import {
  FlEmojiPickerPortal2Component,
  FlEmojiPickerPortalInput,
  FlHtmlHelper,
  FlKeyboardKey,
  FlPortalService,
  flRootInjector
} from '@monorepo/front-core-lib';
import {TeHelper} from '../model/te.helper';


export class TeEmoji {

  constructor(private event: KeyboardEvent) {
  }

  public openEmojiPicker(): void {
    if (TeHelper.overlayIsOpen()) return;
    // store the current caret position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    let node = range.endContainer;
    const cursorOffset = range.endOffset - 1;

    // if the node is not a text node, create a new text node
    if (node.nodeType !== Node.TEXT_NODE) {
      const textNode = document.createTextNode('');
      node.appendChild(textNode);
      node = textNode;
    }

    const keyListener = new TeKeyListener(node, cursorOffset,
      FlKeyboardKey.COLON,
      [FlKeyboardKey.ESCAPE, FlKeyboardKey.SPACE]);

    const input: FlEmojiPickerPortalInput = {
      filter: keyListener.getText$(),
      element: this.event.target as any
    };


    // open portal
    const portalService = flRootInjector.get(FlPortalService);
    const portalPosition = TeHelper.getPortalPositionForCursor(FlEmojiPickerPortal2Component.PORTAL_WIDTH);
    const config = portalService.configureAbsolutePortal(portalPosition,
      {disposeOnOutsideClick: true, disposeOnNavigation: true});

    // open the emoji picker
    const overlayRef = portalService.createPortal(FlEmojiPickerPortal2Component, config, input);


    overlayRef.detachments().subscribe(
      (emoji: string) => {
        TeHelper.clearOverlay();

        if (emoji) {
          // replace the search text with the emoji
          const positions = keyListener.getSearchTextPosition();
          node.textContent = node.textContent.slice(0, positions.start) + emoji +
            node.textContent.slice(positions.end);

          // move the caret just after the emoji
          // +2 otherwise the cursor seems to be inside the emoji
          FlHtmlHelper.setCaretAtElementPosition(node, cursorOffset + 2);
        }

        // clean up
        keyListener.destroy();
      }
    );

    TeHelper.setOverlay(overlayRef);
  }
}
