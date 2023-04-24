import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BnBioNetworkState} from '../../state/bn-bio-network.state';
import {filter} from 'rxjs/operators';
import {BnBioNetworkGraph} from '../../model/bn-bio-network-graph.class';
import {BnBioNetworkOptionsState, BnBioNetworkParticleColorScale} from '../../state/bn-bio-network-options.state';
import {BnBioNetworkMetaboliteLevel} from '../../model/bn-bio-network.class';
import {BnBioNetworkSelectionState} from '../../state/bn-bio-network-selection.state';

/**
 * Component inside the {@link BnBioNetworkComponent} to show the quick actions
 */
@Component({
  selector: 'bn-bio-network-action-bar',
  templateUrl: './bn-bio-network-action-bar.component.html',
  styleUrls: ['./bn-bio-network-action-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BnBioNetworkActionBarComponent implements OnInit {

  isReady: boolean = false;

  fluxThreshold: number = 0;
  maxFluxValue: number;

  // mode for the color of the particles
  particlesColorMode: BnBioNetworkParticleColorScale = 'linear';
  // showCofactor: boolean = false;
  showMinors: boolean = false;
  showText: boolean = false;
  showGrid: boolean = false;
  showArrows: boolean = false;
  showParticles: boolean = false;
  particleSize: number;
  particleDensityThreshold: number;
  particleSpeedThreshold: number;

  constructor(private cdr: ChangeDetectorRef,
              private state: BnBioNetworkState,
              private selectionState: BnBioNetworkSelectionState,
              private optionState: BnBioNetworkOptionsState) {
  }

  ngOnInit(): void {
    const options = this.optionState.getCurrentOptions();
    this.particlesColorMode = options.particleColorScale;
    // this.showCofactor = this.rendererState.getShowCofactors();
    this.showMinors = options.visibleLevels.includes(BnBioNetworkMetaboliteLevel.MINOR);
    this.showText = options.showTexts;
    this.showGrid = options.showGrid;
    this.showArrows = options.showArrows;
    this.showParticles = options.showParticles;
    this.particleSize = options.particleSize;
    this.particleDensityThreshold = options.particleDensityThreshold;
    this.particleSpeedThreshold = options.particleSpeedThreshold;

    this.state.getChartData$().subscribe(
      chartData => this.onNewData(chartData)
    );

    // clear the slider every time the selection is not a linkByValue
    this.selectionState.getSelectionMode$().pipe(
      filter(selection => selection.mode !== 'linkByValue')).subscribe(
      () => this.resetSlider()
    );
  }

  private onNewData(chartData: BnBioNetworkGraph): void {
    if (chartData) {
      this.maxFluxValue = Math.trunc(chartData.getLinksMaxAbsoluteValue());
      this.isReady = true;
    } else {
      this.maxFluxValue = 0;
      this.isReady = false;

    }
    this.cdr.markForCheck();
  }


  setParticlesColors(): void {
    this.optionState.setParticleColorMode(this.particlesColorMode);
  }

  toggleShowTexts(): void {
    this.optionState.setShowText(this.showText);
  }

  toggleShowGrid(): void {
    this.optionState.setShowGrid(this.showGrid);
  }

  toggleShowArrows(): void {
    this.optionState.setShowArrows(this.showArrows);
  }

  toggleShowParticles(): void {
    this.optionState.setShowParticles(this.showParticles);
  }

  particleSizeChange(): void {
    this.optionState.setParticleSize(this.particleSize);
  }

  toggleShowMinors(): void {
    this.optionState.setVisibleLevels(this.showMinors ?
      [BnBioNetworkMetaboliteLevel.MAJOR, BnBioNetworkMetaboliteLevel.MINOR] : [BnBioNetworkMetaboliteLevel.MAJOR]);
  }

  particleDensityThresholdChange(): void {
    this.optionState.setParticleDensityThreshold(this.particleDensityThreshold);
  }

  particleSpeedThresholdChange(): void {
    this.optionState.setParticleSpeedThreshold(this.particleSpeedThreshold);
  }

  // set opacity to 0.1 to link where abs value is lower than slider value
  fluxThresholdChange(value: number): void {
    this.selectionState.fluxThresholdOpacity(value);
  }

  private resetSlider(): void {
    this.fluxThreshold = 0;

    this.cdr.markForCheck();
  }


  exportAllNetwork(): void {
    this.state.downloadNetworkJson();
  }


}
