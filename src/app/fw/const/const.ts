export const MEDIA_WIDTH = {
  NONE: 0,
  XS: 370,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
  XXXL: 1600
}
export const RES_TYPE: {
  INIT: string,
  SUCCESS: string,
  FAIL: string,
  NEED_LOGIN: string,
  EXPIRED: string,
} = {
  INIT: "init",
  SUCCESS: "success",
  FAIL: "fail",
  NEED_LOGIN: "needlogin",
  EXPIRED: "expired",
}
export const PAGE_MODE: {
  CONCAT: number,
  RELOAD: number
} = {
  CONCAT: 1,
  RELOAD: 2
}

export enum PAGE_TYPE {
  TAB,
  PAGE,
  DYNAMIC_PAGE,
  MODAL
};

export const FROM = {
  PC: "pc",
  MWEB: "mweb",
  MP: "mp",
  WXWEB: "wxweb"
}

export const FORM_FIELD_TYPE = {
  IMAGE: "image",
  STRING: "string",
  LONG_STRING: "long_string",
  SELECT: "select",
  BOOLEAN: "boolean",
  NUMBER: "number",
  PASSWORD: "password",
  BUTTON: "button",
  CUSTOM: "custom"
};

export const FILE_PREFIX = "file_";
export const ALL = "all";
export const DEFAULT_IMAGE = "assets/imgs/no-image.jpg";
export const DEFAULT_AVATAR: string = "assets/imgs/anonymous.png";
export const CF_MSG = "网络连接失败, 请稍后重试";
export const SUCCESS_MESSAGE = "Operazione con successo";
export const FAIL_MESSAGE = "Operazione falita";
export const FORM_INVALID_MSG = "带星号部分不能为空";
export const EMPTY_MESSAGE = "未找到可用数据";
