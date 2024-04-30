import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import {init} from 'emoji-mart';
import {Observable} from 'rxjs';
import {FL_PORTAL_DATA} from '../../../fl-portal/model/fl-portal.class';
import {FlOverlayRef} from '../../../fl-portal/model/fl-overlay-ref.class';
import {FlEmojiDatasource, FlEmojiHelper, FlSimpleEmoji} from '../../fl-emoji.helper';
import {FlKeyboardHelper, FlKeyboardKey} from '../../../../utils/fl-keyboard.helper';
import {ClHelpService} from '@monorepo/core-lib';
import {FlHtmlHelper} from '../../../../utils/fl-html.helper';

export interface FlEmojiPickerPortalInput {
  filter: Observable<string>;
  element: HTMLElement;
}

interface FlEmojiCoord {
  categoryIndex: number;
  index: number;
}

@Component({
  selector: 'fl-emoji-picker-portal-2',
  templateUrl: './fl-emoji-picker-portal-2.component.html',
  styleUrl: './fl-emoji-picker-portal-2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlEmojiPickerPortal2Component implements OnInit, OnDestroy {

  public static PORTAL_WIDTH = 400;

  input: FlEmojiPickerPortalInput = inject(FL_PORTAL_DATA);

  emojiCategories: FlEmojiDatasource = new FlEmojiDatasource();

  hoveredEmoji: FlEmojiCoord = {
    categoryIndex: 0,
    index: 0
  };

  private readonly nbOfEmojiPerLine = 10;
  private listener: () => void;

  constructor(private overlayRef: FlOverlayRef,
              private changeDetectorRef: ChangeDetectorRef,
              private renderer: Renderer2,
              private elementRef: ElementRef<HTMLElement>) {
  }

  async ngOnInit(): Promise<void> {
    init({data: FlEmojiHelper.getEmojiData()});

    this.input.filter.subscribe({
      next: (value: string) => {
        this.hoveredEmoji = {
          categoryIndex: 0,
          index: 0
        };
        this.emojiCategories.getFirstPage(value);
      },
      complete: () => this.overlayRef.dispose()
    });

    this.listener = this.renderer.listen(this.input.element, 'keydown',
      (event) => this.onKeydown(event));
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
    if (event.key === FlKeyboardKey.ARROW_DOWN) {
      this.hoveredEmoji = this.moveDown();
    } else if (event.key === FlKeyboardKey.ARROW_UP) {
      this.hoveredEmoji = this.moveUp();
    } else if (event.key === FlKeyboardKey.ARROW_LEFT) {
      this.hoveredEmoji = this.moveLeft();
    } else if (event.key === FlKeyboardKey.ARROW_RIGHT) {
      this.hoveredEmoji = this.moveRight();
    }
    ClHelpService.stopEventPropagation(event);

    this.scrollToHoveredEmoji();
  }

  private moveRight(): FlEmojiCoord {
    const coords: FlEmojiCoord = this.hoveredEmoji;
    const categories = this.emojiCategories.array;

    // if we stay in the same category
    if (categories[coords.categoryIndex].emojis.length > coords.index + 1) {
      return {
        categoryIndex: coords.categoryIndex,
        index: coords.index + 1
      };
      // if we go to the next category
    } else if (categories.length > coords.categoryIndex + 1) {
      return {
        categoryIndex: coords.categoryIndex + 1,
        index: 0
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
        index: coords.index - 1
      };
      // if we go to the previous category
    } else if (coords.categoryIndex > 0) {
      const newCategoryIndex = coords.categoryIndex - 1;
      return {
        categoryIndex: newCategoryIndex,
        index: categories[newCategoryIndex].emojis.length - 1
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
        index: coords.index + this.nbOfEmojiPerLine
      };
      // if we go to the next category
    } else if (categories.length > coords.categoryIndex + 1) {
      const newCategoryIndex = coords.categoryIndex + 1;
      return {
        categoryIndex: newCategoryIndex,
        index: coords.index % this.nbOfEmojiPerLine
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
        index: coords.index - this.nbOfEmojiPerLine
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
        index: newIndex
      };
    }
    return coords;
  }

  private scrollToHoveredEmoji(): void {
    const emojiElement: HTMLElement = this.elementRef.nativeElement.querySelector(
      `#emoji-${this.hoveredEmoji.categoryIndex}-${this.hoveredEmoji.index}`);
    if (!emojiElement) return;
    FlHtmlHelper.scrollElementToElementIfNotVisible(emojiElement);
  }

  private selectHoveredEmoji(): void {
    const emoji = this.getHoveredEmoji();
    if (emoji) {
      this.selectEmoji(emoji);
    }
  }

  private getHoveredEmoji(): FlSimpleEmoji {
    const categories = this.emojiCategories.array;
    if (categories[this.hoveredEmoji.categoryIndex]) {
      return categories[this.hoveredEmoji.categoryIndex].emojis[this.hoveredEmoji.index];
    }
    return null;

  }

  selectEmoji(emoji: FlSimpleEmoji): void {
    FlEmojiHelper.addInFrequency(emoji.id);
    this.overlayRef.dispose(emoji.emoji);
  }

  ngOnDestroy(): void {
    this.listener();
  }

}
