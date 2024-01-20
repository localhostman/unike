import { IBase } from '../fw/interfaces/i-data';

export interface ICommonEntity extends IBase {
  Name: string;
}

export interface ISEO {
  title: string;
  description: string;
  h1: string;
  h2: string;
  h3: string;
  slugs: { [key: string]: string },
  slug: string;
}

export interface IUser {
  idno: string;
  TypeId: number;
  NickName: string;
  Logo: string;
  Email: string;
}

export interface IShop {
  idno: string;
  TypeId: number;
  LogoUrl: string;
  Address: string;
  City: string;
  Zip: string;
  Province: string;
  PIva: string;
  CF: string;
  Phone: string;
  Latitude: string;
  Longitude: string;
  Name: string;
  Detail: string;
  ServiceAppId: string;
  Email: string;
  OpenTime: string;
}

export interface IAd extends IBase {
  idno: string;
  Title: string;
  Text: string;
  UrlPath: string;
  ImgPath: string;
}

export interface ICategory extends IBase {
  idno: string;
  Name: string;
  ImgPath: string;
  Children: ICategory[];
}

export interface IProduct extends IBase {
  idno: string;
  Quantity: number;
  Code: string;
  CategoryId: string;
  CategoryId2: string;
  Name: string;
  PackQuantity: number;
  UM: string;
  Weight: number;
  ImgPath: string;
  Image: string;
  OrigImage: string;
  Label: string;
  Detail: string;
  Props: any;
  PropImages: any;
  PropStocks: any;
  TaxLessPrice: number;
  Price: number;
  Mailable: number;
  Recommend: number;
  Discount: number;
  Iva: number;
  OrderedCount: number;
  SoldCount: number;
  MaxNumPerOrder: number;
  EnableStock: number;
  Stock: number;
  Valutate: number;
  ValutateCount: number;
  ImageCount: number;
  ImageLTime: string;
  CTime: string;
  Accessible: number;
  ValuableMoa: boolean;
  ValuableMoaFinal: boolean;
  AddGift: boolean;
  AsGift: boolean;
  Level: number;
  LTime: number;
}

export interface IProductProp {
  idno: string;
  Name: string;
  Note: string;
  TaxLessPrice: number;
  Price: number;
  Type: string;
  Value: string;
  Children: IProductProp[];
  CategoryId: string[];
}

export interface ICart extends IProduct {
  uniqueKey: string;
  PropIdno: string;
  Timestamp: number;
  Total: number;
  Note: string;
}

export interface ICartRef {
  [key: string]: {
    idno: string,
    PropIdno: string,
    Quantity: number,
    Timestamp: number
  };
}

export interface IWeightFare {
  From: number;
  To: number;
  Rate: number;
  Fare: number;
}

export interface IDeliveryMethod {
  id: number;
  TypeId: number;
  Name: string;
  Detail: string;
  WeightFare: any;
  MinimumOrderAmount: number;
  TransportFare: number;
  Discount: number;
  MaxDistance: number;
  SupportedPayments: string;
  SupportedCategories: string[];
  AcceptedCategories: string[];
}

export interface IPaymentMethod {
  id: number;
  TypeId: number;
  Name: string;
  Detail: string;
}

export interface IAddress extends IBase {
  NameIt: string;
  NameCn: string;
  LastName: string;
  FirstName: string;
  Discount: number;
  Country: string;
  CountryNameIt: string;
  CountryNameCn: string;
  Province: string;
  Zip: string;
  City: string;
  Address: string;
  CF: string;
  PIva: string;
  Phone: string;
  Email: string;
  CodiceDestinatario: string;
  Pec: string;
  CNote: string;
  Note: string;
  Blocked: boolean;
}

export interface ICompany extends IBase {
  Name: string;
  Country: string;
  Province: string;
  Zip: string;
  City: string;
  Address: string;
  CF: string;
  PIva: string;
  Phone: string;
  CodiceDestinatario: string;
  Pec: string;
}

export interface IOrder extends IBase {
  idno: string;
  ShopName: string;
  Name: string;
  AccountHolderInfo: string | IAddress;
  TransportInfo: string | IAddress;
  TotalQuantity: number;
  TaxLessAmount: number;
  Amount: number;
  TransportFare: number;
  Discount: number;
  PercentDiscount: number;
  ExchangeRate: number;
  AmountToPay: number;
  AmountPaid: number;
  AmountPaidCurrency: string;
  RefundAmount: number;
  DeliveryMethodId: number;
  DeliveryMethodName: string;
  PaymentMethodId: number;
  PaymentMethodName: string;
  PaymentStateId: number;
  PaymentStateName: string;
  StateId: number;
  StateName: string;
  ValutateId: number;
  CNote: string;
  CDate: string;
  ImageCount: number;
  ProductName: string;
  Products: IOrderProduct[],
  Return: any;
  CTime: string;
  ShippingMethod: string;
  ShippingTrackingNumber: string;
}

export interface IOrderProduct extends ICart {
  TaxLessTotal: number;
  Total: number;
  CNote: string;
  Valutate: number;
  RefundQuantity: number;
  FinalPrice: number;
}

export interface IValutate extends IBase {
  UserId: string;
  NickName: string;
  Logo: string;
  Vote: number;
  Comment: string;
  Like: number;
}

export interface IPromo extends IBase {
  selected: boolean;
  TypeId: number;
  Name: string;
  StartDate: string;
  EndDate: string;
  UseStartDate: string;
  UseEndDate: string;
  Duration: number;
  NumPerDay: number;
  CurCount: number;
  MaxCount: number;
  Moa: number;
  Bonus: number;
  AutoGet: number;
  Stackable: number;
  OrderId: string;
  StateId: number;
  Time: number;
}