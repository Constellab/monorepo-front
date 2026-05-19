import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FlOverlayRef, FlPortalService } from '@monorepo/front-core-lib/fl-portal';

import { TdParamSpecEntry } from '../../model/td-config-spec.class';
import {
  tdBuildFieldSpecMap,
  TdExpressionFieldSegment,
  TdParsedExpression,
} from './td-expression-display.helper';

@Component({
  selector: 'td-expression-display',
  templateUrl: './td-expression-display.component.html',
  styleUrl: './td-expression-display.component.scss',
  standalone: false,
})
export class TdExpressionDisplayComponent implements OnDestroy {
  private portalService = inject(FlPortalService);
  private viewContainerRef = inject(ViewContainerRef);

  expression = input.required<string>();
  fieldSpecs = input<TdParamSpecEntry[]>([]);
  outerFieldSpecs = input<TdParamSpecEntry[]>([]);

  @ViewChild('tooltipTemplate', { static: true }) tooltipTemplate: TemplateRef<any>;

  readonly tooltipSpec = signal<TdParamSpecEntry | null>(null);
  readonly tooltipIsOuter = signal(false);

  readonly fieldSpecMap = computed(() => tdBuildFieldSpecMap(this.fieldSpecs()));
  readonly outerFieldSpecMap = computed(() => tdBuildFieldSpecMap(this.outerFieldSpecs()));

  readonly segments = computed(() => {
    const text = this.expression();
    if (!text) return [];
    return new TdParsedExpression(text, this.fieldSpecMap(), this.outerFieldSpecMap()).getSegments();
  });

  private tooltipOverlayRef: FlOverlayRef | null = null;

  showTooltip(target: HTMLElement, segment: TdExpressionFieldSegment): void {
    if (!segment.entry || this.tooltipOverlayRef) return;

    this.tooltipSpec.set(segment.entry);
    this.tooltipIsOuter.set(segment.isOuter);
    const config = this.portalService.configureRelativePortal(target, ['top', 'bottom'], {
      disposeOnOutsideClick: false,
    });
    this.tooltipOverlayRef = this.portalService.createPortalTemplate(
      this.tooltipTemplate,
      config,
      this.viewContainerRef
    );
    this.tooltipOverlayRef.detachments().subscribe(() => {
      this.tooltipOverlayRef = null;
      this.tooltipSpec.set(null);
    });
  }

  hideTooltip(): void {
    this.closeTooltip();
  }

  ngOnDestroy(): void {
    this.closeTooltip();
  }

  private closeTooltip(): void {
    this.tooltipOverlayRef?.dispose();
  }
}
