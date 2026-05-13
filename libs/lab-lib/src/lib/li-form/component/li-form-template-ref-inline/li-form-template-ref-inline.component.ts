import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LiRouterService } from '@monorepo/lab-lib/li-core';

import { LiFormTemplateRef } from '../../../li-core/model/entities/form/li-form.entity';

@Component({
  selector: 'li-form-template-ref-inline',
  templateUrl: './li-form-template-ref-inline.component.html',
  styleUrl: './li-form-template-ref-inline.component.scss',
  imports: [RouterLink, MatIcon, FlIconModule],
})
export class LiFormTemplateRefInlineComponent {
  templateRef = input.required<LiFormTemplateRef>();
  showLink = input<boolean>(false);

  getVersionRoute(): string {
    const ref = this.templateRef();
    return LiRouterService.getFormTemplateVersionRoute(ref.templateId, ref.versionId);
  }
}
