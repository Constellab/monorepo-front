import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlLangTranslation, FlTranslateObject } from '@monorepo/front-core-lib/fl-translate';

/**
 * Translation file for the Spreadsheet module
 */
const chlChartI18nFr: FlLangTranslation = {
  chChart: {
    export_chart: 'Exporter le graphique au format SVG',
    reset_zoom: 'Réinitialiser le zoom (double clique)',
    serie: 'Série',
    quartile_1: 'Q1',
    quartile_3: 'Q3',
    median: 'Médiane',
    lower_whisker: 'Moustache basse',
    upper_whisker: 'Moustache haute',
    min: 'Min',
    max: 'Max',
    LINE: 'Courbe',
    SCATTER_PLOT: 'Nuage de points',
    VULCANO_PLOT: 'Diagramme en volcan',
    BAR_PLOT: 'Barres',
    HISTOGRAM: 'Histogramme',
    STACKED_PLOT: 'Barres empilées',
    BOX_PLOT: 'Boîte à moustache',
    HEAT_MAP: 'Heat map',
    VENN_DIAGRAM: 'Venn diagram',
    interval: 'Interval',
    value: 'Valeur',
    venn_groups: 'Groupe(s)',
    venn_nb_data: 'Nb de données',
    venn_data: 'Donnée(s)',
    venn_no_data: 'Pas de données',
    tags: 'Tags',
    chart_histogram_mode: 'Mode',
    chart_histogram_mode_FREQUENCY: 'Fréquence',
    chart_histogram_mode_DENSITY: 'Densité',
    chart_histogram_mode_PROBABILITY: 'Probabilité',
  },
};

const chChartI18nEn: FlLangTranslation = {
  chChart: {
    export_chart: 'Export chart as SVG file',
    reset_zoom: 'Reset zoom (double click)',
    serie: 'Series',
    quartile_1: 'Q1',
    quartile_3: 'Q3',
    median: 'Median',
    lower_whisker: 'Lower whisker',
    upper_whisker: 'Upper whisker',
    min: 'Min',
    max: 'Max',
    LINE: 'Line',
    SCATTER_PLOT: 'Scatter plot',
    VULCANO_PLOT: 'Vulcano plot',
    BAR_PLOT: 'Bar plot',
    HISTOGRAM: 'Histogram',
    STACKED_PLOT: 'Stack bar',
    BOX_PLOT: 'Box plot',
    HEAT_MAP: 'Heat map',
    VENN_DIAGRAM: 'Diagramme de venn',
    interval: 'Interval',
    value: 'Value',
    venn_groups: 'Group(s)',
    venn_nb_data: 'Nb of data',
    venn_data: 'Data',
    venn_no_data: 'No data',
    tags: 'Tags',
    chart_histogram_mode: 'Mode',
    chart_histogram_mode_FREQUENCY: 'Frequency',
    chart_histogram_mode_DENSITY: 'Density',
    chart_histogram_mode_PROBABILITY: 'Probability',
  },
};

export const CH_CHART_I18N: FlTranslateObject = {
  [ClSupportedLanguage.en]: chChartI18nEn,
  [ClSupportedLanguage.fr]: chlChartI18nFr,
};
