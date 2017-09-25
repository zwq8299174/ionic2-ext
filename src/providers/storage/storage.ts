export interface Options {
  dirname?: string;
  filename: string;
}

export interface SaveOptions extends Options {
  content: any;
}

export interface LoadOptions extends Options {
  maxAge?: number;
}

export interface RemoveOptions extends Options {
}

export interface Storage {
  save(options: SaveOptions): Promise<any>;

  load<T>(options: LoadOptions): Promise<T>;

  remove(options: RemoveOptions): Promise<any>;
}