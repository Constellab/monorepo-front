import { FL_THEME_CLASS } from '@monorepo/front-core-lib/fl-theme';

/**
 * Status interface to describe it with detail
 */
export interface FlStatus<STATUS = string> {
  value: STATUS; // status string
  name: string; // translatable name of the status
  textColorClass: string; // class used to color status text
  backgroundColorClass: string; // class used to color status background
  icon: 'loader' | string; // icon of the status, if loader, a loader will be displayed (no icon)
  description?: string; // description of the status
}

/**
 * Object to list the status with detail
 */
export type FlStatusDict<STATUS extends string = string> = Record<STATUS, FlStatus<STATUS>>;

/**
 * Class that contains generic icon, background class and text class for status
 */
export class FlStatusHelper {
  public static successIcon: string = 'check';
  public static errorIcon: string = 'error';
  public static warningIcon: string = 'warnings';
  public static infoIcon: string = 'info';
  public static runningIcon: string = 'cached';
  public static loaderIcon: string = 'loader'; // show a loader if FlStatus.icon is equal to this value
  public static archivedIcon: string = 'inventory_2';
  public static draftIcon: string = 'hourglass_empty';
  public static stoppedIcon: string = 'stop';
  public static debugIcon: string = 'bug_report';

  public static successBackgroundClass: string = FL_THEME_CLASS.primaryBackground;
  public static errorBackgroundClass: string = FL_THEME_CLASS.warnBackground;
  public static warningBackgroundClass: string = FL_THEME_CLASS.accentBackground;
  public static infoBackgroundClass: string = FL_THEME_CLASS.greyBackground;

  public static successTextClass: string = FL_THEME_CLASS.primaryText;
  public static errorTextClass: string = FL_THEME_CLASS.warnText;
  public static warningTextClass: string = FL_THEME_CLASS.accentText;
  public static infoTextClass: string = FL_THEME_CLASS.greyText;

  public static getSuccessStatus<STATUS = string>(
    value: STATUS,
    name: string,
    icon = FlStatusHelper.successIcon,
    description?: string
  ): FlStatus<STATUS> {
    return {
      name: name,
      value: value,
      textColorClass: FlStatusHelper.successTextClass,
      backgroundColorClass: FlStatusHelper.successBackgroundClass,
      icon: icon,
      description: description,
    };
  }

  public static getErrorStatus<STATUS = string>(
    value: STATUS,
    name: string,
    icon = FlStatusHelper.errorIcon,
    description?: string
  ): FlStatus<STATUS> {
    return {
      name: name,
      value: value,
      textColorClass: FlStatusHelper.errorTextClass,
      backgroundColorClass: FlStatusHelper.errorBackgroundClass,
      icon: icon,
      description,
    };
  }

  public static getWarningStatus<STATUS = string>(
    value: STATUS,
    name: string,
    icon = FlStatusHelper.warningIcon,
    description?: string
  ): FlStatus<STATUS> {
    return {
      name: name,
      value: value,
      textColorClass: FlStatusHelper.warningTextClass,
      backgroundColorClass: FlStatusHelper.warningBackgroundClass,
      icon: icon,
      description: description,
    };
  }

  public static getInfoStatus<STATUS = string>(
    value: STATUS,
    name: string,
    icon = FlStatusHelper.infoIcon,
    description?: string
  ): FlStatus<STATUS> {
    return {
      name: name,
      value: value,
      textColorClass: FlStatusHelper.infoTextClass,
      backgroundColorClass: FlStatusHelper.infoBackgroundClass,
      icon: icon,
      description: description,
    };
  }

  //////////////////////// SPECIFIC STATUS //////////////////////

  public static getRunningStatus<STATUS = string>(value: STATUS, name: string): FlStatus<STATUS> {
    return FlStatusHelper.getInfoStatus(value, name, FlStatusHelper.runningIcon);
  }

  public static getLoadingStatus<STATUS = string>(value: STATUS, name: string): FlStatus<STATUS> {
    return FlStatusHelper.getInfoStatus(value, name, FlStatusHelper.loaderIcon);
  }

  public static getDraftStatus<STATUS = string>(value: STATUS, name: string): FlStatus<STATUS> {
    return FlStatusHelper.getInfoStatus(value, name, FlStatusHelper.draftIcon);
  }

  public static getStoppedStatus<STATUS = string>(value: STATUS, name: string): FlStatus<STATUS> {
    return FlStatusHelper.getInfoStatus(value, name, FlStatusHelper.stoppedIcon);
  }

  public static getCriticalStatus<STATUS = string>(value: STATUS, name: string): FlStatus<STATUS> {
    return FlStatusHelper.getErrorStatus(value, name, FlStatusHelper.errorIcon);
  }

  public static getDebugStatus<STATUS = string>(value: STATUS, name: string): FlStatus<STATUS> {
    return FlStatusHelper.getInfoStatus(value, name, FlStatusHelper.debugIcon);
  }
}
