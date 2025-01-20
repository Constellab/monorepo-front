import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  FL_PORTAL_DATA,
  FlEntityPaginatedDatasource,
  FlKeyboardHelper,
  FlKeyboardKey,
  FlOverlayRef,
  FlUser,
  FlUserDatasource,
} from '@monorepo/front-core-lib';
import { ClHelpService } from '@monorepo/core-lib';
import { Observable } from 'rxjs';
import { TeMentionConfig, TeMentionSearchFilter } from '../../plugin/te-mention.class';

export interface TeMentionPortalInput {
  config: TeMentionConfig;
  filter$: Observable<string>;
  element: HTMLElement;
  caretCoordinates: { top: number; left: number };
}

@Component({
    selector: 'te-mention-portal',
    templateUrl: './te-mention-portal.component.html',
    styleUrl: './te-mention-portal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TeMentionPortalComponent implements OnInit, OnDestroy {
  public static PORTAL_MAX_WIDTH = 400;
  public static PORTAL_MAX_HEIGHT = 300;

  users$: FlUserDatasource<TeMentionSearchFilter>;

  input: TeMentionPortalInput = inject(FL_PORTAL_DATA);

  hoveredIndex: number = 0;
  private listener: () => void;

  constructor(
    private overlayRef: FlOverlayRef,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.users$ = new FlEntityPaginatedDatasource(
      (page, pageSize, requestData) => this.input.config.getUsers(requestData, page, pageSize),
      20,
      { initFirstPage: false }
    );

    this.input.filter$.subscribe({
      next: (value: string) => {
        this.hoveredIndex = 0;
        this.users$.getFirstPage({ text: value });
      },
      complete: () => this.overlayRef.dispose(),
    });

    this.listener = this.renderer.listen(this.input.element, 'keydown', (event) => this.onKeydown(event));

    this.users$.connect().subscribe(() => this.recalculatePortalPosition());
  }

  selectHoveredUser(): void {
    const user = this.users$.array[this.hoveredIndex];
    if (user) {
      this.selectUser(user);
    }
  }

  selectUser(user: FlUser): void {
    this.overlayRef.dispose(user);
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.key === FlKeyboardKey.ESCAPE) {
      this.overlayRef.dispose();
    } else if (event.key === FlKeyboardKey.ENTER) {
      this.selectHoveredUser();
      ClHelpService.stopEventPropagation(event);
    } else if (FlKeyboardHelper.keyIsArrow(event.key)) {
      this.moveHoveredIndex(event);
    }
    this.changeDetectorRef.markForCheck();
  }

  private moveHoveredIndex(event: KeyboardEvent): void {
    if (this.users$.array.length === 0) return;
    if (event.key === FlKeyboardKey.ARROW_DOWN) {
      this.hoveredIndex = Math.min(this.hoveredIndex + 1, this.users$.array.length - 1);
    } else if (event.key === FlKeyboardKey.ARROW_UP) {
      this.hoveredIndex = Math.max(this.hoveredIndex - 1, 0);
    }
    ClHelpService.stopEventPropagation(event);
  }

  /**
   * Recalculate the portal position only if the portal is above the cursor.
   * So the portal is always stick to cursor
   * @private
   */
  private recalculatePortalPosition(): void {
    setTimeout(() => {
      const caretCoordinates = this.input.caretCoordinates;

      // if the portal has enough space to be bellow the caret, do nothing
      if (caretCoordinates.top + TeMentionPortalComponent.PORTAL_MAX_HEIGHT + 20 < window.innerHeight) return;

      // set the element just above the caret
      const element: HTMLElement = this.overlayRef.getPanelElement() as HTMLElement;
      element.style.marginTop = `${caretCoordinates.top - element.clientHeight - 20}px`;
    }, 0);
  }

  ngOnDestroy(): void {
    this.users$.disconnect();
    if (this.listener) {
      this.listener();
    }
  }
}
