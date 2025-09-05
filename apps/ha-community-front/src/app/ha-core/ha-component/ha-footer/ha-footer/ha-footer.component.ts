import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';

import { HaFooterSocialsComponent } from '../ha-footer-socials/ha-footer-socials.component';

@Component({
  selector: 'ha-footer',
  templateUrl: './ha-footer.component.html',
  imports: [
    MatIconModule,
    FlIconModule,
    NgOptimizedImage,
    HaFooterSocialsComponent,
    NgTemplateOutlet,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
  ],
  styleUrls: ['./ha-footer.component.scss'],
})
export class HaFooterComponent {
  isHomePage = input<boolean>(false);
}
