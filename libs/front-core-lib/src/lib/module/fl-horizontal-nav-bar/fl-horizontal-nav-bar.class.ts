import { FlTranslatableText } from '../fl-translate/model/fl-translate-param';

export interface FlHorizontalNavBarItem {
  label: FlTranslatableText;
  icon: string;
  route: string;
  /**
   * If true, the link will only be active if the url is an exact match.
   */
  linkActiveExact?: boolean;
}
