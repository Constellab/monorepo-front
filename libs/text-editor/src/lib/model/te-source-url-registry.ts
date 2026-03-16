/**
 * In-memory registry that maps filenames to their full source URLs.
 *
 * When copying blocks (figures, resource views, etc.), the source editor
 * registers the resolved URLs. When pasting into a different document,
 * the block component can look up the source URL to re-download and
 * re-upload the resource.
 *
 * The registry is cleared on each new copy operation.
 */
export class TeSourceUrlRegistry {
  static readonly SOURCE_URL_ATTR = 'data-te-source-url';
  static readonly SOURCE_FILENAME_ATTR = 'data-te-source-filename';

  private static sourceUrls = new Map<string, string>();

  static clear(): void {
    this.sourceUrls.clear();
  }

  static set(filename: string, sourceUrl: string): void {
    this.sourceUrls.set(filename, sourceUrl);
  }

  /**
   * Get the source URL for the given filename.
   * Returns null if no source URL is registered.
   * Does not delete the entry — the registry is cleared on next copy.
   */
  static consume(filename: string): string | null {
    return this.sourceUrls.get(filename) ?? null;
  }
}
