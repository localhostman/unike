import { TemplateRef } from "@angular/core";

export interface IBase {
  id?: any | number;
}

export interface IFormFieldBase {
  label: string;
  suffix?: string;
  type?: string;
  hidden?: boolean;
  required?: boolean;
  maxLength?: number;
  multiple?: boolean;
  options?: any[];
  placeholder?: string;
  helpText?: string;
  readOnly?: boolean;
  dataKey?: string;//如不为空则 data[fieldname][dataKey]的值, 否则获取data[fieldname]
  templ?: TemplateRef<any>;//type='custom'
  imagePath?: any;
  imageWidth?: number;
  imageHeight?: number;
  imageChangeFn?: Function;
  buttonClickFn?: Function;//type='button' 
}

export interface IFormField extends IFormFieldBase {
  name: string;
  helpText: string;
}

export interface IFieldRef {
  [key: string]: IFormFieldBase
};