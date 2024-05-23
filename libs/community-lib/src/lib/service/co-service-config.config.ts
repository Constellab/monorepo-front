export abstract class CoConfig {
  public abstract getSpacePhotoUrl(filename: string): string;
  public abstract getCommunityFrontUrl(): string;
  public abstract getCommunityApiUrl(): string;
}
