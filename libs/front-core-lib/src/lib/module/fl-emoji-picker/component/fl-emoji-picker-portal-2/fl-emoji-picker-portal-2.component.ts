import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {init} from 'emoji-mart';
import {Observable} from 'rxjs';
import {FL_PORTAL_DATA} from '../../../fl-portal/model/fl-portal.class';
import {FlOverlayRef} from '../../../fl-portal/model/fl-overlay-ref.class';
import {FlEmojiDatasource, FlEmojiHelper} from '../../fl-emoji-datasource.class';
import {FlKeyboardKey} from '../../../../utils/fl-keyboard.helper';
import {ClHelpService} from '@monorepo/core-lib';
import {Emoji} from '@emoji-mart/data';

export interface FlEmojiPickerPortalInput {
  filter: Observable<string>;
  element: HTMLElement;
}

@Component({
  selector: 'fl-emoji-picker-portal-2',
  templateUrl: './fl-emoji-picker-portal-2.component.html',
  styleUrl: './fl-emoji-picker-portal-2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlEmojiPickerPortal2Component implements OnInit, OnDestroy {

  public static PORTAL_WIDTH = 400;

  @ViewChild('container', {static: true}) container: ElementRef<HTMLElement>;

  input: FlEmojiPickerPortalInput = inject(FL_PORTAL_DATA);

  emojis: FlEmojiDatasource = new FlEmojiDatasource();

  selectedEmojiIndex: number = 0;

  private readonly nbOfEmojiPerLine = 10;
  private listener: () => void;

  constructor(private overlayRef: FlOverlayRef,
              private changeDetectorRef: ChangeDetectorRef,
              private renderer: Renderer2) {
  }

  async ngOnInit(): Promise<void> {
    init({data: FlEmojiHelper.getEmojiData()});

    this.input.filter.subscribe({
      next: (value: string) => {
        // specific case to support the base smiley
        if (value === ')') value = ':)';
        this.emojis.getFirstPage(value);
        this.selectedEmojiIndex = 0;
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
      this.selectEmojiIndex(this.selectedEmojiIndex);
      ClHelpService.stopEventPropagation(event);
    } else if (event.key === FlKeyboardKey.ARROW_DOWN) {
      this.selectedEmojiIndex = Math.min(this.selectedEmojiIndex + this.nbOfEmojiPerLine, this.emojis.array.length - 1);
      ClHelpService.stopEventPropagation(event);
    } else if (event.key === FlKeyboardKey.ARROW_UP) {
      this.selectedEmojiIndex = Math.max(this.selectedEmojiIndex - this.nbOfEmojiPerLine, 0);
      ClHelpService.stopEventPropagation(event);
    } else if (event.key === FlKeyboardKey.ARROW_LEFT) {
      this.selectedEmojiIndex = Math.max(this.selectedEmojiIndex - 1, 0);
      ClHelpService.stopEventPropagation(event);
    } else if (event.key === FlKeyboardKey.ARROW_RIGHT) {
      this.selectedEmojiIndex = Math.min(this.selectedEmojiIndex + 1, this.emojis.array.length - 1);
      ClHelpService.stopEventPropagation(event);
    }
    this.changeDetectorRef.markForCheck();
  }

  private selectEmojiIndex(index: number): void {
    if (this.emojis.array[index]) {
      this.selectEmoji(this.emojis.array[index]);
    }
  }

  selectEmoji(emoji: Emoji): void {
    FlEmojiHelper.addInFrequency(emoji.id);
    this.overlayRef.dispose(emoji);
  }

  ngOnDestroy(): void {
    this.listener();
  }

}
