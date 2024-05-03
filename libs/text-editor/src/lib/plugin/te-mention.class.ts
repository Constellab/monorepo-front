import {Observable} from 'rxjs';
import {ClPageI} from '@monorepo/core-lib';
import {
  FlHtmlHelper,
  FlKeyboardKey,
  FlPortalService,
  flRootInjector,
  FlTranslateService,
  FlUser
} from '@monorepo/front-core-lib';
import {TeKeyListener} from './te-key-listener.class';
import {
  TeMentionPortalComponent,
  TeMentionPortalInput
} from '../component/te-mention-portal/te-mention-portal.component';
import {TeHelper} from '../model/te.helper';
import {TeElementInlineDirective} from '../model/te-element.directive';
import {InlineTool, SanitizerConfig} from '@editorjs/editorjs';


export interface TeMentionConfig {
  getUsers: (search: string | null, page: number, size: number) => Observable<ClPageI<FlUser>>;
}

export const teMentionTagName = 'te-mention-inline';

export interface FlMentionUser {
  id: string;
  firstname: string;
  lastname: string;
}

export class TeMention {

  constructor(private config: TeMentionConfig, private event: KeyboardEvent) {
  }

  public openMentionPortal(): void {
    if (TeHelper.overlayIsOpen()) return;
    // store the current caret position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const textNode = range.endContainer;
    const cursorOffset = range.endOffset - 1;

    const keyListener = new TeKeyListener(textNode, cursorOffset,
      FlKeyboardKey.AT,
      [FlKeyboardKey.ESCAPE, FlKeyboardKey.SPACE]);

    const input: TeMentionPortalInput = {
      config: this.config,
      element: this.event.target as any,
      filter$: keyListener.getText$()
    };

    const portalService = flRootInjector.get(FlPortalService);

    const portalPosition = TeHelper.getPortalPositionForCursor(TeMentionPortalComponent.PORTAL_MAX_WIDTH);

    const config = portalService.configureAbsolutePortal(portalPosition,
      {disposeOnOutsideClick: true, disposeOnNavigation: true});

    // open the emoji picker
    const overlayRef = portalService.createPortal(TeMentionPortalComponent, config, input);

    overlayRef.detachments().subscribe(
      (user?: FlUser) => {
        TeHelper.clearOverlay();

        if (user) {

          // replace the search text with mention element
          const positions = keyListener.getSearchTextPosition();
          const mentionElement = this.createMentionElement(user);
          FlHtmlHelper.replaceTextInNodeTextWithElement(textNode,
            positions.start, positions.end, mentionElement);

          // move the caret just after the emoji
          FlHtmlHelper.setCaretAtElementPosition(mentionElement.nextSibling, 0);
        }

        keyListener.destroy();
      }
    );

    TeHelper.setOverlay(overlayRef);
  }

  private createMentionElement(user: FlUser): HTMLElement {

    const mentionUser: FlMentionUser = {id: user.id, firstname: user.firstname, lastname: user.lastname};
    const mentionElement = document.createElement(teMentionTagName);
    mentionElement.setAttribute(TeElementInlineDirective.dataAttribute, JSON.stringify(mentionUser));
    return mentionElement;
  }
}

/**
 * Fake inline tool to allow to sanitize the mention element
 */
export class TeMentionInlineTool implements InlineTool {

  static get title(): string {
    return flRootInjector.get(FlTranslateService).translate('teTextEditor.variable');
  }

  static get isInline(): boolean {
    return true;
  }

  public static get sanitize(): SanitizerConfig {
    return {
      [teMentionTagName]: {
        'data-jsondata': true,
      }
    } as SanitizerConfig;
  }

  checkState(): boolean {
    return false;
  }

  public render(): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'none';
    return div;
  }

  surround(): void {
  }
}
