import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlArticleComponent } from './component/fl-article/fl-article.component';
import { FlArticleContainerComponent } from './component/fl-article-container/fl-article-container.component';
import { FlArticleLeftSideComponent } from './component/fl-article-left-side/fl-article-left-side.component';
import {
  FlArticleRightSideComponent,
} from './component/fl-article-right-side/fl-article-right-side.component';

/**
 *  Module for article component to have an article like layout
 */
@NgModule({
  declarations: [
    FlArticleComponent,
    FlArticleContainerComponent,
    FlArticleLeftSideComponent,
    FlArticleRightSideComponent,
  ],
  exports: [
    FlArticleComponent,
    FlArticleContainerComponent,
    FlArticleLeftSideComponent,
    FlArticleRightSideComponent,
  ],
  imports: [CommonModule],
})
export class FlArticleModule {}
