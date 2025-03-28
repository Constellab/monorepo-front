/**
 * Generic convert for search in lab entities
 */
export class LiSearchConverter {
  /**
   * If check, return null (meaning no filters)
   * If null or false, return false
   * @param checked
   */
  public static includeAllOnCheck(checked: boolean): boolean | null {
    if (!checked) {
      return false;
    } else {
      return null;
    }
  }

  /**
   * If false or null, return null (meaning no filters)
   * If true, return false
   * @param checked
   */
  public static excludeAllOnCheck(checked: boolean): boolean | null {
    if (!checked) {
      return null;
    } else {
      return false;
    }
  }
}
