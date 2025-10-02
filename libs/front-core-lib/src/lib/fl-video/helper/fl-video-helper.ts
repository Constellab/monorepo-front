export class FlVideoHelper {
  /**
   * Extract YouTube video ID from various YouTube URL formats
   */
  static extractYoutubeVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Generate YouTube thumbnail URL from video URL
   */
  static getYoutubeThumbnail(
    url: string,
    quality: 'default' | 'hqdefault' | 'maxresdefault' = 'hqdefault'
  ): string {
    const videoId = this.extractYoutubeVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    }
    return url; // Fallback to original URL if extraction fails
  }
}
