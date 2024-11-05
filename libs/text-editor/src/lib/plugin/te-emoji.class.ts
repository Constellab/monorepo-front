import { TeKeyListener } from './te-key-listener.class';
import {
  FlEmojiPickerPortalComponent,
  FlEmojiPickerPortalInput,
  FlHtmlHelper,
  FlKeyboardKey,
  FlOverlayRef,
  FlPortalService,
  flRootInjector,
} from '@monorepo/front-core-lib';
import { TeHelper } from '../model/te.helper';
import { TePortalPlugin } from './te-portal-plugin.class';

export class TeEmoji extends TePortalPlugin {
  constructor(private event: KeyboardEvent) {
    super();
  }

  protected buildKeyListener(): TeKeyListener {
    return new TeKeyListener(this.textNode, this.cursorOffset, FlKeyboardKey.COLON, [
      FlKeyboardKey.ESCAPE,
      FlKeyboardKey.SPACE,
    ]);
  }

  protected onClose(emoji: string): void {
    if (emoji) {
      // replace the search text with the emoji
      const positions = this.keyListener.getSearchTextPosition();
      this.textNode.textContent =
        this.textNode.textContent.slice(0, positions.start) +
        emoji +
        this.textNode.textContent.slice(positions.end);

      // move the caret just after the emoji
      // +2 otherwise the cursor seems to be inside the emoji
      FlHtmlHelper.setCaretAtElementPosition(this.textNode, this.cursorOffset + 2);
    }
  }

  protected openPortal(): FlOverlayRef {
    const input: FlEmojiPickerPortalInput = {
      filter: this.keyListener.getText$(),
      element: this.event.target as any,
    };

    // open portal
    const portalService = flRootInjector.get(FlPortalService);
    const portalPosition = TeHelper.getPortalPositionForCursor(
      FlEmojiPickerPortalComponent.PORTAL_MAX_WIDTH,
      FlEmojiPickerPortalComponent.PORTAL_MAX_HEIGHT
    );
    const config = portalService.configureAbsolutePortal(portalPosition, {
      disposeOnOutsideClick: true,
      disposeOnNavigation: true,
    });

    // open the emoji picker
    return portalService.createPortal(FlEmojiPickerPortalComponent, config, input);
  }
}
