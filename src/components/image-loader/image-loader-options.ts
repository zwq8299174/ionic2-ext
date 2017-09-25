export interface ImageLoaderOptions {
  spinnerEnabled?: boolean;
  spinnerName?: string;
  spinnerColor?: string;
  backgroundSize?: string;
  backgroundRepeat?: string;
  display?: string;
  width?: string;
  height?: string;
  useImg?: boolean;
  fallbackUrl?: string;
  cacheDirectoryName?: string;
  concurrency?: number;
  maxCacheSize?: number;
  maxCacheAge?: number;
  imageReturnType?: 'base64' | 'uri';
  fallbackAsPlaceholder?: boolean;
}