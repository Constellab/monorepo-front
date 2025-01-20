import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Observable } from 'rxjs';
import { FL_PORTAL_DATA } from '../../../fl-portal/model/fl-portal.class';
import { FlOverlayRef } from '../../../fl-portal/model/fl-overlay-ref.class';
import { FlEmojiDatasource, FlEmojiHelper, FlSimpleEmoji } from '../../fl-emoji.helper';
import { FlKeyboardHelper, FlKeyboardKey } from '../../../../utils/fl-keyboard.helper';
import { ClHelpService } from '@monorepo/core-lib';
import { FlHtmlHelper } from '../../../../utils/fl-html.helper';

export interface FlEmojiPickerPortalInput {
  filter: Observable<string>;
  element: HTMLElement;
}

interface FlEmojiCoord {
  categoryIndex: number;
  index: number;
}

@Component({
    selector: 'fl-emoji-picker-portal',
    templateUrl: './fl-emoji-picker-portal.component.html',
    styleUrl: './fl-emoji-picker-portal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FlEmojiPickerPortalComponent implements OnInit, OnDestroy {
  public static PORTAL_MAX_WIDTH = 400;
  public static PORTAL_MAX_HEIGHT = 420;
  public static SELECTED_CLASS = 'selected';

  input: FlEmojiPickerPortalInput = inject(FL_PORTAL_DATA);

  emojiCategories: FlEmojiDatasource = new FlEmojiDatasource();

  hoveredEmoji: FlEmojiCoord = null;

  private readonly nbOfEmojiPerLine = 10;
  private listener: () => void;

  constructor(
    private overlayRef: FlOverlayRef,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  async ngOnInit(): Promise<void> {
    this.input.filter.subscribe({
      next: (value: string) => {
        // we use a timeout to let the HTML load
        setTimeout(() => {
          this.unhoverCurrentEmoji();
          this.hoverEmoji({ categoryIndex: 0, index: 0 });
        }, 0);
        this.emojiCategories.getFirstPage({ text: value });
      },
      complete: () => this.overlayRef.dispose(),
    });

    this.listener = this.renderer.listen(this.input.element, 'keydown', (event) => this.onKeydown(event));
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.key === FlKeyboardKey.ESCAPE) {
      this.overlayRef.dispose();
    } else if (event.key === FlKeyboardKey.ENTER) {
      this.selectHoveredEmoji();
      ClHelpService.stopEventPropagation(event);
    } else if (FlKeyboardHelper.keyIsArrow(event.key)) {
      this.moveHoveredEmojiIndex(event);
    }
    this.changeDetectorRef.markForCheck();
  }

  private moveHoveredEmojiIndex(event: KeyboardEvent): void {
    this.unhoverCurrentEmoji();

    let newCoords: FlEmojiCoord = null;
    if (event.key === FlKeyboardKey.ARROW_DOWN) {
      newCoords = this.moveDown();
    } else if (event.key === FlKeyboardKey.ARROW_UP) {
      newCoords = this.moveUp();
    } else if (event.key === FlKeyboardKey.ARROW_LEFT) {
      newCoords = this.moveLeft();
    } else if (event.key === FlKeyboardKey.ARROW_RIGHT) {
      newCoords = this.moveRight();
    }
    ClHelpService.stopEventPropagation(event);

    this.hoverEmoji(newCoords);
  }

  private hoverEmoji(coord: FlEmojiCoord): void {
    if (!coord) return;
    const newSelectedElement = this.getEmojiElementByCoord(coord);
    if (newSelectedElement) {
      this.renderer.addClass(newSelectedElement, FlEmojiPickerPortalComponent.SELECTED_CLASS);
      // scroll to selected element
      FlHtmlHelper.scrollElementToElementIfNotVisible(newSelectedElement);
    }

    this.hoveredEmoji = coord;
  }

  private unhoverCurrentEmoji(): void {
    if (this.hoveredEmoji) {
      const currentEmoji = this.getEmojiElementByCoord(this.hoveredEmoji);
      if (currentEmoji) {
        this.renderer.removeClass(currentEmoji, FlEmojiPickerPortalComponent.SELECTED_CLASS);
      }
    }
  }

  private moveRight(): FlEmojiCoord {
    const coords: FlEmojiCoord = this.hoveredEmoji;
    const categories = this.emojiCategories.array;

    // if we stay in the same category
    if (categories[coords.categoryIndex].emojis.length > coords.index + 1) {
      return {
        categoryIndex: coords.categoryIndex,
        index: coords.index + 1,
      };
      // if we go to the next category
    } else if (categories.length > coords.categoryIndex + 1) {
      return {
        categoryIndex: coords.categoryIndex + 1,
        index: 0,
      };
    }
    return coords;
  }

  private moveLeft(): FlEmojiCoord {
    const coords: FlEmojiCoord = this.hoveredEmoji;
    const categories = this.emojiCategories.array;

    // if we stay in the same category
    if (coords.index > 0) {
      return {
        categoryIndex: coords.categoryIndex,
        index: coords.index - 1,
      };
      // if we go to the previous category
    } else if (coords.categoryIndex > 0) {
      const newCategoryIndex = coords.categoryIndex - 1;
      return {
        categoryIndex: newCategoryIndex,
        index: categories[newCategoryIndex].emojis.length - 1,
      };
    }
    return coords;
  }

  private moveDown(): FlEmojiCoord {
    const coords: FlEmojiCoord = this.hoveredEmoji;
    const categories = this.emojiCategories.array;

    // if we stay in the same category
    if (categories[coords.categoryIndex].emojis.length > coords.index + this.nbOfEmojiPerLine) {
      return {
        categoryIndex: coords.categoryIndex,
        index: coords.index + this.nbOfEmojiPerLine,
      };
      // if we go to the next category
    } else if (categories.length > coords.categoryIndex + 1) {
      const newCategoryIndex = coords.categoryIndex + 1;
      return {
        categoryIndex: newCategoryIndex,
        index: coords.index % this.nbOfEmojiPerLine,
      };
    }
    return coords;
  }

  private moveUp(): FlEmojiCoord {
    const coords: FlEmojiCoord = this.hoveredEmoji;
    const categories = this.emojiCategories.array;

    // if we stay in the same category
    if (coords.index >= this.nbOfEmojiPerLine) {
      return {
        categoryIndex: coords.categoryIndex,
        index: coords.index - this.nbOfEmojiPerLine,
      };
      // if we go to the previous category
    } else if (coords.categoryIndex > 0) {
      const newCategoryIndex = coords.categoryIndex - 1;
      const newCategory = categories[newCategoryIndex];
      const currentColumn = coords.index % this.nbOfEmojiPerLine;

      // find the last emoji in the previous category that is on the same column
      let newIndex = newCategory.emojis.length - 1;
      while (newIndex > 0) {
        if (newIndex % this.nbOfEmojiPerLine === currentColumn) {
          break;
        }
        newIndex--;
      }

      return {
        categoryIndex: newCategoryIndex,
        index: newIndex,
      };
    }
    return coords;
  }

  private selectHoveredEmoji(): void {
    const emoji = this.getHoveredEmoji();
    if (emoji) {
      this.selectEmoji(emoji);
    }
  }

  private getHoveredEmoji(): FlSimpleEmoji | null {
    if (!this.hoveredEmoji) return null;
    return this.getEmojiByCoord(this.hoveredEmoji);
  }

  private getEmojiByCoord(coord: FlEmojiCoord): FlSimpleEmoji | null {
    const categories = this.emojiCategories.array;
    if (categories[coord.categoryIndex]) {
      return categories[coord.categoryIndex].emojis[coord.index];
    }
    return null;
  }

  private getEmojiElementByCoord(coord: FlEmojiCoord): HTMLElement | null {
    const emoji = this.getEmojiByCoord(coord);
    if (emoji) {
      return this.elementRef.nativeElement.querySelector(`#${emoji.htmlId}`);
    }
    return null;
  }

  private selectEmoji(emoji: FlSimpleEmoji): void {
    FlEmojiHelper.addInFrequency(emoji.id);
    this.overlayRef.dispose(emoji.emoji);
  }

  /**
   * On click on the parent element, we check if the click is on an emoji
   * We use this to avoid creating a listener for each emoji for performance
   * @param event
   */
  onParentClick(event: MouseEvent): void {
    const emojiSpan = FlHtmlHelper.getParent(event.target as HTMLElement, { className: 'emoji' });

    if (emojiSpan) {
      const emojiId = emojiSpan.getAttribute('id');
      const emoji = this.emojiCategories.findByHtmlId(emojiId);
      if (emoji) {
        this.selectEmoji(emoji);
      }
    }
  }

  ngOnDestroy(): void {
    this.listener();
  }
}
