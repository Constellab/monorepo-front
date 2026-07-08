import { MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MatTooltipDefaultOptions } from '@angular/material/tooltip';

/**
 * Default configuration for the form-field
 */
export const FL_MAT_FORM_FIELD_CONFIG: MatFormFieldDefaultOptions = {
  appearance: 'outline',
  floatLabel: 'auto',
  hideRequiredMarker: false,
};

/**
 * Default configuration for the tooltip
 */
export const FL_TOOLTIP_CONFIG: MatTooltipDefaultOptions = {
  showDelay: 0,
  hideDelay: 0,
  touchendHideDelay: 0,
};

/**
 * Higher class of a cdk overlay
 */
export const FL_CDK_OVERLAY_CONTAINER_CLASS = 'cdk-overlay-container';
// Panel element of an overlay that is movable and resizable
export const FL_CDK_OVERLAY_PANEL_CLASS = 'cdk-overlay-pane';
