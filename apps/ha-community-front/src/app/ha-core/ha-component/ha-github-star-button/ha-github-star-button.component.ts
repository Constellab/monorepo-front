import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  Signal,
  ViewChild,
} from '@angular/core';
import { ClSubscriptionHandler, ClTheme } from '@monorepo/core-lib';
import { GitHubButtonProps } from 'github-buttons';

import { HaThemeState } from '../../ha-state/ha-theme.state';

@Component({
  selector: 'ha-github-star-button',
  imports: [],
  templateUrl: './ha-github-star-button.component.html',
  styleUrl: './ha-github-star-button.component.scss',
})
export class HaGithubStarButtonComponent implements AfterViewInit, OnDestroy {
  private renderer = inject(Renderer2);
  private themeState = inject(HaThemeState);
  private platformId = inject(PLATFORM_ID);

  repoUrl = input.required<string>();
  title = input<string>('Stars');
  icon = input<'octicon-star' | 'octicon-mark-github'>('octicon-star');

  validRepoUrl = computed(() => {
    const repo = this.repoUrl();
    return repo.replace('.git', '');
  });
  isDarkTheme: Signal<boolean> = this.themeState.isDarkTheme;

  @ViewChild('githubStarBtDiv', {
    static: true,
    read: ElementRef,
  })
  githubStarBtDiv: ElementRef<HTMLDivElement>;

  subscriptionHandler: ClSubscriptionHandler = new ClSubscriptionHandler();

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.isValidGithubRepo(this.validRepoUrl())) {
      import('github-buttons').then((module) => {
        this.renderButton(module, this.isDarkTheme() ? 'dark' : 'light');
        const themeSubscription = this.themeState.onThemeChange$.subscribe((theme: ClTheme) => {
          this.githubStarBtDiv.nativeElement.innerHTML = '';
          this.renderButton(module, theme === ClTheme.DARK_THEME ? 'dark' : 'light');
        });
        this.subscriptionHandler.add(themeSubscription);
      });
    }
  }

  private isValidGithubRepo(repo: string): boolean {
    // Check if repo is null and if repo respect the github repo url pattern with the last / optional,
    // example: https://github.com/Constellab/gws_core or https://github.com/Constellab/gws_core/
    if (repo == null) {
      return false;
    }
    return repo.match(/https:\/\/github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/?/g) != null;
  }

  renderButton(module: any, colorScheme: 'dark' | 'light'): void {
    // create the iframe element + place it in the div
    module.render(
      {
        href: this.validRepoUrl(),
        title: this.title(),
        'data-show-count': true,
        'data-color-scheme': colorScheme,
        'data-size': 'large',
        'data-icon': this.icon(),
        'data-text': 'Stars',
        'aria-label': 'Stars',
      } as GitHubButtonProps,
      (el: HTMLIFrameElement | HTMLSpanElement) => {
        this.renderer.appendChild(this.githubStarBtDiv.nativeElement, el);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptionHandler.unsubscribe();
  }
}
