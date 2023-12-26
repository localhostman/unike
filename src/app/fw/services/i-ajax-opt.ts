interface IOpt {
  responseType?: any;
  ignoreCheckRes?: boolean;
  forceRefresh?: boolean;//是否强行加载远程数据
}
export interface IGetOpt extends IOpt {
  cache?: boolean;
  page?: number;
  pageSize?: number;
}
export interface IPostOpt extends IOpt {
  files?: File[];
  prepend?: boolean;
  emitEvent?: boolean;
}
export interface IDeleteOpt extends IOpt {
}
