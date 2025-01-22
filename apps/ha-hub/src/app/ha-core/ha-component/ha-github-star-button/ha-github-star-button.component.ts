import { Component, Input, OnInit, PLATFORM_ID, Renderer2, Signal, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GitHubButtonProps } from 'github-buttons';
import { HaThemeState } from '../../ha-state/ha-theme.state';
import { ClTheme } from '@monorepo/core-lib';

@Component({
  selector: 'ha-github-star-button',
  imports: [],
  templateUrl: './ha-github-star-button.component.html',
  styleUrl: './ha-github-star-button.component.scss',
})
export class HaGithubStarButtonComponent implements OnInit {
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);
  private themeState = inject(HaThemeState);

  @Input({ required: true }) repo: string;
  @Input() title: string = 'Stars';
  @Input() icon: 'octicon-star' | 'octicon-mark-github' = 'octicon-star';

  isDarkTheme: Signal<boolean> = this.themeState.isDarkTheme;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && this.isValidGithubRepo(this.repo)) {
      this.renderButton(this.isDarkTheme() ? 'dark' : 'light');
      this.themeState.onThemeChange$.subscribe((theme) => {
        this.renderButton(theme == ClTheme.DARK_THEME ? 'dark' : 'light');
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

  renderButton(colorScheme: 'dark' | 'light'): void {
    // TODO: check theme dynamically to update button theme on theme change
    import('github-buttons').then((module) => {
      // create the iframe element + place it in the div
      module.render(
        {
          href: this.repo,
          title: this.title,
          'data-show-count': true,
          'data-color-scheme': colorScheme,
          'data-size': 'large',
          'data-icon': this.icon,
          'data-text': 'Stars',
          'aria-label': 'Stars',
        } as GitHubButtonProps,
        (el: HTMLIFrameElement | HTMLSpanElement) => {
          const githubButtonDiv = document.getElementById('github-star-bt-div');
          githubButtonDiv.innerHTML = '';
          this.renderer.appendChild(githubButtonDiv, el);
        }
      );
    });
  }
}
