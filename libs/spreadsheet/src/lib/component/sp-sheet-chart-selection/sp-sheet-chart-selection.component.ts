import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ChChartHistogramMode, ChChartType } from '@monorepo/chart';
import { ClHelpService, ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlGlobalValidators } from '@monorepo/front-core-lib/fl-core';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib/fl-portal';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalConfig } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { merge } from 'rxjs';
import { debounceTime, skip } from 'rxjs/operators';

import {
  SpSheetChartConfig,
  SpSpreadsheetChartSerieSelectionInput,
} from '../../model/chart/sp-sheet-chart-config.class';
import {
  SpSheetChart2dSerieSelectionForm,
  SpSheetChartSelectionForm,
  SpSheetChartSelectionFormAdditional,
  SpSheetChartSelectionResult,
  SpSheetSelectionRange,
  SpSpreadsheetChartSelectionInput,
  SpSpreadsheetChartSelectionInputCreate,
  SpSpreadsheetChartSelectionInputUpdate,
} from '../../model/chart/sp-sheet-chart-selection-form.class';
import { SpSpreadsheetState } from '../../state/sp-spreadsheet.state';
import { SpSpreadsheetChartSelectionHelper } from '../../utils/sp-spreadsheet-chart-selection.helper';
import { SpSheetChartSerieSelectionComponent } from '../sp-sheet-chart-serie-selection/sp-sheet-chart-serie-selection.component';

/**
 * Modal component to select value from the spreadsheet to draw a chart
 */
@Component({
  selector: 'sp-sheet-chart-selection',
  templateUrl: './sp-sheet-chart-selection.component.html',
  styleUrls: ['./sp-sheet-chart-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SpSheetChartSelectionComponent implements OnInit, OnDestroy {
  private state = inject(SpSpreadsheetState);
  private portalService = inject(FlPortalService);
  private overlayRef = inject(FlOverlayRef);
  private cdr = inject(ChangeDetectorRef);

  formGp = new FormBuilder().group({
    id: [null as symbol],
    chartType: [null as ChChartType, [Validators.required]],
    dataRange: [null as SpSheetSelectionRange],
    series: [[] as SpSheetChart2dSerieSelectionForm[], Validators.required],
    additionalFields: new FormBuilder().group({
      nbOfBins: [10, [Validators.min(1), FlGlobalValidators.isInteger()]],
      histogramMode: [ChChartHistogramMode.FREQUENCY],
      normalize: [null],
      xAxisLabel: [null],
      yAxisLabel: [null],
      xThreshold: [0.05, Validators.required],
      yThreshold: [0.05, Validators.required],
    }),
  });

  input: SpSpreadsheetChartSelectionInput;

  // nb max of series supported
  ngMaxOfSeries: number = Infinity;

  submitted: boolean = false;

  availableChartTypes: ChChartType[];
  histogramModes = ChChartHistogramMode;

  private readonly hideElementClass: string = 'g-hide-element';

  private formConfig: SpSheetChartConfig;

  private subscriptions: ClSubscriptionHandler = new ClSubscriptionHandler();

  constructor() {
    const input = inject<SpSpreadsheetChartSelectionInput>(FL_PORTAL_DATA);

    this.input = input;
  }

  ngOnInit(): void {
    // subscribe to sheet change and clear the form on change to secure data
    // because selection does not support multi sheet
    this.subscriptions.add(this.state.currentSheet$.pipe(skip(1)).subscribe(() => this.resetForm()));

    this.initForm();

    this.availableChartTypes = this.state.getChartConfigs().map((chartConfig) => chartConfig.getChartType());

    // add a timeout before the listen to prevent event from being fired
    // on patch during init
    setTimeout(() => {
      this.listenToChanges();
    }, 0);
  }

  private initForm(): void {
    if (this.input.mode === 'create') {
      this.initCreate(this.input);
    } else {
      this.initUpdate(this.input);
    }
  }

  private initCreate(input: SpSpreadsheetChartSelectionInputCreate): void {
    if (input.currentSelection) {
      this.formGp.get('dataRange').patchValue(input.currentSelection.toSpSheetSelectionRange());
    }
  }

  private initUpdate(input: SpSpreadsheetChartSelectionInputUpdate): void {
    this.formGp.patchValue(input.selection);
    this.onChartTypeChange(input.selection.chartType);
  }

  private listenToChanges(): void {
    // subscribe to chart type
    this.subscriptions.add(
      this.formGp.get('chartType').valueChanges.subscribe((chartType) => this.onChartTypeChange(chartType))
    );

    // subscribe to chart type and data range change to create series based on data range
    this.subscriptions.add(
      merge(this.formGp.get('chartType').valueChanges, this.formGp.get('dataRange').valueChanges)
        .pipe(debounceTime(100))
        .subscribe(() => this.createSerieFromDataRange())
    );
  }

  submit(): void {
    this.validateForm(this.input.mode);
  }

  createNewChart(): void {
    this.validateForm('create');
  }

  private validateForm(mode: 'create' | 'update'): void {
    this.submitted = true;
    if (this.formGp.valid && !this.maxNbOfSeriesReached) {
      const value: SpSheetChartSelectionForm = this.formGp.getRawValue();
      // if we are in create mode we create a new id
      if (mode === 'create') {
        value.id = Symbol();
      }

      const result: SpSheetChartSelectionResult = {
        formValue: value,
        mode: mode,
      };
      this.overlayRef.dispose(result);
    }
  }

  private onChartTypeChange(chartType: ChChartType): void {
    if (chartType == null) return;
    this.formConfig = this.getConfigForChartType(chartType);

    this.ngMaxOfSeries = this.formConfig.getNbMaxOfSeries();

    // limit the size of the series
    if (this.series.length >= this.ngMaxOfSeries) {
      this.formGp.get('series').patchValue(this.series.slice(0, this.ngMaxOfSeries));
    }
  }

  get series(): SpSheetChart2dSerieSelectionForm[] {
    return this.formGp.get('series').value;
  }

  get chartType(): ChChartType {
    return this.formGp.get('chartType').value;
  }

  showAdditionalField(key: keyof SpSheetChartSelectionFormAdditional): boolean {
    if (this.formConfig == null) return false;
    return this.formConfig.getAdditionalFieldsName().includes(key);
  }

  get additionalFieldFormGp(): UntypedFormGroup {
    return this.formGp.get('additionalFields') as UntypedFormGroup;
  }

  addSerie(): void {
    const serie: SpSheetChart2dSerieSelectionForm = {
      name: SpSpreadsheetChartSelectionHelper.getDefaultSerieName(this.series.length),
      y: null,
      x: null,
    };

    this.openSerieSelection(serie);
  }

  updateSerie(serie: SpSheetChart2dSerieSelectionForm, index: number): void {
    this.openSerieSelection(serie, index);
  }

  deleteSerie(index: number): void {
    // get the series and remove the element
    const series = this.series;
    series.splice(index, 1);
    this.formGp.get('series').patchValue(series);
  }

  private openSerieSelection(serie: SpSheetChart2dSerieSelectionForm, index?: number): void {
    const data: SpSpreadsheetChartSerieSelectionInput = this.formConfig.getSelectSerieConfig(serie);

    // use the top 0 to make the portal appear on top (otherwise it takes all the height)
    const portalConfig: FlPortalConfig = this.portalService.configureAbsolutePortal(
      {
        centerHorizontally: '0',
        top: '0',
      },
      {
        disposeOnNavigation: true,
      }
    );

    this.portalService
      .createPortal(SpSheetChartSerieSelectionComponent, portalConfig, data)
      .detachments()
      .subscribe((newSerie) => this.onSerieUpdated(newSerie, index));

    // hide the current portal during serie selection
    this.hideOverlay();
  }

  private onSerieUpdated(serie?: SpSheetChart2dSerieSelectionForm, index?: number): void {
    // reshow the portal after serie selection
    this.showOverlay();
    if (serie) {
      const series = this.series;
      // updated serie
      if (index != null) {
        series[index] = serie;
        // new serie
      } else {
        series.push(serie);
      }

      this.formGp.get('series').patchValue([...series]);
      this.cdr.markForCheck();
    }
  }

  private hideOverlay(): void {
    this.overlayRef.overlayRef.addPanelClass(this.hideElementClass);
  }

  private showOverlay(): void {
    this.overlayRef.overlayRef.removePanelClass(this.hideElementClass);
  }

  // create the series base on main data selection
  private createSerieFromDataRange(): void {
    const chartType: ChChartType = this.formGp.get('chartType').value;
    const dataRange: SpSheetSelectionRange = this.formGp.get('dataRange').value;

    if (
      ClHelpService.isNullOrEmpty(chartType) ||
      ClHelpService.isNullOrEmpty(dataRange) ||
      this.formGp.get('dataRange').invalid
    ) {
      return;
    }

    const series: SpSheetChart2dSerieSelectionForm[] = this.formConfig.createSeriesFromDataRange(
      this.state.currentSheet,
      dataRange
    );

    this.formGp.get('series').patchValue(series);
    this.cdr.markForCheck();
  }

  private resetForm(): void {
    this.formGp?.reset({
      series: [],
    });
    this.ngMaxOfSeries = Infinity;
  }

  get submitTextButton(): string {
    return this.input.mode === 'create' ? 'spSpreadsheet.create_chart' : 'spSpreadsheet.update_chart';
  }

  private getConfigForChartType(chartType: ChChartType): SpSheetChartConfig {
    return this.state.getChartConfig(chartType);
  }

  get maxNbOfSeries(): number {
    return this.formConfig?.getNbMaxOfSeries() ?? Infinity;
  }

  get maxNbOfSeriesReached(): boolean {
    return this.formGp.value.series.length > this.maxNbOfSeries;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
