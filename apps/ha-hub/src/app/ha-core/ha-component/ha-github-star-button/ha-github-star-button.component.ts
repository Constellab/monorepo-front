import {Component, Inject, Input, OnInit, PLATFORM_ID, Renderer2} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {GitHubButtonProps} from 'github-buttons';
import {FlThemeService} from '@monorepo/front-core-lib';

@Component({
  selector: 'ha-github-star-button',
  standalone: true,
  imports: [],
  templateUrl: './ha-github-star-button.component.html',
  styleUrl: './ha-github-star-button.component.scss'
})
export class HaGithubStarButtonComponent implements OnInit{

  @Input({required: true}) repo: string;
  @Input() title: string = 'Stars';
  @Input() icon: 'octicon-star' | 'octicon-mark-github' =  'octicon-star';

  constructor(private renderer: Renderer2,
              @Inject(PLATFORM_ID) private platformId: object,
              private themeService: FlThemeService) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && this.isValidGithubRepo(this.repo)) {
      this.renderButton();
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

  private renderButton(): void {
    // TODO: check theme dynamically to update button theme on theme change
    const colorScheme = this.themeService.isDarkTheme() ? 'dark' : 'light';

    import('github-buttons').then((module) => {
      const githubButtonDiv = document.getElementById('github-star-bt-div');
      // create the iframe element + place it in the div
      module.render({
        'href': this.repo,
        'title': this.title,
        'data-show-count': true,
        'data-color-scheme': colorScheme,
        'data-size': 'large',
        'data-icon': this.icon,
        'data-text': 'Stars',
        'aria-label': 'Stars'
      } as GitHubButtonProps, (el: HTMLIFrameElement | HTMLSpanElement) => {
        this.renderer.appendChild(githubButtonDiv, el);
      })
    });
  }
}
