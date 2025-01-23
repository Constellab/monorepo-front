import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BnBioNetworkClusterSelection, BnBioNetworkMetaboliteLevel } from '../model/bn-bio-network.class';

/**
 * Type of scale to use to color link based on its value
 * normal --> normal linear scale
 * log --> logarithmic scale
 */
export type BnBioNetworkParticleColorScale = 'linear' | 'log2' | 'log10' | 'threshold-75' | 'threshold-95';

export type BnBioNetworkOptionsAction =
  | 'init'
  | 'toggleText'
  | 'toggleGrid'
  | 'toggleArrow'
  | 'particles'
  | 'updateVisibilityLevel'
  | 'color';

/**
 * Object containing options visible element on the pathways
 */
export type BnBioNetworkOptions = {
  action: BnBioNetworkOptionsAction;
  visibleLevels: BnBioNetworkMetaboliteLevel[];
  showTexts: boolean;
  showGrid: boolean;
  showArrows: boolean;
  showParticles: boolean;
  particleSize: number;
  particleDensityThreshold: number; // threshold to normalize density of particles
  particleSpeedThreshold: number; // threshold to normalize speed of particles
  particleColorScale: BnBioNetworkParticleColorScale;
  coloredClusters: BnBioNetworkClusterSelection[];
};

@Injectable()
export class BnBioNetworkOptionsState implements OnDestroy {
  private option$: BehaviorSubject<BnBioNetworkOptions> = new BehaviorSubject({
    action: 'init',
    visibleLevels: [BnBioNetworkMetaboliteLevel.MAJOR],
    showTexts: false,
    showGrid: false,
    showArrows: false,
    showParticles: false,
    particleSize: 3,
    particleSpeedThreshold: 0.1,
    particleDensityThreshold: 0.1,
    particleColorScale: 'linear',
    coloredClusters: [],
  });

  public init(): void {
    // clear the pathway selection when the state is reset
    this.emitConfig('init', { coloredClusters: [] });
  }

  //////////////////////////////// VISIBLE  OPTIONS ////////////////////////////////

  public setVisibleLevels(visibleLevels: BnBioNetworkMetaboliteLevel[]): void {
    this.emitConfig('updateVisibilityLevel', { visibleLevels: visibleLevels });
  }

  public setShowText(showText: boolean): void {
    this.emitConfig('toggleText', { showTexts: showText });
  }

  public setShowGrid(showGrid: boolean): void {
    this.emitConfig('toggleGrid', { showGrid: showGrid });
  }

  public setShowArrows(showArrows: boolean): void {
    this.emitConfig('toggleArrow', { showArrows: showArrows });
  }

  public setShowParticles(showParticles: boolean): void {
    this.emitConfig('particles', { showParticles: showParticles });
  }

  public setParticleSize(particleSize: number): void {
    this.emitConfig('particles', { particleSize: particleSize });
  }

  public setParticleDensityThreshold(particleNbThreshold: number): void {
    this.emitConfig('particles', { particleDensityThreshold: particleNbThreshold });
  }

  public setParticleSpeedThreshold(particleSpeedThreshold: number): void {
    this.emitConfig('particles', { particleSpeedThreshold: particleSpeedThreshold });
  }

  //////////////////////////////// COLOR OPTIONS ////////////////////////////////

  public setParticleColorMode(mode: BnBioNetworkParticleColorScale): void {
    this.emitConfig('color', { particleColorScale: mode });
  }

  public setColoredClusters(clusters: BnBioNetworkClusterSelection[]): void {
    this.emitConfig('color', { coloredClusters: clusters });
  }

  //////////////////////////////// OPTIONS ////////////////////////////////

  public getCurrentOptions(): BnBioNetworkOptions {
    return this.option$.value;
  }

  public getOptions$(): Observable<BnBioNetworkOptions> {
    return this.option$.asObservable();
  }

  private emitConfig(action: BnBioNetworkOptionsAction, config: Partial<BnBioNetworkOptions>): void {
    this.option$.next(Object.assign({}, this.option$.value, config, { action: action }));
  }

  ngOnDestroy(): void {
    this.option$.complete();
  }
}
