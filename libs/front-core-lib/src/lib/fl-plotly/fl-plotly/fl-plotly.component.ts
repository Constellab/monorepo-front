import {
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FlPlotlyData } from '../plotly-data.class';

@Component({
  selector: 'fl-plotly',
  templateUrl: './fl-plotly.component.html',
  styleUrls: ['./fl-plotly.component.scss'],
  standalone: false,
})
export class FlPlotlyComponent implements OnInit, OnDestroy {
  @Input({ required: true }) data: FlPlotlyData;

  @Input() autoResize: boolean = true;

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private componentRef: ComponentRef<any>;

  async ngOnInit(): Promise<void> {
    const { FlPlotlyStandaloneComponent } = await import(
      '../fl-plotly-standalone/fl-plotly-standalone.component'
    );
    const componentRef = this.viewContainer.createComponent(FlPlotlyStandaloneComponent);
    componentRef.instance.data = this.data;
    componentRef.instance.autoResize = this.autoResize;
    this.componentRef = componentRef;
  }

  ngOnDestroy(): void {
    this.componentRef?.destroy();
  }
}
